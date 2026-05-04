import {
  CurationError,
  type CurationErrorCode,
  type GenerateCurationInput,
  type GenerateCurationOutput,
} from "@/entities/curation";

const ENDPOINT = "/api/admin/curation/generate";

const KNOWN_CODES: ReadonlySet<CurationErrorCode> = new Set<CurationErrorCode>([
  "INSUFFICIENT_RECIPES",
  "VALIDATION_FAILED",
  "LLM_ERROR",
]);

// Route Handler 호출용 — server action 의 generateCuration 과 동일 시그니처를
// 흉내내서 batch 호출자가 transparently 교체 가능하게 한다. 서버 액션은
// 같은 router 인스턴스에서 큐잉되므로 batch fan-out 에는 부적합 — 그래서 별도
// fetch endpoint 를 만든 것. CurationError 는 422 응답 body 의 code/meta 에서
// 복원해 throw, 다른 에러는 일반 Error.
export const generateCurationViaApi = async (
  input: GenerateCurationInput,
): Promise<GenerateCurationOutput> => {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (res.ok) {
    return (await res.json()) as GenerateCurationOutput;
  }

  let payload: { error?: string; code?: string; meta?: Record<string, unknown> | null } = {};
  try {
    payload = (await res.json()) as typeof payload;
  } catch {
    // body 가 JSON 이 아니면 status text 만 들고 Error throw
  }

  if (
    res.status === 422 &&
    typeof payload.code === "string" &&
    KNOWN_CODES.has(payload.code as CurationErrorCode)
  ) {
    throw new CurationError(
      payload.code as CurationErrorCode,
      payload.error ?? "Curation generate failed",
      payload.meta ?? undefined,
    );
  }

  throw new Error(
    `generateCurationViaApi failed (${res.status}): ${payload.error ?? res.statusText}`,
  );
};
