import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { assertFails, assertSucceeds, type RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { deleteDoc, doc, getDoc, getDocs, collection, setDoc, updateDoc } from "firebase/firestore";
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
    await assertFails(updateDoc(doc(alice(), "users/alice"), { subscribed: { ...subscribed, plan: "lifetime", status: "active" } }));
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
    await assertSucceeds(setDoc(doc(db, "users/alice/workoutHistory/w1"), { volume: 1000 }));
    await assertSucceeds(setDoc(doc(db, "users/alice/stats/progress"), { weight: 80 }));
    await assertSucceeds(deleteDoc(doc(db, "users/alice/routines/r1")));
  });

  it("other users and guests have no access", async () => {
    await assertFails(getDoc(doc(bob(), "users/alice/routines/r1")));
    await assertFails(getDocs(collection(bob(), "users/alice/routines")));
    await assertFails(setDoc(doc(bob(), "users/alice/routines/x"), { name: "x" }));
    await assertFails(getDoc(doc(guest(), "users/alice/routines/r1")));
  });
});

describe("default deny", () => {
  it("unknown top-level collections are closed", async () => {
    await assertFails(getDoc(doc(alice(), "admin/config")));
    await assertFails(setDoc(doc(alice(), "anything/x"), { a: 1 }));
  });
});
