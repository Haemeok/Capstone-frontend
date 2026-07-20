# Skill trigger evals

커스텀 스킬이 "불려야 할 때 불리고, 불리지 말아야 할 때 안 불리는지" 검증하는 eval 세트.
포맷은 skill-creator 플러그인의 트리거 평가 스크립트가 그대로 읽는 형식이다:

```json
[{"query": "사용자 프롬프트", "should_trigger": true|false}]
```

## 설계 원칙 (script.md 발표 기준)

- 스킬당 **positive 5~6 + negative 5~6**. negative는 "명백히 무관한 질문"이 아니라
  **키워드가 겹치지만 다른 스킬/도구가 맞는 근접 오답**으로 만든다
  (예: posthog eval의 negative = GA4/BigQuery 질문).
- 쿼리는 실제로 칠 법한 문장으로 — 파일 경로, 프로젝트 맥락, 구어체 포함.
- 결과가 트리거 여부만 보는 게 아니라, 실패 시 **description을 고치는 근거**로 쓴다.

## 실행 방법

skill-creator 플러그인 디렉터리에서 실행한다 (평가 1회 = 쿼리 수 × runs-per-query 만큼
`claude -p` 호출 → 과금 발생. 기본 3회면 스킬당 ~36콜):

```bash
cd "C:\Users\user\.claude\plugins\cache\claude-plugins-official\skill-creator\unknown\skills\skill-creator"

python -m scripts.run_eval \
  --eval-set "C:\Users\user\Desktop\recipio\Capstone-frontend\.claude\skill-evals\seo-metadata.trigger.json" \
  --skill-path "C:\Users\user\Desktop\recipio\Capstone-frontend\.claude\skills\seo-metadata" \
  --runs-per-query 3 --verbose
```

description 자동 개선 루프까지 돌리려면 (train/test 분할 + 최대 5회 반복 개선):

```bash
python -m scripts.run_loop \
  --eval-set <위와 동일> --skill-path <위와 동일> \
  --model claude-fable-5 --max-iterations 5 --verbose
```

## 커버리지 현황

| eval 세트 | 대상 스킬 | 주 near-miss 상대 |
| --- | --- | --- |
| github-issue-flow.trigger.json | github-issue-flow | 이슈 조회/즉시수정/PR 생성 |
| seo-metadata.trigger.json | seo-metadata | sitemap/robots/JSON-LD/일반 카피 |
| posthog-analytics.trigger.json | posthog-analytics | ga4-bigquery, Search Console |

미작성: writing-* 체인(트리거보다 **단계 순서** 검증이 필요 → 트랜스크립트에서
Skill 호출 순서를 assert하는 별도 하네스 필요), planning-hygiene ↔
subagent-driven-development(중복 정리 후 작성이 맞음).
