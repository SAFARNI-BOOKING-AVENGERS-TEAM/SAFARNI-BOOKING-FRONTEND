import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Keep existing dynamic API/domain shapes visible without forcing a broad
      // runtime-sensitive typing refactor before automated tests are in place.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // This repository still preserves the previous Vite/React implementation
    // under src/. The active Next.js TypeScript configuration excludes it too;
    // keep the code intact while linting the current application separately.
    "src/**",
    "vite.config.ts",
  ]),
]);

export default eslintConfig;
