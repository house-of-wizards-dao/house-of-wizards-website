import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getServiceSupabase } from "@/lib/supabase";
import { requireAdmin, AuthenticatedUser } from "@/lib/auth";
import {
  createApiHandler,
  sendSuccess,
  ApiValidationError,
  ApiErrorCode,
} from "@/lib/api-middleware";
import { logger } from "@/lib/logger";
import { cacheManager } from "@/lib/cache-manager";

// Validation schemas for bulk operations
const bulkUserOperationSchema = z.object({
  operation: z.enum(["delete", "update_role", "ban", "unban"]),
  userIds: z.array(z.string().uuid()).min(1).max(100), // Limit to 100 at a time
  params: z
    .object({
      role: z.enum(["user", "admin", "moderator", "council_member"]).optional(),
      reason: z.string().max(500).optional(),
    })
    .optional(),
});

const bulkContentOperationSchema = z.object({
  operation: z.enum(["delete", "approve", "reject", "feature"]),
  contentIds: z.array(z.string().uuid()).min(1).max(200), // Limit to 200 at a time
  params: z
    .object({
      reason: z.string().max(500).optional(),
    })
    .optional(),
});

const bulkExportSchema = z.object({
  type: z.enum(["users", "content", "analytics"]),
  format: z.enum(["csv", "json"]).default("csv"),
  filters: z
    .object({
      dateFrom: z.string().datetime().optional(),
      dateTo: z.string().datetime().optional(),
      role: z.string().optional(),
      status: z.string().optional(),
    })
    .optional(),
});

async function bulkOperationsHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser,
) {
  const supabaseAdmin = getServiceSupabase();

  if (req.method === "POST") {
    const { operation_type } = req.query;

    try {
      switch (operation_type) {
        case "users":
          await handleBulkUserOperations(req, res, user, supabaseAdmin);
          break;
        case "content":
          await handleBulkContentOperations(req, res, user, supabaseAdmin);
          break;
        case "export":
          await handleBulkExport(req, res, user, supabaseAdmin);
          break;
        default:
          throw new ApiValidationError(
            ApiErrorCode.BAD_REQUEST,
            "Invalid operation type. Must be: users, content, or export",
          );
      }
    } catch (error) {
      logger.error("Bulk operation failed", {
        error,
        operationType: operation_type,
        userId: user.id,
      });
      throw error;
    }
  }
}

async function handleBulkUserOperations(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser,
  supabaseAdmin: any,
) {
  const validatedData = bulkUserOperationSchema.parse(req.body);
  const { operation, userIds, params } = validatedData;

  const startTime = Date.now();
  let successCount = 0;
  const errors: Array<{ userId: string; error: string }> = [];

  logger.info("Starting bulk user operation", {
    operation,
    userCount: userIds.length,
    adminId: user.id,
  });

  // Process in batches to avoid overwhelming the database
  const BATCH_SIZE = 20;
  const batches = [];
  for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
    batches.push(userIds.slice(i, i + BATCH_SIZE));
  }

  for (const batch of batches) {
    const batchPromises = batch.map(async (userId) => {
      try {
        switch (operation) {
          case "delete":
            await supabaseAdmin
              .from("profiles")
              .update({ deleted_at: new Date().toISOString() })
              .eq("id", userId)
              .is("deleted_at", null);
            break;

          case "update_role":
            if (!params?.role) {
              throw new Error(
                "Role parameter required for update_role operation",
              );
            }
            await supabaseAdmin
              .from("profiles")
              .update({
                role: params.role,
                updated_at: new Date().toISOString(),
              })
              .eq("id", userId)
              .is("deleted_at", null);
            break;

          case "ban":
            await supabaseAdmin
              .from("profiles")
              .update({
                metadata: {
                  banned: true,
                  ban_reason: params?.reason || "Admin action",
                },
                updated_at: new Date().toISOString(),
              })
              .eq("id", userId)
              .is("deleted_at", null);
            break;

          case "unban":
            await supabaseAdmin
              .from("profiles")
              .update({
                metadata: { banned: false },
                updated_at: new Date().toISOString(),
              })
              .eq("id", userId)
              .is("deleted_at", null);
            break;
        }

        // Log the action in audit log
        await supabaseAdmin.from("admin_audit_log").insert({
          admin_user_id: user.id,
          action: `bulk_${operation}`,
          target_table: "profiles",
          target_id: userId,
          new_values: params,
          ip_address:
            req.headers["x-forwarded-for"] || req.socket?.remoteAddress,
          user_agent: req.headers["user-agent"],
        });

        successCount++;
      } catch (error) {
        errors.push({
          userId,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        logger.error("Bulk operation failed for user", {
          userId,
          error,
          operation,
        });
      }
    });

    await Promise.all(batchPromises);
  }

  // Invalidate cache after bulk operations
  await cacheManager.invalidateByTags(["admin", "profiles", "users"]);

  const duration = Date.now() - startTime;

  logger.info("Bulk user operation completed", {
    operation,
    totalUsers: userIds.length,
    successCount,
    errorCount: errors.length,
    duration,
    adminId: user.id,
  });

  sendSuccess(
    res,
    {
      operation,
      totalProcessed: userIds.length,
      successCount,
      errorCount: errors.length,
      errors: errors.slice(0, 10), // Limit error details in response
      duration,
    },
    `Bulk ${operation} operation completed`,
  );
}

async function handleBulkContentOperations(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser,
  supabaseAdmin: any,
) {
  const validatedData = bulkContentOperationSchema.parse(req.body);
  const { operation, contentIds, params } = validatedData;

  const startTime = Date.now();
  let successCount = 0;
  const errors: Array<{ contentId: string; error: string }> = [];

  logger.info("Starting bulk content operation", {
    operation,
    contentCount: contentIds.length,
    adminId: user.id,
  });

  // Process in smaller batches for content operations
  const BATCH_SIZE = 50;
  const batches = [];
  for (let i = 0; i < contentIds.length; i += BATCH_SIZE) {
    batches.push(contentIds.slice(i, i + BATCH_SIZE));
  }

  for (const batch of batches) {
    const batchPromises = batch.map(async (contentId) => {
      try {
        switch (operation) {
          case "delete":
            await supabaseAdmin
              .from("file_descriptions")
              .update({ deleted_at: new Date().toISOString() })
              .eq("id", contentId)
              .is("deleted_at", null);
            break;

          case "approve":
            await supabaseAdmin
              .from("file_descriptions")
              .update({
                status: "published",
                updated_at: new Date().toISOString(),
              })
              .eq("id", contentId)
              .is("deleted_at", null);
            break;

          case "reject":
            await supabaseAdmin
              .from("file_descriptions")
              .update({
                status: "archived",
                updated_at: new Date().toISOString(),
              })
              .eq("id", contentId)
              .is("deleted_at", null);
            break;

          case "feature":
            await supabaseAdmin
              .from("file_descriptions")
              .update({
                is_featured: true,
                status: "published",
                updated_at: new Date().toISOString(),
              })
              .eq("id", contentId)
              .is("deleted_at", null);
            break;
        }

        successCount++;
      } catch (error) {
        errors.push({
          contentId,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    });

    await Promise.all(batchPromises);
  }

  // Invalidate content cache
  await cacheManager.invalidateByTags(["admin", "content"]);

  const duration = Date.now() - startTime;

  sendSuccess(
    res,
    {
      operation,
      totalProcessed: contentIds.length,
      successCount,
      errorCount: errors.length,
      errors: errors.slice(0, 10),
      duration,
    },
    `Bulk ${operation} operation completed`,
  );
}

async function handleBulkExport(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser,
  supabaseAdmin: any,
) {
  const validatedData = bulkExportSchema.parse(req.body);
  const { type, format, filters } = validatedData;

  logger.info("Starting bulk export", {
    type,
    format,
    filters,
    adminId: user.id,
  });

  let data: any[] = [];
  let filename = "";

  switch (type) {
    case "users":
      const { data: users } = await supabaseAdmin
        .from("active_profiles")
        .select("id, name, email, role, created_at, updated_at")
        .order("created_at", { ascending: false });
      data = users || [];
      filename = `users_export_${new Date().toISOString().split("T")[0]}.${format}`;
      break;

    case "content":
      const { data: content } = await supabaseAdmin
        .from("active_file_descriptions")
        .select(
          `
          id, file_name, description, file_type, status, 
          is_featured, created_at, user_id,
          profiles!inner(name, email)
        `,
        )
        .order("created_at", { ascending: false });
      data = content || [];
      filename = `content_export_${new Date().toISOString().split("T")[0]}.${format}`;
      break;

    case "analytics":
      // Get analytics data
      const { data: analytics } = await supabaseAdmin.rpc(
        "get_admin_dashboard_stats",
      );
      data = analytics || [];
      filename = `analytics_export_${new Date().toISOString().split("T")[0]}.${format}`;
      break;
  }

  if (format === "csv") {
    const csv = convertToCSV(data);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csv);
  } else {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.json(data);
  }
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((row) =>
    Object.values(row)
      .map((val) =>
        typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val,
      )
      .join(","),
  );

  return [headers, ...rows].join("\n");
}

// Create API handler with comprehensive middleware
const handler = createApiHandler(requireAdmin(bulkOperationsHandler), {
  methods: ["POST"],
  rateLimit: { maxRequests: 10, windowMs: 300000 }, // 10 requests per 5 minutes
  cors: true,
  monitoring: {
    trackPerformance: true,
    logRequests: true,
  },
});

export default handler;
