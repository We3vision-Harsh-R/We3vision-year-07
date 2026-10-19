import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests of the AI content integration (registry validation, MCP tools, submission flow). Run: npm test
const src = (p: string) => fileURLToPath(new URL(p, import.meta.url));
export default defineConfig({
  resolve: { alias: { "@": src("./src"), "server-only": src("./src/test/server-only.ts") } },
  test: { include: ["src/**/*.test.ts"], environment: "node" },
});
