---
name: gym-next-feature
description: Use when adding or changing a feature in the Gym Next app (new entity, modal, page, Firestore collection or i18n strings) to follow the project's layering and conventions.
---

# Gym Next — adding a feature

Stack: Next.js 16 (App Router), React 19, Firebase (client SDK + firebase-admin), TanStack Query v5 with IndexedDB persister, react-hook-form + zod v4, next-intl (uk default, en), Tailwind v4, motion, sonner, @tabler/icons-react. Package manager: pnpm only.

## Layers (follow in this order)
1. **Type** — `types/<entity>.ts`, re-export from `types/index.ts`.
2. **Schema** — `lib/schemas/<entity>.schema.ts` (zod), re-export from `lib/schemas/index.ts`. Error messages are i18n keys (e.g. `"title_too_small"`), never human text.
3. **Reads** — `lib/services/<entity>.ts` (Firestore client SDK, `db` from `lib/config/firebaseConfig`). Return typed data, catch and `console.error`, return a safe empty value.
4. **Writes** — `lib/actions/<entity>.ts` (client-side mutations; planned rename to `lib/mutations`). Use `writeBatch` for multi-doc writes, `serverTimestamp()` for dates.
5. **Hook** — `hooks/useServices/use<Entity>.ts` with `useQuery({ queryKey: ["<entity>", userId], enabled: !!userId })`.
6. **UI** — components in `components/<area>/`; modals in `components/modals/<name>/` registered in `modal-renderer`, opened via `useModal().open("<type>", data)`. After a mutation: `queryClient.invalidateQueries({ queryKey: ["<entity>", user.uid] })` and a sonner toast.
7. **i18n** — add every new key to BOTH `messages/uk.json` and `messages/en.json` under the matching top-level namespace (app, home, library, history, stats, settings, common, notification, schedule, exercise, routine, ai, workout, measurements…). Call `useTranslations("ns")` only at component top level, never inside loops or callbacks.

## Rules
- Never write `users/{uid}.subscribed` from the client — subscription state is server-only (Admin SDK).
- Premium gating in UI uses `params.subscribed.isActive` from `UserPreferencesProvider`; the server must re-check.
- Subscription logic lives only in `lib/subscription.ts`: read raw data with `parseSubscription()`, decide access with `isSubscriptionActive()`. Never compare `plan`/`status`/`expiresAt` by hand.
- Anything with `"use server"` must use `adminDb`/`adminAuth` from `lib/firebase/firebase-admin.ts`, never the client `db`, and must verify the idToken.
- No `console.log`, no `any`, no `@ts-ignore` in committed code.
- Firestore rules change? Update `firestore.rules` and its emulator tests in the same change.

## Done checklist
- [ ] `pnpm lint` and `npx tsc --noEmit` pass
- [ ] Keys present in uk + en
- [ ] Query invalidated after mutation
- [ ] Works offline-first (no crash when Firestore is unreachable)
- [ ] Premium-only features gated in UI and on the server
