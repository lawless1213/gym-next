import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { E2E_EXERCISE_NAME, E2E_ROUTINE_NAME, E2E_USER } from "./fixtures";
import { seedEmulators } from "./seed";

// Roadmap 1.8: an unfinished workout survives a reload, and a workout finished offline reaches
// Firestore once the device is back online.

const FIRESTORE = `http://${process.env.FIRESTORE_EMULATOR_HOST}/v1/projects/${process.env.FIREBASE_PROJECT_ID}/databases/(default)/documents`;

type HistoryDoc = { fields: { startedAt?: { timestampValue?: string; mapValue?: unknown } } };

/** All workoutHistory docs of all users, straight from the emulator (bypasses rules). */
async function getHistoryDocs(request: APIRequestContext): Promise<HistoryDoc[]> {
  const res = await request.post(`${FIRESTORE}:runQuery`, {
    headers: { Authorization: "Bearer owner" },
    data: { structuredQuery: { from: [{ collectionId: "workoutHistory", allDescendants: true }] } },
  });
  const rows = (await res.json()) as { document?: HistoryDoc }[];
  return rows.flatMap((row) => (row.document ? [row.document] : []));
}

const countHistoryDocs = async (request: APIRequestContext) => (await getHistoryDocs(request)).length;

async function loginAndStartWorkout(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await page.getByPlaceholder("Email").fill(E2E_USER.email);
  await page.getByPlaceholder("Password").fill(E2E_USER.password);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
  await page.getByRole("button", { name: "Start workout" }).click();
  await expect(page.getByText(E2E_EXERCISE_NAME).first()).toBeVisible();
}

async function completeOneSet(page: Page) {
  await page.getByRole("button", { name: "Increase weight" }).first().click();
  await page.getByRole("button", { name: "Increase reps" }).first().click();
  await page.getByRole("button", { name: "Complete set" }).first().click();
}

test.beforeEach(async ({ context, baseURL }) => {
  await seedEmulators();
  await context.addCookies([{ name: "locale", value: "en", url: baseURL! }]);
});

test("unfinished workout is restored after a reload", async ({ page }) => {
  await loginAndStartWorkout(page);
  await completeOneSet(page);

  await page.reload(); // pagehide/beforeunload save the draft
  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
  // The home card offers to continue instead of starting a new workout.
  await expect(page.getByText(/Unfinished workout: 1 set done/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Start workout" })).toHaveCount(0);
  await page.getByRole("button", { name: "Continue", exact: true }).click();

  await expect(page.getByText("Unfinished workout restored")).toBeVisible();
  // The toast's action (the home card behind the modal has its own "Start over" button).
  await expect(
    page.getByRole("region", { name: /Notifications/ }).getByRole("button", { name: "Start over" }),
  ).toBeVisible();
});

test("workout finished offline is synced after reconnecting", async ({ page, context, request }) => {
  const before = await countHistoryDocs(request);
  await loginAndStartWorkout(page);
  await completeOneSet(page);

  await context.setOffline(true);
  await page.getByRole("button", { name: /Finish Workout/ }).click();
  await page.getByRole("button", { name: "Yes" }).click();
  await expect(page.getByText(/You're offline/)).toBeVisible();
  expect(await countHistoryDocs(request)).toBe(before);

  await context.setOffline(false);
  await page.reload();
  await expect.poll(() => countHistoryDocs(request), { timeout: 20_000 }).toBe(before + 1);
  // Synced copies must keep a real Timestamp, or the workout drops out of history queries.
  for (const doc of await getHistoryDocs(request)) expect(doc.fields.startedAt?.timestampValue).toBeTruthy();
  await page.getByRole("link", { name: /history/i }).click();
  await expect(page.getByText(E2E_ROUTINE_NAME).first()).toBeVisible();
});
