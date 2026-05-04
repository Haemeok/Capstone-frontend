import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ADMIN_USER_ID = "X1BoaJNZ";
const BACKEND_ME_URL = "https://api.recipio.kr/api/me";

// admin 사용자만 통과시킴. 페이지 게이트는 클라이언트뿐이라 (anyone can curl)
// 서버 사이드 체크가 없으면 외부 호출자가 LLM/이미지 비용을 마음껏 태울 수 있다.
// 백엔드 인증은 cookie 기반(Bearer 아님) — 들어온 cookie jar 를 그대로 forward.
//
// 통과면 null, 실패면 즉시 반환할 NextResponse 를 돌려준다.
export const assertAdmin = async (): Promise<NextResponse | null> => {
  const cookieStore = await cookies();
  if (!cookieStore.get("accessToken")?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let user: { id?: string };
  try {
    const res = await fetch(BACKEND_ME_URL, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Unauthorized", upstream: res.status },
        { status: 401 },
      );
    }
    user = (await res.json()) as { id?: string };
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.id !== ADMIN_USER_ID) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
};
