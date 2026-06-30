export type ErrorBody = { code?: string; message?: string };

export const isErrorBody = (body: unknown): body is ErrorBody =>
  typeof body === "object" && body !== null;

export type LocalizedResultMiss =
  | { kind: "notTranslated"; message: string }
  | { kind: "notFound" };
