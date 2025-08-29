import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse form data
    const form = formidable({
      maxFiles: 1,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filter: (part) => {
        return part.mimetype?.startsWith("image/") || false;
      },
    });

    const [fields, files] = await form.parse(req);
    
    // Get the uploaded file
    const fileArray = Array.isArray(files.image) ? files.image : [files.image];
    const file = fileArray[0];

    if (!file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Read file buffer
    const fileBuffer = fs.readFileSync(file.filepath);
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExt = path.extname(file.originalFilename || ".jpg");
    const fileName = `auction-${timestamp}-${randomString}${fileExt}`;
    const filePath = `auctions/${fileName}`;

    // Upload to Supabase Storage (using existing "files" bucket)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("files")
      .upload(filePath, fileBuffer, {
        contentType: file.mimetype || "image/jpeg",
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return res.status(500).json({ 
        error: "Failed to upload image",
        details: uploadError.message,
      });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("files")
      .getPublicUrl(filePath);

    // Clean up temp file
    fs.unlinkSync(file.filepath);

    return res.status(200).json({
      success: true,
      images: [{
        url: publicUrlData.publicUrl,
        path: filePath,
        file_name: fileName,
        file_size: file.size,
        mime_type: file.mimetype,
      }],
    });
  } catch (error) {
    console.error("Error uploading auction image:", error);
    return res.status(500).json({
      error: "Failed to upload image",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}