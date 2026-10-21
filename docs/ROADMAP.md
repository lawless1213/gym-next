# Gym Next — Improvement Roadmap (October 2026)

Priorities: P0 — security/revenue, P1 — bugs, P2 — hygiene and tooling, P3 — architecture, P4 — new features.
Estimates are rough, for a single developer. The "why" behind each item is in [PROJECT_STATUS.md](./PROJECT_STATUS.md).

**Hosting:** production runs on **Vercel** (env vars and secrets in Vercel project settings; Sentry via the Sentry ↔ Vercel integration; preview deployment per PR). Firebase App Hosting (`apphosting.yaml`, Secret Manager) is set up but disabled.

**Context:** the app has no real users yet. Data schemas can change freely, test data in Firestore can be wiped, and no migrations or backward compatibility are needed. This is the cheapest moment for breaking changes.

## Stage 0 — Security & monetization (P0, ~3–4 days)

Order inside the stage: 0.4 (schema) → 0.3 → 0.1 → 0.2 → the rest. Rules and server-side user creation both depend on the shape of `subscribed`.

- [x] 0.4 Single source of truth for subscriptions: `subscribed: { plan, status, expiresAt, freeAiTries }`; `isActive` is computed on the server; the guard and the UI read the same thing. No migration needed — wipe existing test user docs.
  - Done: `lib/subscription.ts` (`parseSubscription`, `isSubscriptionActive`, `toUserSubscription`) + `lib/schemas/subscription.schema.ts`; used by the AI guard and `getUserParams`.
- [x] 0.3 Create the user document with `subscribed` on the server (Cloud Function `beforeUserCreated`/`onCreate` or a server action with the Admin SDK). Remove `subscribed` from `ensureUserDoc`.
  - Done: server action `initUserDoc(idToken)` in `lib/server/actions/user.ts` (Admin SDK, idempotent transaction), called from `ensureUserDoc` after every sign-in. `setUserParams` can no longer write `subscribed`/`createdAt` (type + runtime check); rules in 0.1 enforce it.
- [x] 0.1 Add `firestore.rules` + `storage.rules` to the repo and wire them into `firebase.json`; owners read/write only `users/{uid}/**`; `subscribed` is read-only for the client; `exercises` is read-only.
  - Done: client can't create/delete `users/{uid}` or touch `subscribed`/`createdAt`; `exercises` is public read-only; Storage allows owner-only images < 5 MB under `users/{uid}/`, `preview/` (catalog images) is public read-only. Account data deletion moved to the `deleteUserData` server action (`recursiveDelete` + Storage prefix delete, requires login < 5 min) — part of 3.2 pulled forward; it now also deletes `workoutHistory`. Deploy: `firebase deploy --only firestore:rules,storage`.
- [x] 0.2 Firebase Emulator + rules tests (`@firebase/rules-unit-testing`): foreign uid, changing `subscribed`, writing to `exercises`.
  - Done: `tests/rules/*.test.ts` (Firestore + Storage, Vitest), emulators in `firebase.json`, `pnpm test:rules` runs them on a `demo-` project (no real resources). Requires Java 21+ (`brew install openjdk@21`); firebase-tools is a devDependency. Will run in CI in 2.8.
- [x] 0.5 Gemini server actions read data only via `adminDb` (separate `lib/server/*` modules with `import "server-only"`).
  - Done: `lib/server/data/{exercises,routines,serialize}.ts`. Routine exercise refs are resolved only for `exercises/*` and the caller's own `users/{uid}/exercises/*` (Admin SDK bypasses rules). Admin values are serialized to plain JSON (Timestamp → ms, ref → path).
- [x] 0.6 AI limits: charge a try only after a successful response (or refund on failure), decrementing `freeAiTries` inside a Firestore transaction so parallel requests cannot bypass the limit; rate limit premium users too (e.g. N/day); cap message and history length; validate client-sent history with zod.
  - Done: `withAiTry(idToken, run)` in `guard.ts` — atomic reserve → run → refund on failure/throw. Premium: `PREMIUM_DAILY_AI_LIMIT = 50`/UTC day in server-only `users/{uid}.aiUsage` (protected by rules + test). Inputs validated with `AI*RequestSchema` before charging (comment ≤ 500, chat message ≤ 2000, history ≤ 10 × 8000). Fixed: chat sent the new message twice.
- [x] 0.7 Validate Gemini responses with zod `safeParse`; generate Gemini schemas with `z.toJSONSchema()`.
  - Done: response schemas in `lib/schemas/ai-response.schema.ts`; `generateStructured({ prompt, schema })` sends `responseJsonSchema` generated from zod and returns `safeParse` data (invalid JSON/shape → error, try refunded by `withAiTry`). Removed `any` from `client.ts`.
- [x] 0.8 Validate the `locale` cookie against `i18n/locales.ts`, fall back to `uk`.
  - Done: `isLocale` / `DEFAULT_LOCALE` in `i18n/locales.ts`; used in `i18n/request.ts` and `setUserLocale` (ignores unknown values).
- [x] 0.9 Verify `.env.local` was never committed (`git log --all -- .env.local`). If it was — rotate all keys (Gemini, Firebase service account), not just purge history. App Hosting secrets via Secret Manager in `apphosting.yaml`. (App Hosting is now disabled; on Vercel the same values live in Project → Settings → Environment Variables.)
  - Checked 2026-10-15: no `.env*` file in any of 282 commits (all branches); no private keys, service-account JSON or `AIza…` keys in history; `.gitignore` covers `.env*`. No rotation needed.
  - `apphosting.yaml`: public `NEXT_PUBLIC_FIREBASE_*` (BUILD + RUNTIME) and `FIREBASE_PROJECT_ID` as values; `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `GEMINI_API_KEY` as Secret Manager refs (`firebaseClientEmail`, `firebasePrivateKey`, `geminiApiKey`) — create them with `firebase apphosting:secrets:set`.

## Stage 1 — Bugs (P1, ~0.5 day)

- [x] 1.1 `hooks/useAuth.tsx`: remove `import { subscribe } from "diagnostics_channel"`.
- [x] 1.2 `Plans/index.tsx`: move `useTranslations` out of `.map()` to the top level.
- [x] 1.3 `layout.tsx`: `lang={locale}` from `getLocale()`; `Inter({ subsets: ["latin", "cyrillic"] })`; remove `maximumScale: 1`.
- [x] 1.4 `tsconfig.json`: remove `"data/navManu.еs"` and `"lib/schemas/schedule.schema/ts"` from `include`.
- [x] 1.5 `pnpm-workspace.yaml`: `'@google/genai': false` (or true). Also `re2: false` (optional native dep of firebase-tools).
- [x] 1.6 On logout: `queryClient.clear()` + `del("REACT_QUERY_OFFLINE_CACHE")` (otherwise the next user on the same device sees cached data — must be done before launch).
  - Done in `QueryProvider`: clears the query cache and the IndexedDB copy whenever the signed-in uid changes (logout, account deletion, account switch).
- [x] 1.7 `themeColor` as an array for light/dark.
- [x] 1.8 Offline workouts lose data (found 2026-10-20): the draft was written but never read back (and keyed by a random workout id), and finishing offline dropped the workout (`getDoc` for records threw before `addDoc`; memory-only Firestore cache).
  - Done: Firestore uses `persistentLocalCache` (multi-tab) + `ignoreUndefinedProperties` — pending writes survive reloads and are re-sent on reconnect. `writeWorkoutSession` writes history first with the workout id as doc id (idempotent), returns without waiting for the network (`synced` promise); records are a separate best-effort write that is skipped if current records can't be read (`writeWorkoutRecords`, `bestSetsByExercise` in `lib/domain/records.ts` + tests).
  - Resume: drafts are keyed by uid + routine id (`lib/workoutStorage.ts`), restored when the workout opens with a "Start over" toast action; the home `WorkoutCard` shows "Continue" / "Start over" (with sets done) instead of "Start workout" when a draft exists (`useStoredDraft`, `useSyncExternalStore`), removed after finish; other users' drafts are cleared on user change.
  - Fallback: a finished workout is kept as a `workout-pending-*` copy until the server confirms it; `usePendingWorkoutSync` (AppShell) re-sends it on sign-in and `online`. Offline finish shows a "saved on this device, will sync" toast; sync failures go to Sentry + error toast.
  - Tests: `tests/e2e/offline.spec.ts` (restore after reload; finish offline → reconnect → doc appears in the emulator).

## Stage 2 — Packages, tooling & safety net (P2, ~2–3 days)

- [x] 2.1 Remove `@headlessui/react`, `@tailwindplus/elements`, `@tanstack/query-sync-storage-persister`, `@vercel/speed-insights`, `package-lock.json`. Add `"packageManager": "pnpm@…"`.
- [x] 2.2 `@types/node` → 22+.
- [x] 2.3 Prettier (+ `prettier-plugin-tailwindcss`), Husky + lint-staged.
  - `.prettierrc.json` (printWidth 120, matches existing style), `pnpm format` / `format:check`; pre-commit runs Prettier on staged files. ESLint joins lint-staged in 2.4 after the cleanup.
- [x] 2.4 ESLint: `no-console` (warn, allow error), `@typescript-eslint/no-explicit-any`, `react-hooks/rules-of-hooks` (error). Clean up ~51 `console.log` / `any` / `@ts-ignore`.
  - Part 1 done: rules added (`no-console` warn w/ warn/error allowed, `no-explicit-any` error, `ban-ts-comment`, `rules-of-hooks` error); all `any`, `console.log` and `@ts-ignore` removed; fixed conditional hook in AI chat, missing `key`, impure render, module-level state in AppShell, unrendered `t("emptyEmail")`. Part 2: removed ~97 unused imports/vars and dead code, replaced setState-in-effect with derived state / render-time adjustment (documented disables only for mount-only browser reads and DOM measurement). `pnpm lint`: 0 errors, 5 `<img>` warnings (blob previews, Storage URLs). ESLint runs in lint-staged.
- [x] 2.5 Scripts: `typecheck`, `test`, `test:e2e`, `format`.
  - Scripts: `typecheck`, `test` (unit), `test:watch`, `test:rules`, `format`. `test:e2e` comes with Playwright in 2.7.
- [x] 2.6 Vitest + Testing Library: records, volume, weekly periods, guard, zod schemas.
  - Pure logic moved to `lib/domain/*` (records, volume, periods, schedule) and covered with Vitest (`vitest.config.mts`), plus `lib/subscription` and AI request/response schemas. Testing Library (component tests) and guard tests with mocked Admin SDK — later.
- [x] 2.7 Playwright e2e smoke (moved from 4.7): login → workout → history → stats. Main safety net for the Stage 3 refactors.
  - `pnpm test:e2e`: Playwright (Pixel 7 profile) against Auth/Firestore/Storage emulators on a `demo-` project; `tests/e2e/global-setup.ts` seeds a verified premium user with a routine on every weekday. Smoke: login → start workout → complete set → finish → history → stats. App connects to emulators only when `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true`; Admin SDK skips credentials when emulator hosts are set.
- [x] 2.8 GitHub Actions: lint + typecheck + test + build (+ e2e against the emulator) on every PR.
  - `.github/workflows/ci.yml` on PRs and pushes to `master`: job 1 — format check, lint, typecheck, unit tests, build (demo Firebase config, no secrets); job 2 — Java 21 + Playwright, `test:rules` and `test:e2e` on emulators, report uploaded on failure. Next: make both jobs required checks in GitHub branch protection.
- [x] 2.9 Sentry (or Crashlytics) for the client and server actions.
  - `@sentry/nextjs`: `instrumentation.ts` (+ `onRequestError`), `instrumentation-client.ts`, `app/global-error.tsx`, `withSentryConfig` (tunnel `/monitoring`, source maps only with `SENTRY_AUTH_TOKEN`). Disabled without `NEXT_PUBLIC_SENTRY_DSN` (dev/CI/e2e). `lib/monitoring.ts` `reportError`/`reportIssue` used in AI guard/client, workout save, Admin data readers, account deletion; Sentry user = uid only, no replay, `sendDefaultPii: false`. Env template in `apphosting.yaml`.

## Stage 3 — Architecture & cleanup (P3, ~1–2 weeks, incremental)

No users yet, so this is the cheapest time to do it — start right after Stage 2 instead of postponing.

- [x] 3.1 `lib/actions` (client-side writes) → `lib/mutations`; real server actions → `lib/server/actions`.
  - Done: client Firestore writes in `lib/mutations/*`; Gemini server actions in `lib/server/actions/ai/*`; their helpers (`client.ts`, `guard.ts`) in `lib/server/ai/` with `import "server-only"` (they had none before). Skills and comments updated.
- [x] 3.2 Move critical writes to the server: ~~account deletion~~ (done in 0.1), records, subscription. Decide and document which writes stay client-side (and can work offline — workout sets, notes) vs server-only (subscription, AI tries, account) — this defines the scope of 4.2.
  - Decided: records stay client-side (offline; server can't protect data the user writes about themselves, history is client-written anyway); subscription is already server-only (0.1/0.3), payments webhook comes in 4.1. Instead `firestore.rules` validate the shape of `workoutHistory` (`startedAt` timestamp, doc id = workout id, list/number limits), `stats/records` (≤ 500 entries) and `stats/progress` (known fields, lists) + rules tests. Table "Who writes what" in `docs/PROJECT_STATUS.md`.
- [x] 3.3 Return error codes (`NO_FREE_TRIES`, `AI_RATE_LIMIT`) and translate them via next-intl.
  - Done: `lib/errors/ai.ts` (`AI_ERROR_CODES`, `AiFailure`); Gemini client, guard and all AI actions return codes; client translates via `useAiErrorMessage()` (`ai.errors.*`). Auth errors via `authErrorKey()` → `auth.errors.*` (replaces the Ukrainian `AUTH_ERRORS` map). Also moved remaining hardcoded UI strings to messages (AI toasts, chat `alert` → toast + "no tries" text, social login, `Select` defaults, quick-workout placeholder, `aria-label`/`sr-only`), fixed missing en `ai.modal.confirm.confirmSchedule`. Unit test: uk/en key parity + every AI code translated.
- [x] 3.4 Naming: `shedule.ts`→`schedule.ts`, `navManu.tsx`→`navMenu.tsx`, `TypewritterText`→`TypewriterText`; one `_components` convention and one file-casing convention.
  - Done: renames above + `LoginWIth`→`LoginWith`, `AI/__components`→`AI/_components`, `utils/PWA.ts`→`pwa.ts`. Convention (in the `gym-next-feature` skill): component files and component folders PascalCase (`SetInput.tsx`, `ui/form/Input/`, `ModalProvider.tsx` ← `modal-store.tsx`, `ThemeProvider.tsx`, `UserPreferencesProvider.tsx`); other modules camelCase; grouping folders lowercase; private subcomponents in `_components/`.
- [ ] 3.5 `useAuth.tsx` (a provider) → `providers/AuthProvider.tsx`, hook separately.
- [ ] 3.6 Query key factory (`lib/queryKeys.ts`).
- [ ] 3.7 Server components for the layout and static parts.
- [ ] 3.8 `MuscleSchema`: move SVG paths into data + one render component.
- [ ] 3.9 PWA: `@ducanh2912/next-pwa` → Serwist (`@serwist/next`), verify offline mode.
- [ ] 3.10 Tie the persister `buster` to the data schema version.
- [ ] 3.11 Feature-based structure ("FSD-lite"), one feature per PR, after Stages 0–2. See [Target structure](#target-structure-fsd-lite).
  - [ ] Create `shared/` (ui, lib, config) and `server/` (Admin SDK, server actions, AI guard, `import "server-only"`).
  - [ ] Migrate features one by one, smallest first: `progress` → `history` → `exercises` → `routines` → `schedule` → `workouts` → `ai` → `subscription` → `auth`.
  - [ ] Each feature exposes a public API via `index.ts`; no deep imports into another feature's internals.
  - [ ] Enforce boundaries with ESLint (`eslint-plugin-boundaries` or `import/no-restricted-paths`): `shared` never imports from `features`/`server`; features import each other only through `index.ts`; client code never imports `server/`.
  - [ ] `app/` stays routing-only (thin `page.tsx`/`layout.tsx` composing features).
- [ ] 3.12 Review custom form controls (`components/ui/form/Select`, `Stepper`, `Tabs`, modals, `type="number"` in `modals/workout/_components/SetInput.tsx`) for accessibility and mobile input; where they fall short, replace with React Aria Components (unstyled, Tailwind-friendly). Not React Spectrum (Adobe look, heavy). Ideally done alongside the move to `shared/ui` in 3.11.
  - Check: keyboard and focus (Tab/arrows/Esc, focus trap in modals), screen-reader labels/roles, `NumberField` with locale-aware decimals (`,` vs `.` for uk/en), step/min/max, correct mobile keyboard (`inputMode="decimal"`), touch targets.
  - Candidates: `NumberField` (weight/reps), `Select`/`ComboBox`, `Tabs`, `Modal`/`Dialog`; `DatePicker`/`Calendar` if the schedule ever needs date input.
  - Decision rule: only swap a control if the review finds real issues; one UI library only (Headless UI was already removed in 2.1).

## Stage 4 — Product (P4, after stabilization)

- [ ] 4.0 Before charging money: move Vercel from Hobby (non-commercial) to a paid plan; give Preview deployments a separate Firebase project (today previews use production Firestore/Auth).
- [ ] 4.1 Payments: Stripe/LemonSqueezy + webhook → server-side `subscribed` update (depends on 0.3–0.4).
- [ ] 4.2 Reliable offline workout logging with a sync queue — only for the client-side writes defined in 3.2 (see "Who writes what" in `docs/PROJECT_STATUS.md`). Builds on 1.8 (Firestore persistent cache + draft resume); 4.2 covers the rest: other offline writes (notes, progress, routines), conflict handling, sync status in the UI.
- [ ] 4.3 Rest timer (vibration, sound).
- [ ] 4.4 Scheduled push reminders (FCM).
- [ ] 4.5 1RM estimate (Epley), history export to CSV.
- [ ] 4.6 Analytics (Firebase Analytics / PostHog): subscription funnel.
- [ ] 4.7 Extend e2e coverage (AI flows, subscription, offline) — base smoke suite lives in 2.7.
- [ ] 4.8 Trained-muscles view: highlight the muscles worked on `MuscleSchema` — per workout (finish summary, `WorkoutSessionCard` in history) and per period (week/month in stats, next to `WeekStats`).
  - Data: workout exercises already snapshot `muscleGroup` (optional in `types/workout.ts`) — make it required when saving; derive per-muscle sets/volume in `lib/domain/*` (pure + Vitest), reusing volume/periods logic.
  - UI: `MuscleSchema` today only takes `selectedMuscles` (on/off) — add an intensity mode (heatmap by sets or volume) plus a legend; read-only (`clickable={false}`). Easier after 3.8 (paths as data).
  - Nice to have: "not trained for N days" hint for neglected muscles; secondary muscles per exercise (schema change, catalog + AI prompts) — later.

## Target structure (FSD-lite)

Why not full FSD: the project is ~14k lines with a single developer, FSD's `app`/`pages` layers clash with Next.js App Router folders, and `entities`/`features`/`widgets` boundaries would be fuzzy here. FSD-lite keeps the useful parts — grouping by domain, a public API per feature, one-way dependencies — without the extra layers. Revisit full FSD if the team grows to 3+ developers or code must be shared with another app (admin panel, React Native).

```
app/                      # Next.js routing only (thin page.tsx / layout.tsx)
features/
  routines/
    api/                  # reads (services) + writes (mutations)
    model/                # types, zod schemas, query keys
    hooks/                # useRoutines, useCreateRoutine
    components/           # RoutineCard, routine modals
    index.ts              # public API of the feature
  workouts/
  exercises/
  schedule/
  progress/
  history/
  ai/
  auth/
  subscription/
shared/
  ui/                     # Button, Tabs, Loader, form controls
  lib/                    # firebase client, utils, result type, i18n helpers
  config/
server/                   # Admin SDK, server actions, AI guard ("server-only")
```

Dependency rules: `app` → `features` → `shared`; `server` → `shared`; features talk to each other only via `index.ts`.

Decided against (for now): **fp-ts** (in maintenance, superseded by Effect) and **Effect** (no complex async orchestration in the app; TanStack Query + zod + a small `Result<T, E>` type cover the needs). Reconsider Effect only for a dedicated backend (payment webhooks, queues, background sync).

## Order

1. Stage 1 first (half a day), alongside the start of Stage 0.
2. Stage 0 — in the order given above; must be done before launching payments (4.1).
3. Stage 2 — tests, e2e and CI as a safety net.
4. Stage 3 — right after Stage 2, while there are no users and breaking changes are free.
5. Stage 4 — after stabilization.
