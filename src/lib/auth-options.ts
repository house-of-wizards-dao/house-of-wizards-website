/**
 * NextAuth configuration options
 * Exported separately so it can be used by both the auth route and server-side helpers
 */
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";
import { logger } from "@/lib/logger";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          // The message comes as a plain SIWE text string, not JSON
          const siwe = new SiweMessage(credentials?.message || "");
          const nextAuthUrl = new URL(
            process.env.NEXTAUTH_URL || "http://localhost:3000",
          );

          logger.debug("SIWE verify domain check", {
            messageDomain: siwe.domain,
            expectedDomain: nextAuthUrl.host,
          });

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
          });

          if (result.success) {
            logger.info("SIWE verification successful", {
              address: siwe.address,
            });
            return {
              id: siwe.address,
            };
          }
          logger.error("SIWE verification failed", { result });
          return null;
        } catch (e) {
          logger.error("SIWE verification exception", e);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.address = token.sub;
      session.user = {
        name: token.sub,
      };
      return session;
    },
  },
};
