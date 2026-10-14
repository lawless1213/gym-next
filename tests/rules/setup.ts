import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { initializeTestEnvironment, type RulesTestEnvironment } from "@firebase/rules-unit-testing";

// "demo-" project ids never touch real Firebase resources.
export const PROJECT_ID = "demo-gym-next";

export function createTestEnv(): Promise<RulesTestEnvironment> {
  // Run from the repo root. Hosts/ports come from FIRESTORE_EMULATOR_HOST / FIREBASE_STORAGE_EMULATOR_HOST,
  // which `firebase emulators:exec` sets automatically.
  return initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: readFileSync(resolve(process.cwd(), "firestore.rules"), "utf8") },
    storage: { rules: readFileSync(resolve(process.cwd(), "storage.rules"), "utf8") },
  });
}
