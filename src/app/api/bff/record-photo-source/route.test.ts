/** @jest-environment node */
import { IMAGE_BASE_URL } from "@/shared/config/constants/recipe";

import { GET } from "./route";

const source = `${IMAGE_BASE_URL}recipes/90121/mw7pftQHqlQ/main_detail.webp`;
const request = (url: string) =>
  new Request(
    `http://localhost/api/bff/record-photo-source?${new URLSearchParams({ url })}`
  );
const upstream = jest.spyOn(globalThis, "fetch");
afterEach(() => upstream.mockReset());
afterAll(() => upstream.mockRestore());

test("returns image bytes without depending on upstream browser CORS headers", async () => {
  upstream.mockResolvedValue(
    new Response(new Uint8Array([1, 2, 3]), {
      headers: { "Content-Type": "image/webp" },
    })
  );
  const response = await GET(request(source));
  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toBe("image/webp");
  expect([...new Uint8Array(await response.arrayBuffer())]).toEqual([1, 2, 3]);
  expect(upstream).toHaveBeenCalledWith(
    source,
    expect.objectContaining({ redirect: "error", cache: "no-store" })
  );
});

test.each([
  "http://127.0.0.1/image.webp",
  "https://example.com/image.webp",
  `${IMAGE_BASE_URL}../private/file`,
  "not-a-url",
])("rejects unsupported source %s before fetching", async (url) => {
  expect((await GET(request(url))).status).toBe(400);
  expect(upstream).not.toHaveBeenCalled();
});

test("does not turn an upstream error into an uploaded photo", async () => {
  upstream.mockResolvedValue(new Response("missing", { status: 404 }));
  expect((await GET(request(source))).status).toBe(502);
});

test("rejects non-image responses", async () => {
  upstream.mockResolvedValue(
    new Response("xml", { headers: { "Content-Type": "application/xml" } })
  );
  expect((await GET(request(source))).status).toBe(502);
});

test("rejects images above the upload size limit", async () => {
  upstream.mockResolvedValue(
    new Response(new Uint8Array(10 * 1024 * 1024 + 1), {
      headers: { "Content-Type": "image/webp" },
    })
  );
  expect((await GET(request(source))).status).toBe(413);
});

test("handles network errors without exposing upstream details", async () => {
  upstream.mockRejectedValue(new Error("upstream failed"));
  expect((await GET(request(source))).status).toBe(502);
});
