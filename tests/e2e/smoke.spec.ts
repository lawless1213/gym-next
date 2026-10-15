import { expect, test } from "@playwright/test";
import { E2E_EXERCISE_NAME, E2E_ROUTINE_NAME, E2E_USER } from "./fixtures";

test.beforeEach(async ({ context, baseURL }) => {
  // English UI for stable selectors.
  await context.addCookies([{ name: "locale", value: "en", url: baseURL! }]);
});

test("login → workout → history → stats", async ({ page }) => {
  await page.goto("/");

  // Login
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await page.getByPlaceholder("Email").fill(E2E_USER.email);
  await page.getByPlaceholder("Password").fill(E2E_USER.password);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

  // Today's routine is scheduled for every day of the week by the seed.
  await expect(page.getByText(E2E_ROUTINE_NAME).first()).toBeVisible();
  await page.getByRole("button", { name: "Start workout" }).click();

  // Workout: complete one set and finish.
  await expect(page.getByText(E2E_EXERCISE_NAME).first()).toBeVisible();
  // "Complete set" is enabled only when both weight and reps are > 0.
  await page.getByRole("button", { name: "Increase weight" }).first().click();
  await page.getByRole("button", { name: "Increase reps" }).first().click();
  await page.getByRole("button", { name: "Complete set" }).first().click();
  await page.getByRole("button", { name: /Finish Workout/ }).click();
  await page.getByRole("button", { name: "Yes" }).click();

  // History shows the finished session (client-side navigation keeps the pending write alive).
  await page.getByRole("link", { name: /history/i }).click();
  await expect(page).toHaveURL(/\/history/);
  await expect(page.getByText(E2E_ROUTINE_NAME).first()).toBeVisible();

  // Stats page renders for a premium user.
  await page.getByRole("link", { name: /stat/i }).click();
  await expect(page).toHaveURL(/\/stats/);
  await expect(page.getByRole("heading", { name: "Stats" })).toBeVisible();
});
