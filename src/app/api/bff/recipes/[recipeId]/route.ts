import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

import { BASE_API_URL } from "@/shared/config/constants/api";
import { CACHE_TAGS } from "@/shared/config/constants/cache-tags";

type RouteContext = {
  params: Promise<{ recipeId: string }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { recipeId } = await context.params;

    const body = await request.json();
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");

    const backendRes = await fetch(`${BASE_API_URL}/recipes/${recipeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      const errorBody = await backendRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorBody },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();

    revalidateTag(CACHE_TAGS.recipe(recipeId));
    revalidateTag(CACHE_TAGS.recipesAll);
    revalidateTag(CACHE_TAGS.recipesPopular);

    return NextResponse.json(data);
  } catch (error) {
    console.error("[BFF PUT /api/bff/recipes/[recipeId]] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(context: RouteContext) {
  try {
    const { recipeId } = await context.params;

    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");

    const backendRes = await fetch(`${BASE_API_URL}/recipes/${recipeId}`, {
      method: "DELETE",
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (!backendRes.ok) {
      const errorBody = await backendRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorBody },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json().catch(() => ({}));

    revalidateTag(CACHE_TAGS.recipe(recipeId));
    revalidateTag(CACHE_TAGS.recipesAll);
    revalidateTag(CACHE_TAGS.recipesPopular);

    return NextResponse.json(data);
  } catch (error) {
    console.error("[BFF DELETE /api/bff/recipes/[recipeId]] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
