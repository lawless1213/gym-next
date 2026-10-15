export const AUTH_ERRORS: Record<string, string> = {
  "auth/invalid-credential": "Неправильний email або пароль.",
  "auth/user-disabled": "Цей акаунт було заблоковано.",
  "auth/too-many-requests": "Забагато спроб. Спробуйте пізніше.",
  "auth/network-request-failed": "Проблема з мережею. Перевірте з'єднання.",
  default: "Сталася помилка. Спробуйте ще раз.",
};

/** Safely reads `code` from an unknown error (FirebaseError and friends). */
export function getErrorCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    const { code } = error as { code: unknown };
    return typeof code === "string" ? code : undefined;
  }
  return undefined;
}
