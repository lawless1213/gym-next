/** Firebase Auth error code → key under `auth.errors` in messages/*.json. */
const AUTH_ERROR_KEYS = {
  "auth/invalid-credential": "invalidCredential",
  "auth/user-disabled": "userDisabled",
  "auth/too-many-requests": "tooManyRequests",
  "auth/network-request-failed": "network",
  "auth/account-exists-with-different-credential": "accountExistsWithDifferentCredential",
} as const;

export type AuthErrorKey = (typeof AUTH_ERROR_KEYS)[keyof typeof AUTH_ERROR_KEYS] | "default";

/** Translation key for an auth error, e.g. `t("errors." + authErrorKey(err))` with `useTranslations("auth")`. */
export function authErrorKey(error: unknown): AuthErrorKey {
  const code = getErrorCode(error);
  return (code && AUTH_ERROR_KEYS[code as keyof typeof AUTH_ERROR_KEYS]) || "default";
}

/** Safely reads `code` from an unknown error (FirebaseError and friends). */
export function getErrorCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    const { code } = error as { code: unknown };
    return typeof code === "string" ? code : undefined;
  }
  return undefined;
}
