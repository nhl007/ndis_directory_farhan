"use server";

import { decode, encode } from "next-auth/jwt";

const secret = process.env.JWT_SECRET!;

export async function encodeToken(payload: { id: string }) {
  const encoded = await encode({
    secret: secret,
    maxAge: 2 * 60 * 60,
    token: payload,
  });
  return encoded;
}

export async function decodeToken(token: string) {
  try {
    const decoded = await decode({ token: token, secret: secret });
    return decoded;
  } catch (error) {
    return null;
  }
}
