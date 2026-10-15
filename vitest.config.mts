import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests (pure logic). Security-rules tests use vitest.rules.config.mts + emulators.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**", "tests/rules/**", "tests/e2e/**"],
  },
});
