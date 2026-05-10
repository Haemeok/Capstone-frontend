import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { invalidateCache } from "@/shared/config/cache";
import { BASE_API_URL } from "@/shared/config/constants/api";

type RouteContext = {
  params: Promise<{ recipeId: string }>;
};

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
};

const handleBackendError = async (backendRes: Response) => {
  const errorBody = await backendRes.json().catch(() => ({}));
  return NextResponse.json(
    { error: errorBody },
    { status: backendRes.status }
  );
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { recipeId } = await context.params;
    const body = await request.json();
    const cookieHeader = await getCookieHeader();

    const backendRes = await fetch(
      `${BASE_API_URL}/dev/recipes/${recipeId}/visibility`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
        body: JSON.stringify(body),
      }
    );

    if (!backendRes.ok) {
      return handleBackendError(backendRes);
    }

    const data = await backendRes.json().catch(() => ({}));

    await invalidateCache({ type: "RECIPE_MUTATED", recipeId });

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "[BFF PATCH /api/bff/recipes/[recipeId]/visibility] Error:",
      error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
