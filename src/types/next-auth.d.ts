import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    address?: string;
    user?: {
      name?: string | null;
    };
  }
}

