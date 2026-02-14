import { Metadata } from "next";

import ArticleLayout from "@/shared/ui/article/ArticleLayout";
import ArticleSection from "@/shared/ui/article/ArticleSection";

export const metadata: Metadata = {
  title: "서비스 공지사항 | 레시피오",
  description:
    "레시피오 서비스 업데이트 및 주요 공지사항을 안내합니다.",
};

const NoticePage = () => {
  return (
    <ArticleLayout
      title="레시피오 v2.0 업데이트 안내"
      subtitle="공지사항"
      date="2026. 2. 14"
    >
      <p className="text-[15px] leading-relaxed text-gray-700">
        안녕하세요, 레시피오 팀입니다. 더 나은 요리 경험을 위해 대규모
        업데이트를 진행했습니다. 주요 변경사항을 안내드립니다.
      </p>

      <ArticleSection title="AI 레시피 추천 기능 강화">
        <p>
          기존 AI 레시피 추천 알고리즘이 대폭 개선되었습니다. 이제 여러분의 냉장고
          속 재료를 기반으로 더 정확하고 다양한 레시피를 추천해 드립니다.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>냉장고 재료 기반 맞춤 레시피 추천 정확도 40% 향상</li>
          <li>영양 균형을 고려한 식단 추천 기능 추가</li>
          <li>계절별 제철 재료 활용 레시피 자동 제안</li>
          <li>알레르기 및 식이 제한 필터 강화</li>
        </ul>
      </ArticleSection>

      <ArticleSection title="유튜브 레시피 연동 개선">
        <p>
          유튜브 레시피 영상을 더 쉽게 저장하고 활용할 수 있도록 연동 기능을
          개선했습니다.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>유튜브 영상 URL 붙여넣기만으로 레시피 자동 추출</li>
          <li>영상 속 조리 단계를 타임스탬프와 함께 자동 정리</li>
          <li>영상 재생 중 슬라이드쇼 모드로 단계별 확인 가능</li>
        </ul>
      </ArticleSection>

      <ArticleSection title="캘린더 식단 관리">
        <p>
          새롭게 추가된 캘린더 기능으로 일주일 식단을 미리 계획하고 관리할 수
          있습니다.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>날짜별 식단 기록 및 계획 수립</li>
          <li>주간/월간 식단 한눈에 보기</li>
          <li>장보기 목록 자동 생성</li>
        </ul>
      </ArticleSection>

      <ArticleSection title="커뮤니티 기능 확대">
        <p>
          다른 요리사들과 소통할 수 있는 커뮤니티 기능이 확대되었습니다.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>레시피 댓글 및 평점 시스템 개선</li>
          <li>레시피 공유 시 조리 팁 함께 공유 가능</li>
          <li>실시간 알림으로 댓글 및 좋아요 즉시 확인</li>
        </ul>
      </ArticleSection>

      <ArticleSection title="앱 성능 최적화">
        <p>
          전반적인 앱 성능을 최적화하여 더 빠르고 안정적인 사용 경험을
          제공합니다.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>페이지 로딩 속도 평균 35% 개선</li>
          <li>이미지 최적화로 데이터 사용량 절감</li>
          <li>오프라인 환경에서도 저장된 레시피 열람 가능</li>
        </ul>
      </ArticleSection>

      <div className="mt-12 rounded-2xl bg-gray-50 px-6 py-5">
        <p className="text-sm text-gray-500">
          업데이트와 관련하여 문의사항이 있으시면{" "}
          <strong>1119wj@naver.com</strong>으로 연락해 주세요. 앞으로도 더 나은
          요리 경험을 위해 노력하겠습니다.
        </p>
      </div>
    </ArticleLayout>
  );
};

export default NoticePage;
