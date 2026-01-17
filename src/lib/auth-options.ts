/**
 * NextAuth configuration options
 * Exported separately so it can be used by both the auth route and server-side helpers
 */
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";

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

          console.log("SIWE verify - message domain:", siwe.domain);
          console.log("SIWE verify - expected domain:", nextAuthUrl.host);

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
          });

          if (result.success) {
            console.log("SIWE verification successful for:", siwe.address);
            return {
              id: siwe.address,
            };
          }
          console.error("SIWE verification failed - result:", result);
          return null;
        } catch (e) {
          console.error("SIWE verification exception:", e);
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
