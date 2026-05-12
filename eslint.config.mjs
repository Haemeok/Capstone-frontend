import { FlatCompat } from "@eslint/eslintrc";
import prettierConfig from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import fs from "node:fs";
import path from "node:path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import reactHooks from "eslint-plugin-react-hooks";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// FSD self-barrel guard: inside src/<layer>/<slice>/** never import the
// same slice's barrel ("@/<layer>/<slice>"). Self-barrels create import
// cycles that crash Turbopack's dynamic_imports analyzer when the module
// later gets pulled into a route-handler or server-action graph.
// See: .claude/skills/vercel-react-best-practices/rules/bundle-no-self-barrel-import.md
const SRC_DIR = path.resolve(__dirname, "src");
const collectSlices = (layer) => {
  const dir = path.join(SRC_DIR, layer);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
};
const selfBarrelGuards = ["entities", "features", "widgets"].flatMap((layer) =>
  collectSlices(layer).map((slice) => ({
    files: [`src/${layer}/${slice}/**/*.{ts,tsx}`],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: `^@/${layer}/${slice}$`,
              message: `Self-barrel import (your own slice's barrel). Use a direct path like '@/${layer}/${slice}/model/foo' instead — self-barrels create cycles that crash Turbopack route-handler graphs.`,
            },
          ],
        },
      ],
    },
  })),
);

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react", "^next"],

            ["^@?\\w"],

            ["^@/shared"],
            ["^@/entities"],
            ["^@/features"],
            ["^@/widgets"],

            ["^@/"],

            ["^\\."],

            ["^\\u0000"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { ignoreRestSiblings: true },
      ],
    },
  },
  ...selfBarrelGuards,
  prettierConfig,
  reactHooks.configs.flat.recommended,
];

export default eslintConfig;
