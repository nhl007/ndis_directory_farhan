import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      fullName: string | null | undefined;
      id?: string | null | undefined;
      discourse_id?: string | number | null | undefined;
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    };
  }
}
