import { defineConfig } from "vitest/config";

// Security rules tests. Run via `pnpm test:rules` (starts the emulators).
export default defineConfig({
  test: {
    include: ["tests/rules/**/*.test.ts"],
    environment: "node",
    fileParallelism: false,
    testTimeout: 15_000,
    hookTimeout: 30_000,
  },
});
