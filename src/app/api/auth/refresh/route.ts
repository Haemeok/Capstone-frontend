import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { BASE_API_URL, END_POINTS } from "@/shared/config/constants/api";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const origin = request.headers.get("origin");

    const baseUrl = BASE_API_URL;

    const response = await fetch(`${baseUrl}${END_POINTS.TOKEN_REFRESH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        Cookie: cookieStore.toString(),
        ...(origin && { Origin: origin }),
      },
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("3. 백엔드 에러 내용:", errorBody);
      return NextResponse.json(
        { error: "Token refresh failed" },
        { status: response.status }
      );
    }

    const data = await response.json();

    const nextResponse = NextResponse.json(data);

    const setCookieHeaders = response.headers.getSetCookie();
    setCookieHeaders.forEach((cookie) => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });

    return nextResponse;
  } catch (error) {
    console.error("Token refresh API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
