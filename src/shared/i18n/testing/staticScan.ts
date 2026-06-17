import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import * as ts from "typescript";

const HANGUL = /[가-힣]/;
const JAPANESE = /[぀-ヿ一-鿿]/;

export type Violation = { file: string; line: number; text: string };

const parse = (source: string, fileName: string): ts.SourceFile =>
  ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

const hasIgnore = (lines: string[], lineIdx: number): boolean =>
  /i18n-ignore/.test(lines[lineIdx] ?? "") ||
  /i18n-ignore/.test(lines[lineIdx - 1] ?? "");

const isLiteral = (
  node: ts.Node
): node is ts.StringLiteral | ts.NoSubstitutionTemplateLiteral | ts.JsxText =>
  ts.isStringLiteral(node) ||
  ts.isNoSubstitutionTemplateLiteral(node) ||
  ts.isJsxText(node);

const collectLiterals = (
  sf: ts.SourceFile,
  lines: string[],
  re: RegExp,
  file: string
): Violation[] => {
  const out: Violation[] = [];
  const visit = (node: ts.Node): void => {
    if (isLiteral(node) && re.test(node.text)) {
      const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
      if (!hasIgnore(lines, line)) {
        out.push({ file, line: line + 1, text: node.text.trim() });
      }
    }
    if (ts.isTemplateExpression(node)) {
      const parts = [node.head, ...node.templateSpans.map((s) => s.literal)];
      for (const part of parts) {
        if (re.test(part.text)) {
          const { line } = sf.getLineAndCharacterOfPosition(part.getStart(sf));
          if (!hasIgnore(lines, line)) {
            out.push({ file, line: line + 1, text: part.text.trim() });
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
};

const importsDict = (sf: ts.SourceFile): boolean =>
  sf.statements.some((stmt) => {
    if (
      !ts.isImportDeclaration(stmt) ||
      !ts.isStringLiteral(stmt.moduleSpecifier) ||
      !stmt.moduleSpecifier.text.startsWith("@/shared/i18n")
    ) {
      return false;
    }
    const named = stmt.importClause?.namedBindings;
    return (
      !!named &&
      ts.isNamedImports(named) &&
      named.elements.some(
        (el) => el.name.text === "useT" || el.name.text === "getDictionary"
      )
    );
  });

export const findKoreanLeaks = (
  source: string,
  file = "x.tsx"
): Violation[] => {
  const sf = parse(source, file);
  if (!importsDict(sf)) return [];
  return collectLiterals(sf, source.split(/\r?\n/), HANGUL, file);
};

const SKIP_DIR = new Set(["node_modules", ".next", "messages", "testing"]);

const walk = (dir: string, predicate: (full: string) => boolean): string[] => {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (!SKIP_DIR.has(entry)) out.push(...walk(full, predicate));
    } else if (predicate(full)) {
      out.push(full);
    }
  }
  return out;
};

const isTestFile = (full: string): boolean =>
  /\.(test|spec)\.tsx?$/.test(full) || full.includes("__tests__");

export const collectSourceFiles = (root: string): string[] =>
  walk(
    root,
    (full) =>
      /\.tsx?$/.test(full) && !full.endsWith(".d.ts") && !isTestFile(full)
  );

export const collectI18nTestFiles = (root: string): string[] =>
  walk(root, (full) => /\.i18n\.test\.tsx?$/.test(full));

export const findJapaneseLiterals = (
  source: string,
  file = "x.i18n.test.tsx"
): Violation[] =>
  collectLiterals(parse(source, file), source.split(/\r?\n/), JAPANESE, file);

export const findHangulInDict = (dict: unknown, path = ""): string[] => {
  if (typeof dict === "string") return HANGUL.test(dict) ? [path] : [];
  if (dict && typeof dict === "object") {
    return Object.entries(dict).flatMap(([k, v]) =>
      findHangulInDict(v, path ? `${path}.${k}` : k)
    );
  }
  return [];
};
