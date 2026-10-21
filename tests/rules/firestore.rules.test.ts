import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { assertFails, assertSucceeds, type RulesTestEnvironment } from "@firebase/rules-unit-testing";
import {
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { createTestEnv } from "./setup";

let env: RulesTestEnvironment;

const subscribed = { plan: null, status: "none", expiresAt: null, freeAiTries: 5 };

beforeAll(async () => {
  env = await createTestEnv();
});

afterAll(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
  // Seed as the server would (Admin SDK bypasses rules).
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, "users/alice"), { displayName: "Alice", subscribed, createdAt: new Date() });
    await setDoc(doc(db, "users/alice/routines/r1"), { name: "Push" });
    await setDoc(doc(db, "users/bob"), { displayName: "Bob", subscribed });
    await setDoc(doc(db, "exercises/bench"), { name: "Bench press" });
  });
});

const alice = () => env.authenticatedContext("alice").firestore();
const bob = () => env.authenticatedContext("bob").firestore();
const guest = () => env.unauthenticatedContext().firestore();

describe("exercises (public catalog)", () => {
  it("anyone can read, even signed out", async () => {
    await assertSucceeds(getDoc(doc(guest(), "exercises/bench")));
    await assertSucceeds(getDocs(collection(guest(), "exercises")));
  });

  it("nobody can write from the client", async () => {
    await assertFails(setDoc(doc(alice(), "exercises/bench"), { name: "Hacked" }));
    await assertFails(setDoc(doc(alice(), "exercises/new"), { name: "New" }));
    await assertFails(deleteDoc(doc(alice(), "exercises/bench")));
  });
});

describe("users/{uid} document", () => {
  it("owner can read own doc; others and guests cannot", async () => {
    await assertSucceeds(getDoc(doc(alice(), "users/alice")));
    await assertFails(getDoc(doc(bob(), "users/alice")));
    await assertFails(getDoc(doc(guest(), "users/alice")));
  });

  it("owner can update regular fields (setUserParams merge)", async () => {
    await assertSucceeds(updateDoc(doc(alice(), "users/alice"), { displayName: "Al" }));
    await assertSucceeds(setDoc(doc(alice(), "users/alice"), { theme: "dark" }, { merge: true }));
    await assertSucceeds(updateDoc(doc(alice(), "users/alice"), { "schedule.monday": [] }));
  });

  it("owner cannot change subscribed (whole or nested), createdAt or aiUsage", async () => {
    await assertFails(
      updateDoc(doc(alice(), "users/alice"), { subscribed: { ...subscribed, plan: "lifetime", status: "active" } }),
    );
    await assertFails(updateDoc(doc(alice(), "users/alice"), { "subscribed.freeAiTries": 999 }));
    await assertFails(setDoc(doc(alice(), "users/alice"), { subscribed: { status: "active" } }, { merge: true }));
    await assertFails(updateDoc(doc(alice(), "users/alice"), { createdAt: new Date(0) }));
    await assertFails(updateDoc(doc(alice(), "users/alice"), { aiUsage: { day: "2026-01-01", count: 0 } }));
  });

  it("owner cannot create or delete the user doc (server-only)", async () => {
    await assertFails(deleteDoc(doc(alice(), "users/alice")));
    await env.withSecurityRulesDisabled((ctx) => deleteDoc(doc(ctx.firestore(), "users/alice")));
    await assertFails(setDoc(doc(alice(), "users/alice"), { displayName: "Alice", subscribed }));
  });

  it("another user cannot write someone else's doc", async () => {
    await assertFails(updateDoc(doc(bob(), "users/alice"), { displayName: "pwned" }));
  });
});

describe("users/{uid} subcollections", () => {
  it("owner has full access", async () => {
    const db = alice();
    await assertSucceeds(getDoc(doc(db, "users/alice/routines/r1")));
    await assertSucceeds(setDoc(doc(db, "users/alice/routines/r2"), { name: "Pull" }));
    await assertSucceeds(setDoc(doc(db, "users/alice/workoutHistory/w1"), workout("w1")));
    await assertSucceeds(setDoc(doc(db, "users/alice/stats/other"), { anything: 1 }));
    await assertSucceeds(deleteDoc(doc(db, "users/alice/routines/r1")));
  });

  it("other users and guests have no access", async () => {
    await assertFails(getDoc(doc(bob(), "users/alice/routines/r1")));
    await assertFails(getDocs(collection(bob(), "users/alice/routines")));
    await assertFails(setDoc(doc(bob(), "users/alice/routines/x"), { name: "x" }));
    await assertFails(getDoc(doc(guest(), "users/alice/routines/r1")));
  });
});

const workout = (id: string, overrides: Record<string, unknown> = {}) => ({
  id,
  name: "Push",
  isQuick: false,
  routineId: "r1",
  startedAt: Timestamp.fromMillis(1_792_576_800_000),
  duration: 3600,
  volume: 12000,
  exercises: [{ id: "bench", sets: [{ weight: 80, reps: 5, completed: true }] }],
  ...overrides,
});

describe("workoutHistory validation", () => {
  const ref = (id = "w1") => doc(alice(), `users/alice/workoutHistory/${id}`);

  it("accepts a valid workout, re-sending it (overwrite) and deleting it", async () => {
    await assertSucceeds(setDoc(ref(), workout("w1")));
    await assertSucceeds(setDoc(ref(), workout("w1")));
    const { routineId: _routineId, ...quick } = workout("q1", { isQuick: true, name: "Quick" });
    await assertSucceeds(setDoc(ref("q1"), quick));
    await assertSucceeds(deleteDoc(ref()));
  });

  it("rejects startedAt that is not a timestamp (e.g. a badly revived offline copy)", async () => {
    await assertFails(setDoc(ref(), workout("w1", { startedAt: { seconds: 1, nanoseconds: 0, type: "x" } })));
    await assertFails(setDoc(ref(), workout("w1", { startedAt: "2026-10-21" })));
  });

  it("rejects a doc id that differs from the workout id", async () => {
    await assertFails(setDoc(ref("other"), workout("w1")));
  });

  it("rejects missing fields, wrong types and out-of-range numbers", async () => {
    const { exercises: _omit, ...withoutExercises } = workout("w1");
    await assertFails(setDoc(ref(), withoutExercises));
    await assertFails(setDoc(ref(), workout("w1", { exercises: "bench" })));
    await assertFails(setDoc(ref(), workout("w1", { exercises: Array.from({ length: 101 }, () => ({})) })));
    await assertFails(setDoc(ref(), workout("w1", { duration: -1 })));
    await assertFails(setDoc(ref(), workout("w1", { volume: "lots" })));
    await assertFails(setDoc(ref(), workout("w1", { name: "x".repeat(201) })));
  });

  it("other users cannot write or read someone's history", async () => {
    await assertFails(setDoc(doc(bob(), "users/alice/workoutHistory/w1"), workout("w1")));
    await assertFails(getDocs(collection(bob(), "users/alice/workoutHistory")));
  });
});

describe("stats validation", () => {
  it("records: merged writes are allowed, a huge map is not", async () => {
    const ref = doc(alice(), "users/alice/stats/records");
    await assertSucceeds(setDoc(ref, { bench: { exerciseId: "bench", weight: 80, reps: 5 } }, { merge: true }));
    const tooMany = Object.fromEntries(Array.from({ length: 501 }, (_, i) => [`e${i}`, { weight: 1, reps: 1 }]));
    await assertFails(setDoc(ref, tooMany));
  });

  it("progress: lists of entries for known fields only", async () => {
    const ref = doc(alice(), "users/alice/stats/progress");
    const entry = { date: Timestamp.fromMillis(0), value: 80 };
    await assertSucceeds(setDoc(ref, { weight: arrayUnion(entry) }, { merge: true }));
    await assertSucceeds(updateDoc(ref, { waist: arrayUnion(entry) }));
    await assertFails(setDoc(ref, { weight: 80 }));
    await assertFails(setDoc(ref, { height: [entry] }, { merge: true }));
  });
});

describe("default deny", () => {
  it("unknown top-level collections are closed", async () => {
    await assertFails(getDoc(doc(alice(), "admin/config")));
    await assertFails(setDoc(doc(alice(), "anything/x"), { a: 1 }));
  });
});
