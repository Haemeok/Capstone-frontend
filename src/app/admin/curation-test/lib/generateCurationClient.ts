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
