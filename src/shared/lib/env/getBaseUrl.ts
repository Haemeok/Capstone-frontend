import { NextRequest } from "next/server";

export const getBaseUrlFromRequest = (request: NextRequest): string => {
  const host = request.headers.get("host");

  if (!host) {
    if (process.env.NEXT_PUBLIC_BASE_URL) {
      return process.env.NEXT_PUBLIC_BASE_URL;
    }
    return "http://localhost:3000/";
  }

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  return `${protocol}://${host}/`;
};