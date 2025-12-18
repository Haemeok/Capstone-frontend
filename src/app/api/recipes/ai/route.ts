import { NextRequest, NextResponse } from "next/server";
import { BASE_API_URL } from "@/shared/config/constants/api";

// Vercel Serverless Function Timeout 설정 (초 단위)
export const maxDuration = 300; 
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const searchParams = req.nextUrl.searchParams;
    const concept = searchParams.get("concept");
    const source = searchParams.get("source") || "AI";

    const backendUrl = `${BASE_API_URL}/recipes/ai?concept=${concept}&source=${source}`;

    const cookieHeader = req.headers.get("cookie") || "";
    const authHeader = req.headers.get("authorization") || "";

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    
    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error("AI Recipe Proxy Error:", error);
    return NextResponse.json(
      { message: "AI 레시피 생성 중 서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

