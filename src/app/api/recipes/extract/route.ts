import { NextRequest, NextResponse } from "next/server";
import { BASE_API_URL, END_POINTS } from "@/shared/config/constants/api";

export const maxDuration = 300; // 5분 (Pro Plan 기준)
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { message: "URL 파라미터가 필요합니다." },
        { status: 400 }
      );
    }

    const backendUrl = `${BASE_API_URL}${END_POINTS.RECIPE_EXTRACT}?url=${encodeURIComponent(
      url
    )}`;

    const cookieHeader = req.headers.get("cookie") || "";
    const authHeader = req.headers.get("authorization") || "";

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
        Authorization: authHeader,
      },
      // 기존 클라이언트 코드에서 body는 null로 보냈으므로 여기서도 body 생략 또는 null
    });

    // 응답 파싱
    let data;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Youtube Import Proxy Error:", error);
    return NextResponse.json(
      { message: "레시피 추출 중 서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
