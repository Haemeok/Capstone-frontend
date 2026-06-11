import { FlatCompat } from "@eslint/eslintrc";
import prettierConfig from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import fs from "node:fs";
import path from "node:path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

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
  }))
);

const fsdImportRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce FSD layer-direction and same-layer slice isolation.",
    },
    schema: [
      {
        type: "object",
        properties: { selfBarrel: { type: "boolean" } },
        additionalProperties: false,
      },
    ],
    messages: {
      direction:
        "FSD layer-direction violation: '{{from}}' must not import from higher layer '{{to}}'. Imports may only point to lower layers (shared <- entities <- features <- widgets <- app).",
      isolation:
        "FSD slice-isolation violation: '{{layer}}/{{fromSlice}}' must not import sibling slice '{{layer}}/{{toSlice}}'. Same-layer slices are isolated -- lift shared code to 'shared/' or compose at a higher layer.",
      selfBarrel:
        "FSD self-barrel import ('@/{{layer}}/{{slice}}'). Use a direct path like '@/{{layer}}/{{slice}}/model/...' instead -- self-barrels create cycles that crash Turbopack route-handler graphs.",
    },
  },
  create(context) {
    const LAYERS = ["shared", "entities", "features", "widgets", "app"];
    const SLICED = new Set(["entities", "features", "widgets"]);
    const reportSelfBarrel = context.options[0]?.selfBarrel ?? false;

    const parseFile = (p) => {
      const m = p
        .replace(/\\/g, "/")
        .match(/(?:^|\/)src\/([^/]+)(?:\/([^/]+))?/);
      if (!m || !LAYERS.includes(m[1])) return null;
      return { layer: m[1], slice: SLICED.has(m[1]) ? (m[2] ?? null) : null };
    };
    const parseImport = (s) => {
      const m = s.match(/^@\/([^/]+)(?:\/([^/]+))?/);
      if (!m || !LAYERS.includes(m[1])) return null;
      return {
        layer: m[1],
        slice: SLICED.has(m[1]) ? (m[2] ?? null) : null,
        bareBarrel: /^@\/[^/]+\/[^/]+$/.test(s),
      };
    };

    const from = parseFile(context.filename ?? context.getFilename());
    if (!from) return {};
    const fromIdx = LAYERS.indexOf(from.layer);

    const check = (node, value) => {
      if (typeof value !== "string") return;
      const to = parseImport(value);
      if (!to) return;
      const toIdx = LAYERS.indexOf(to.layer);
      if (toIdx > fromIdx) {
        context.report({
          node,
          messageId: "direction",
          data: { from: from.layer, to: to.layer },
        });
        return;
      }
      if (
        toIdx !== fromIdx ||
        !SLICED.has(from.layer) ||
        !from.slice ||
        !to.slice
      ) {
        return;
      }
      if (to.slice !== from.slice) {
        context.report({
          node,
          messageId: "isolation",
          data: { layer: from.layer, fromSlice: from.slice, toSlice: to.slice },
        });
      } else if (reportSelfBarrel && to.bareBarrel) {
        context.report({
          node,
          messageId: "selfBarrel",
          data: { layer: from.layer, slice: from.slice },
        });
      }
    };

    return {
      ImportDeclaration: (n) => check(n, n.source && n.source.value),
      ExportNamedDeclaration: (n) => n.source && check(n, n.source.value),
      ExportAllDeclaration: (n) => n.source && check(n, n.source.value),
      ImportExpression: (n) =>
        n.source && n.source.type === "Literal" && check(n, n.source.value),
    };
  },
};

const localPlugin = {
  rules: {
    "no-policy-comments": {
      meta: {
        type: "suggestion",
        fixable: "code",
        docs: {
          description:
            "Disallow long prose / policy comments in source. Policy, rationale, library quirks, and background belong in commit messages or separate docs — not embedded in code.",
        },
        messages: {
          policy:
            "정책/산문 주석 감지 ({{length}}자). 근거·배경·라이브러리 quirk·아키텍처 룰은 코드 옆 주석이 아니라 별도 문서나 커밋 메시지에 두세요.",
        },
        schema: [
          {
            type: "object",
            properties: { maxLength: { type: "number" } },
            additionalProperties: false,
          },
        ],
      },
      create(context) {
        const maxLength = context.options[0]?.maxLength ?? 80;
        const isDirective = (v) =>
          /^[\s*]*(eslint-|@ts-|@type|prettier-|biome-|c8 |istanbul|<reference)/.test(
            v
          );
        return {
          "Program:exit"() {
            const sourceCode = context.sourceCode ?? context.getSourceCode();
            const text = sourceCode.getText();
            const comments = sourceCode.getAllComments();
            const groups = [];
            let current = null;
            for (const c of comments) {
              if (isDirective(c.value)) {
                if (current) groups.push(current);
                current = null;
                continue;
              }
              const prev = current?.[current.length - 1];
              if (
                prev &&
                c.type === "Line" &&
                prev.type === "Line" &&
                c.loc.start.line === prev.loc.end.line + 1
              ) {
                current.push(c);
              } else {
                if (current) groups.push(current);
                current = [c];
              }
            }
            if (current) groups.push(current);

            const computeRange = (c) => {
              let cStart = c.range[0];
              let cEnd = c.range[1];

              if (c.type === "Block") {
                let bL = cStart;
                while (bL > 0 && /[ \t\r\n]/.test(text[bL - 1])) bL--;
                let bR = cEnd;
                while (bR < text.length && /[ \t\r\n]/.test(text[bR])) bR++;
                if (
                  bL > 0 &&
                  text[bL - 1] === "{" &&
                  bR < text.length &&
                  text[bR] === "}"
                ) {
                  let prev = bL - 2;
                  while (prev >= 0 && /[ \t\r\n]/.test(text[prev])) prev--;
                  const prevCh = prev >= 0 ? text[prev] : "";
                  if (prevCh === ">" || prevCh === "}" || prevCh === "{") {
                    cStart = bL - 1;
                    cEnd = bR + 1;
                  }
                }
              }

              let lineStart = cStart;
              while (lineStart > 0 && text[lineStart - 1] !== "\n") lineStart--;
              const beforeOnLine = text.slice(lineStart, cStart);
              const beforeIsWS = /^[ \t]*$/.test(beforeOnLine);

              let lineEnd = cEnd;
              while (lineEnd < text.length && text[lineEnd] !== "\n") lineEnd++;
              const afterOnLine = text.slice(cEnd, lineEnd);
              const afterIsWS = /^[ \t\r]*$/.test(afterOnLine);

              if (beforeIsWS && afterIsWS) {
                const removeEnd = lineEnd < text.length ? lineEnd + 1 : lineEnd;
                return [lineStart, removeEnd];
              }
              if (beforeIsWS) {
                return [lineStart, cEnd];
              }
              let s = cStart;
              while (s > lineStart && /[ \t]/.test(text[s - 1])) s--;
              if (afterIsWS) {
                return [s, lineEnd];
              }
              return [s, cEnd];
            };

            for (const group of groups) {
              const joined = group
                .map((c) => c.value.trim())
                .join(" ")
                .trim();
              if (joined.length <= maxLength) continue;

              const first = group[0];
              const last = group[group.length - 1];
              const ranges = group.map(computeRange);

              context.report({
                loc: {
                  start: first.loc.start,
                  end: last.loc.end,
                },
                messageId: "policy",
                data: { length: joined.length },
                *fix(fixer) {
                  for (const [s, e] of ranges) {
                    yield fixer.removeRange([s, e]);
                  }
                },
              });
            }
          },
        };
      },
    },
  },
};

localPlugin.rules["fsd-import"] = fsdImportRule;

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "coverage/**",
      "public/**",
      "next-env.d.ts",
      "**/*.min.js",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      local: localPlugin,
    },
    rules: {
      "local/no-policy-comments": "warn",
      "local/fsd-import": ["warn", { selfBarrel: false }],
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
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@next/next/no-img-element": "off",
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "TemplateLiteral > Identifier[name=/^(SITE_URL|SITE_ORIGIN|BASE_URL)$/]",
          message:
            "base-URL을 문자열 템플릿으로 직접 이어붙이지 마세요. @/shared/config/constants/api 의 absoluteUrl(path) 을 사용하세요 (slash 중복/누락 방지).",
        },
        {
          selector:
            "TemplateLiteral > MemberExpression[property.name='SITE_URL']",
          message:
            "base-URL을 문자열 템플릿으로 직접 이어붙이지 마세요. @/shared/config/constants/api 의 absoluteUrl(path) 을 사용하세요 (slash 중복/누락 방지).",
        },
      ],
    },
  },
  {
    files: ["src/shared/config/constants/api.ts", "scripts/**/*.ts"],
    rules: { "no-restricted-syntax": "off" },
  },
  ...selfBarrelGuards,
  prettierConfig,
  reactHooks.configs.flat.recommended,
];

export default eslintConfig;
