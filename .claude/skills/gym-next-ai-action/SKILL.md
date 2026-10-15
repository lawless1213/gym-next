---
name: gym-next-ai-action
description: Use when adding or changing a Gemini-powered server action in Gym Next (AI routine/schedule/exercise generation or chat).
---

# Gym Next — Gemini server actions

Files live in `lib/actions/gemini/`. Shared pieces:
- `client.ts` — `ai`, `GEMINI_MODEL`, `generateStructured<T>({ prompt, schema })`, `generateChatText(...)`, `GeminiResult<T>`.
- `guard.ts` — `withAiTry(idToken, run)` verifies the ID token, atomically reserves a try (free: `freeAiTries - 1`; premium: daily `aiUsage` < `PREMIUM_DAILY_AI_LIMIT`), runs `run(userId)` and refunds if it returns `success: false` or throws. Adds `freeAiTries` to the result.

## Steps
1. File starts with `"use server";`.
2. Validate input FIRST with a request schema from `lib/schemas/ai.schema.ts` (`AI*RequestSchema`; cap free-text lengths and history size) — invalid input must never cost a try.
3. Then `return withAiTry(input.idToken, async (userId) => { ... })`. Inside, return literals with `success: true as const` / `success: false as const`.
4. Load user data ONLY via `adminDb` (Admin SDK) — use or extend `lib/server/data/*` (`getAllExercises`, `getUserRoutines`; `import "server-only"`, values passed through `toPlain`). Never import `lib/services/*` (client SDK) into a server action. Admin SDK bypasses rules: never follow a user-supplied path/ref outside `exercises/*` or the caller's own `users/{uid}/**`.
5. Define the response shape once as a zod schema; pass `z.toJSONSchema(schema)` as `responseSchema`; after the call run `schema.safeParse` on the result and return an error code on failure.
6. Map AI names to existing exercises/routines; new items get a `temp-` id so `createAiUserRoutine` creates them.
7. Return `{ success, data | error }` from `run`; `withAiTry` adds `freeAiTries`. Prefer error codes (e.g. `NO_FREE_TRIES`, `AI_INVALID_RESPONSE`) translated on the client via next-intl.
8. On the client, update cached user params (`subscribed.freeAiTries`) from the result, as `components/modals/AI/__components/chat.tsx` does.

## Prompting
- Respond in the user's locale (`locale` param); pass existing routine/exercise names so the model reuses them.
- Keep the prompt in one place per action; enums (`MUSCLE_GROUPS`, `weekDays`) come from `data/exercise.ts` and `types`.

## Checklist
- [ ] Uses `withAiTry` (token, limits, refund on failure)
- [ ] Input and output validated with zod
- [ ] No client Firebase SDK on the server
- [ ] Errors logged with `console.error`, user sees a translated message
