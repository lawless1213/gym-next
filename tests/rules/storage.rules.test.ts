import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { assertFails, assertSucceeds, type RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { deleteObject, getBytes, ref, uploadBytes } from "firebase/storage";
import { createTestEnv } from "./setup";

let env: RulesTestEnvironment;

const png = (size = 1024) => new Uint8Array(size);
const image = { contentType: "image/png" };

beforeAll(async () => {
  env = await createTestEnv();
});

afterAll(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearStorage();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const storage = ctx.storage();
    await uploadBytes(ref(storage, "users/alice/avatar.png"), png(), image);
    await uploadBytes(ref(storage, "preview/bench.png"), png(), image);
  });
});

const alice = () => env.authenticatedContext("alice").storage();
const bob = () => env.authenticatedContext("bob").storage();
const guest = () => env.unauthenticatedContext().storage();

describe("users/{uid}/**", () => {
  it("owner can upload images under 5 MB (avatar and exercise photo)", async () => {
    await assertSucceeds(uploadBytes(ref(alice(), "users/alice/me.png"), png(), image));
    await assertSucceeds(
      uploadBytes(ref(alice(), "users/alice/exercises/1.jpg"), png(), { contentType: "image/jpeg" }),
    );
  });

  it("rejects non-images and files of 5 MB or more", async () => {
    await assertFails(
      uploadBytes(ref(alice(), "users/alice/script.js"), png(), { contentType: "application/javascript" }),
    );
    await assertFails(uploadBytes(ref(alice(), "users/alice/big.png"), png(5 * 1024 * 1024), image));
  });

  it("owner can read and delete own files", async () => {
    await assertSucceeds(getBytes(ref(alice(), "users/alice/avatar.png")));
    await assertSucceeds(deleteObject(ref(alice(), "users/alice/avatar.png")));
  });

  it("other users and guests cannot read, write or delete", async () => {
    await assertFails(getBytes(ref(bob(), "users/alice/avatar.png")));
    await assertFails(uploadBytes(ref(bob(), "users/alice/x.png"), png(), image));
    await assertFails(deleteObject(ref(bob(), "users/alice/avatar.png")));
    await assertFails(getBytes(ref(guest(), "users/alice/avatar.png")));
  });
});

describe("preview/** (catalog images)", () => {
  it("anyone can read", async () => {
    await assertSucceeds(getBytes(ref(guest(), "preview/bench.png")));
  });

  it("nobody can write or delete from the client", async () => {
    await assertFails(uploadBytes(ref(alice(), "preview/new.png"), png(), image));
    await assertFails(deleteObject(ref(alice(), "preview/bench.png")));
  });
});

describe("default deny", () => {
  it("other paths are closed", async () => {
    await assertFails(uploadBytes(ref(alice(), "public/x.png"), png(), image));
  });
});
