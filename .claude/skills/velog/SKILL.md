---
name: velog
description: 개발 기술 블로그 글을 자동 생성하고 Velog에 업로드한다. specs/ 설계문서와 git 히스토리를 기반으로 실제 개발 과정을 기술 블로그 글로 변환.
user_invocable: true
---

# Velog 자동 포스팅 스킬

개발 기술 블로그 글 생성 → 썸네일 생성 → 사용자 리뷰 → Velog 업로드

## 호출

```
/velog {글 제목}
```

## Phase 1: 글 생성

1. **소스 수집**
   - `docs/superpowers/specs/`에서 제목과 관련된 설계문서를 검색 (Grep/Glob 사용)
   - `git log --oneline --all`로 관련 커밋 히스토리 수집
   - 관련 소스 코드가 있으면 핵심 부분 확인

2. **글 작성 원칙** (tech-writing 스킬 기반)

   AI 냄새 제거 — 아래 패턴 절대 사용 금지:
   - **볼드 구조 라벨** (`**문제:**`, `**해결:**`) 대신 자연스러운 문단 흐름
   - 평가형 형용사 (치명적인, 혁신적인, 획기적인)
   - 영어 괄호 병기 (일시 중단(suspend))
   - "실제 운영 중인 서비스에서" 같은 정당화 표현
   - "기존~그러나~" 대조 공식
   - 즉, 다시 말해, 결론적으로 (반복/재진술)
   - ~할 수 있습니다, ~일 수도 있습니다 (헤지 표현)
   - 매우, 상당히, 극적으로 (데이터 없는 강조 부사)

   자연스러운 개발자 문체:
   - 흐르는 문단, 라벨 금지
   - 구체적 사례 먼저 → 일반화
   - 실패 경험 솔직하게 포함
   - 수사적 질문으로 전환
   - 결과부터 말하고 과정 설명
   - 시도 → 문제 → 다음 시도 → 해결 여정 서사
   - 실제 에러 메시지, 팀 대화 직접 인용
   - 코드 블록은 자연스러운 문장으로 도입

   기술 블로그 톤:
   - ~해요, ~이에요, ~거든요 (캐주얼)
   - 1인칭 복수 (우리는, 저희는) 또는 적절히 1인칭 단수
   - 자유로운 구조 (문제 발견 → 해결 여정 → 결과 → 배운 점)

3. **마크다운 생성**
   - Velog는 마크다운을 그대로 받으므로 HTML 변환 불필요
   - frontmatter 포함:
     ```yaml
     ---
     title: {글 제목}
     tags: [{관련 태그 자동 추천}]
     visibility: public
     url_slug: {자동 생성 또는 빈 값}
     series_id: null
     ---
     ```
   - 파일 저장: `tistory/drafts/{YYYY-MM-DD}-{글 제목}.md`
   - 파일명에 한글 제목 그대로 사용

## Phase 2: 썸네일 생성

1. 글 내용을 분석하여 이 글에 맞는 이미지 프롬프트를 생성
2. 기본 프롬프트(`tistory/prompts/thumbnail_base.txt`)는 스크립트가 자동으로 결합
3. 실행:
   ```bash
   python tistory/scripts/generate_image.py --prompt "{글별 커스텀 프롬프트}" --output "tistory/images/{YYYY-MM-DD}-{글 제목}.png"
   ```

## Phase 3: 사용자 리뷰

**반드시 사용자 승인을 받아야 업로드 진행**

1. 생성된 글 전체 내용을 보여준다
2. 생성된 썸네일 이미지를 Read 도구로 보여준다
3. 사용자에게 확인:
   - 글 내용 수정 요청 → 수정 후 다시 보여준다
   - 이미지 재생성 요청 → Phase 2 다시 실행
   - 태그 변경 → frontmatter 수정
   - 공개/비공개 변경 → frontmatter의 visibility 수정
4. 사용자가 "올려" / "승인" / "ㅇㅇ" 등으로 확인하면 Phase 4로

## Phase 4: 업로드

1. 실행:
   ```bash
   cd tistory/scripts && python upload.py --draft "../drafts/{파일명}.md" --image "../images/{파일명}.png"
   ```
2. 스크립트가 출력하는 발행 URL을 사용자에게 전달
3. 완료 메시지: "발행 완료! {URL}"

## 에러 처리

- `.env` 미설정 시: 사용자에게 토큰 설정 안내
- 이미지 생성 실패 시: 프롬프트 수정 후 재시도
- 업로드 실패 시: 에러 메시지 표시, 재시도 제안
- 토큰 만료 시: refresh_token으로 자동 갱신 (upload.py가 처리)

## 필요 환경

- Python 3.10+
- `tistory/.env`에 VELOG_ACCESS_TOKEN, VELOG_REFRESH_TOKEN, GEMINI_API_KEY 설정
- `pip install -r tistory/requirements.txt` 완료

## Velog 토큰 추출 방법

1. velog.io에 로그인
2. 브라우저 DevTools (F12) → Application → Cookies → velog.io
3. `access_token`과 `refresh_token` 값을 복사
4. `tistory/.env`에 붙여넣기
