import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const stringifyResponse = (data: any) => {
  return JSON.stringify(data);
};

export const generateSelectDefault = (data: string[]) => {
  if (data && data[0]) {
    const r = data.map((v) => {
      return { value: v, label: v };
    });
    return r;
  } else {
    return [];
  }
};

export const extractPostcode = (inputString: string) => {
  //!regex pattern
  const postcodeRegex = /\b\d{4,5}\b/;

  const match = inputString.match(postcodeRegex);

  return match ? match[0] : "";
};

export const rgbToHex = (rgb: string): string => {
  const match = rgb.match(/\((\d+),\s*(\d+),\s*(\d+)\)/);

  if (!match) {
    return "";
  }

  const [, r, g, b] = match.map(Number);

  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    throw new Error("RGB values should be between 0 and 255");
  }

  const hex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
  return `#${hex}`;
};

export function generateHmacSha256(base64Payload: string) {
  const secret = process.env.DISCOURSE_SSO_SECRET as string;

  const secretKey = Buffer.from(secret, "utf-8");

  const hmac = crypto.createHmac("sha256", secretKey);
  hmac.update(base64Payload);

  const hexSignature = hmac.digest("hex");
  return hexSignature;
}
