#!/usr/bin/env bash
# Writing harness 횡단 정적 검증 (SH-1 ~ SH-3)
# 4개 SKILL.md 가 frontmatter / handoff / glossary 컨벤션을 지키는지 확인.

set -e

SKILLS=("writing-thesis" "writing-outline" "writing-drafting" "writing-polish")
ROOT=".claude/skills"
FAIL=0

# SH-1: frontmatter 컨벤션
for s in "${SKILLS[@]}"; do
  f="$ROOT/$s/SKILL.md"
  if [ ! -f "$f" ]; then
    echo "FAIL SH-1 [$s]: SKILL.md missing"
    FAIL=1
    continue
  fi
  for key in "name: $s" "license: MIT" "author: recipio" "version:"; do
    if ! grep -q "$key" "$f"; then
      echo "FAIL SH-1 [$s]: frontmatter missing '$key'"
      FAIL=1
    fi
  done
done

# SH-2: Handoff 섹션 (writing-thesis/outline/drafting) 또는 Terminal (writing-polish)
for s in writing-thesis writing-outline writing-drafting; do
  f="$ROOT/$s/SKILL.md"
  [ -f "$f" ] || continue
  if ! grep -q "^## Handoff" "$f"; then
    echo "FAIL SH-2 [$s]: '## Handoff' section missing"
    FAIL=1
  fi
done
f="$ROOT/writing-polish/SKILL.md"
if [ -f "$f" ]; then
  if ! grep -qE "^## Terminal|체인 종료|no handoff" "$f"; then
    echo "FAIL SH-2 [writing-polish]: terminal marker missing (expected '## Terminal' or '체인 종료' or 'no handoff')"
    FAIL=1
  fi
fi

# SH-3: Glossary 단어가 4개 SKILL.md 모두에 등장
TERMS=("thesis" "emphasis budget" "evidence pool" "working doc")
for s in "${SKILLS[@]}"; do
  f="$ROOT/$s/SKILL.md"
  [ -f "$f" ] || continue
  for t in "${TERMS[@]}"; do
    if ! grep -qi "$t" "$f"; then
      echo "FAIL SH-3 [$s]: glossary term '$t' missing"
      FAIL=1
    fi
  done
done

# SH-3: synonym drift 금지어
BANNED=("강조 한도" "evidence list" "엠퍼시스 버짓" "강조 예산 상한")
for s in "${SKILLS[@]}"; do
  f="$ROOT/$s/SKILL.md"
  [ -f "$f" ] || continue
  for b in "${BANNED[@]}"; do
    if grep -q "$b" "$f"; then
      echo "FAIL SH-3 [$s]: banned synonym '$b' found (drift from glossary)"
      FAIL=1
    fi
  done
done

if [ $FAIL -eq 0 ]; then
  echo "OK: all writing-harness static checks pass"
  exit 0
else
  echo ""
  echo "Some checks failed. See above."
  exit 1
fi
