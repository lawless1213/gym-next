---
name: gym-next-ai-action
description: Use when adding or changing a Gemini-powered server action in Gym Next (AI routine/schedule/exercise generation or chat).
---

# Gym Next — Gemini server actions

Files live in `lib/actions/gemini/`. Shared pieces:
- `client.ts` — `ai`, `GEMINI_MODEL`, `generateStructured<T>({ prompt, schema })`, `generateChatText(...)`, `GeminiResult<T>`.
- `guard.ts` — `requireFreeTry(idToken)` verifies the Firebase ID token with `adminAuth` and decrements free tries in a transaction.

## Steps
1. File starts with `"use server";`.
2. First line of the action: `const guard = await requireFreeTry(input.idToken); if (!guard.ok) return { success: false, error: guard.error, freeAiTries: guard.freeAiTries };`
3. Validate input with a zod schema from `lib/schemas/ai.schema.ts`; cap free-text lengths (message, comment) and history size.
4. Load user data ONLY via `adminDb` (Admin SDK). Never import `lib/services/*` (client SDK) into a server action.
5. Define the response shape once as a zod schema; pass `z.toJSONSchema(schema)` as `responseSchema`; after the call run `schema.safeParse` on the result and return an error code on failure.
6. Map AI names to existing exercises/routines; new items get a `temp-` id so `createAiUserRoutine` creates them.
7. Return `{ success, data | error, freeAiTries: guard.freeAiTries }`. Prefer error codes (e.g. `NO_FREE_TRIES`, `AI_INVALID_RESPONSE`) translated on the client via next-intl.
8. On the client, update cached user params (`subscribed.freeAiTries`) from the result, as `components/modals/AI/__components/chat.tsx` does.

## Prompting
- Respond in the user's locale (`locale` param); pass existing routine/exercise names so the model reuses them.
- Keep the prompt in one place per action; enums (`MUSCLE_GROUPS`, `weekDays`) come from `data/exercise.ts` and `types`.

## Checklist
- [ ] Token verified, tries handled (refund on Gemini failure once implemented)
- [ ] Input and output validated with zod
- [ ] No client Firebase SDK on the server
- [ ] Errors logged with `console.error`, user sees a translated message
