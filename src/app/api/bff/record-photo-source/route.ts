import { IMAGE_BASE_URL } from "@/shared/config/constants/recipe";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export const GET = async (request: Request) => {
  const source = new URL(request.url).searchParams.get("url");
  let url: URL;
  try {
    url = new URL(source ?? "");
  } catch {
    return new Response(null, { status: 400 });
  }
  const allowed = new URL(IMAGE_BASE_URL);
  if (
    url.origin !== allowed.origin ||
    !url.pathname.startsWith(allowed.pathname) ||
    url.username ||
    url.password
  ) {
    return new Response(null, { status: 400 });
  }

  try {
    const upstream = await fetch(url.href, {
      redirect: "error",
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    const type = upstream.headers.get("content-type")?.split(";")[0] ?? "";
    if (!upstream.ok || !IMAGE_TYPES.has(type) || !upstream.body) {
      await upstream.body?.cancel();
      return new Response(null, { status: 502 });
    }
    const reader = upstream.body.getReader();
    const chunks: Uint8Array<ArrayBuffer>[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_IMAGE_BYTES) {
        await reader.cancel();
        return new Response(null, { status: 413 });
      }
      chunks.push(new Uint8Array(value));
    }
    if (!size) return new Response(null, { status: 502 });
    return new Response(new Blob(chunks, { type }), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
};
