import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { E2E_EXERCISE_NAME, E2E_ROUTINE_NAME, E2E_USER } from "./fixtures";

const WEEK_DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

/** Seeds the emulators: a verified premium user with one routine scheduled for every day. */
export default async function globalSetup() {
  if (!process.env.FIRESTORE_EMULATOR_HOST || !process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    throw new Error("E2E must run against emulators. Use `pnpm test:e2e`.");
  }

  const projectId = process.env.FIREBASE_PROJECT_ID!;
  const app = getApps()[0] ?? initializeApp({ projectId });
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Clean state on every run.
  await fetch(
    `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${projectId}/databases/(default)/documents`,
    {
      method: "DELETE",
    },
  );
  await fetch(`http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/emulator/v1/projects/${projectId}/accounts`, {
    method: "DELETE",
  });

  const user = await auth.createUser({ ...E2E_USER, emailVerified: true });

  const exerciseRef = db.doc("exercises/e2e-bench");
  await exerciseRef.set({
    name: { en: E2E_EXERCISE_NAME, uk: E2E_EXERCISE_NAME },
    description: { en: "Smoke test exercise", uk: "Тестова вправа" },
    muscleGroup: "chest",
    imageUrl: "",
  });

  const routineRef = db.doc(`users/${user.uid}/routines/e2e-push`);
  await routineRef.set({ name: E2E_ROUTINE_NAME, color: "#4F46E5", exercises: [exerciseRef] });

  await db.doc(`users/${user.uid}`).set({
    displayName: E2E_USER.displayName,
    avatarUrl: "",
    language: "en",
    createdAt: FieldValue.serverTimestamp(),
    subscribed: { plan: "lifetime", status: "active", expiresAt: null, freeAiTries: 5 },
    schedule: Object.fromEntries(WEEK_DAYS.map((day) => [day, [routineRef]])),
  });
}
