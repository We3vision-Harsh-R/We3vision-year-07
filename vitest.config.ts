import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests of the AI content integration (registry validation, submission flow). Run: npm test
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { include: ["src/**/*.test.ts"], environment: "node" },
});
