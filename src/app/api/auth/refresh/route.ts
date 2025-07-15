import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { END_POINTS } from "@/shared/config/constants/api";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const origin = request.headers.get("origin");

    // 백엔드 API URL 구성
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_AXIOS_PROD_BASE_URL
        : process.env.NEXT_PUBLIC_AXIOS_DEV_BASE_URL ||
          "https://www.haemeok.com/api";

    // 서버에서 백엔드로 토큰 리프레시 요청
    const response = await fetch(`${baseUrl}${END_POINTS.TOKEN_REFRESH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 클라이언트의 쿠키를 백엔드로 전달
        Cookie: cookieStore.toString(),
        ...(origin && { Origin: origin }),
      },
    });

    console.log("response", response);

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("3. 백엔드 에러 내용:", errorBody);
      return NextResponse.json(
        { error: "Token refresh failed" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 백엔드에서 받은 응답을 클라이언트로 전달
    const nextResponse = NextResponse.json(data);

    // 백엔드에서 설정한 새로운 쿠키를 클라이언트에게 전달
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
