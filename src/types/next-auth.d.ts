
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      token?: string;
      role?: string[];
      activeRole?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    token?: string;
    role?: string[];
    activeRole?: string | null;
    roles?: string[]; // API might return "roles"
    _id?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role?: string[];
    activeRole?: string | null;
  }
}
