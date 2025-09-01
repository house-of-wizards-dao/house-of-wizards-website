import { NextApiRequest } from "next";
import { User } from "./index";

// Extend NextApiRequest to include user and ip properties added by middleware
declare module "next" {
  interface NextApiRequest {
    user?: User & { role?: string };
    ip?: string;
  }
}

// Alternative interface for explicit type checking
export interface AuthenticatedApiRequest extends NextApiRequest {
  user: User & { role?: string };
  ip: string;
}

// Helper type for optional authentication
export interface OptionalAuthApiRequest extends NextApiRequest {
  user?: User & { role?: string };
  ip?: string;
}
