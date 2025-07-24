import { User } from "@/entities/user/model/types";

export type AuthStatus = "authenticated" | "unauthenticated" | "expired";

export type ServerAuthResult = {
  status: AuthStatus;
  user?: User;
};

export function isAuthenticated(
  result: ServerAuthResult
): result is ServerAuthResult & { user: User } {
  return result.status === "authenticated" && !!result.user;
}

export function isTokenExpired(result: ServerAuthResult): boolean {
  return result.status === "expired";
}

export function isUnauthenticated(result: ServerAuthResult): boolean {
  return result.status === "unauthenticated";
}
