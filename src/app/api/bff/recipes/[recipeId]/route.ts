import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { BASE_API_URL } from "@/shared/config/constants/api";
import { invalidateCache } from "@/shared/config/cache";

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

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { recipeId } = await context.params;
    const body = await request.json();
    const cookieHeader = await getCookieHeader();

    const backendRes = await fetch(`${BASE_API_URL}/recipes/${recipeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      return handleBackendError(backendRes);
    }

    const data = await backendRes.json();

    await invalidateCache({ type: "RECIPE_MUTATED", recipeId });

    return NextResponse.json(data);
  } catch (error) {
    console.error("[BFF PUT /api/bff/recipes/[recipeId]] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { recipeId } = await context.params;
    const cookieHeader = await getCookieHeader();

    const backendRes = await fetch(`${BASE_API_URL}/recipes/${recipeId}`, {
      method: "DELETE",
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (!backendRes.ok) {
      return handleBackendError(backendRes);
    }

    const data = await backendRes.json().catch(() => ({}));

    await invalidateCache({ type: "RECIPE_DELETED", recipeId });

    return NextResponse.json(data);
  } catch (error) {
    console.error("[BFF DELETE /api/bff/recipes/[recipeId]] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
