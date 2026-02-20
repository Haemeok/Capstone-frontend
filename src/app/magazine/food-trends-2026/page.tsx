import { Metadata } from "next";

import ArticleLayout from "@/shared/ui/article/ArticleLayout";
import ArticleSection from "@/shared/ui/article/ArticleSection";
import type { TocItem } from "@/shared/ui/article/types";

export const metadata: Metadata = {
  title: "2026년 식문화 트렌드: 식탁을 바꾸는 8가지 키워드 | 레시피오",
  description:
    "홀푸즈 마켓 트렌드 리포트를 기반으로 정리한 2026년 식문화 트렌드. 탈로우의 재발견부터 식초 르네상스까지, 올해 우리 식탁을 바꿀 핵심 키워드를 소개합니다.",
};

const TOC_ITEMS: TocItem[] = [
  { id: "tallow", title: "건강한 지방, 탈로우의 재발견" },
  { id: "fiber", title: "차세대 영양소, 식이섬유" },
  { id: "couture", title: "주방의 꾸뛰르화" },
  { id: "frozen", title: "냉동 식품의 미식화" },
  { id: "vinegar", title: "식초 르네상스의 도래" },
  { id: "sweets", title: "단맛의 전환, 마인드풀 스위츠" },
  { id: "instant", title: "즉석 식품의 재정의" },
  { id: "micro", title: "마이크로 레스토랑의 확산" },
];

const FoodTrends2026Page = () => {
  return (
    <ArticleLayout
      title="2026년, 우리는 무엇을 먹게 될까?"
      subtitle="푸드 매거진"
      date="2026. 2. 14"
      tocItems={TOC_ITEMS}
    >
      <p className="text-[15px] leading-relaxed text-gray-700">
        홀푸즈 마켓(Whole Foods Market)이 매년 발표하는 트렌드 리포트는 전 세계
        식문화 흐름을 진단하고 예측합니다. 식자재 바이어, 셰프, 미식
        칼럼니스트, 유통 전문가들이 전 세계 재래시장과 푸드 박람회를 직접
        탐방하며 정리한 2026년 식문화 트렌드를 소개합니다.
      </p>

      <ArticleSection id="tallow" title="1. 건강한 지방, 탈로우의 재발견">
        <p>
          비프 탈로우(소기름)가 식물성 오일의 대안으로 주목받고 있습니다.
          &quot;노즈 투 테일(Nose to Tail)&quot; 음식 철학과 맞닿아 있는 이
          흐름은, 동물의 모든 부위를 알뜰히 활용하자는 지속가능한 식문화를
          예고합니다.
        </p>
        <p>
          한때 건강에 해롭다고 외면받았던 동물성 지방이 재조명되면서, 탈로우로
          튀긴 감자칩이나 탈로우 기반 조리용 오일이 프리미엄 식료품점에서 인기를
          끌고 있습니다.
        </p>
      </ArticleSection>

      <ArticleSection id="fiber" title="2. 차세대 영양소, 식이섬유">
        <p>
          단백질 강화 시대를 지나 이제 식이섬유가 영양의 중심에 섭니다.
          프리바이오틱스 기반 탄산음료, 이눌린이 첨가된 파스타와 베이글, 식이섬유
          강화 시리얼이 인기를 얻을 전망입니다.
        </p>
        <p>
          장 건강의 중요성이 널리 알려지면서, 소비자들은 단순히 칼로리와 단백질만
          따지던 습관에서 벗어나 식이섬유 함량까지 꼼꼼히 확인하기 시작했습니다.
        </p>
      </ArticleSection>

      <ArticleSection id="couture" title="3. 주방의 꾸뛰르화">
        <p>
          주방이 단순한 조리 공간을 넘어 라이프스타일을 표현하는 공간으로
          진화하고 있습니다. 고급 올리브오일 병, 감각적인 디자인의 캔 참치,
          예술적 그래픽이 입혀진 조미료까지 — 이제 식재료 패키지도 인테리어의
          일부입니다.
        </p>
        <p>
          와인 라벨처럼 아름다운 디자인의 식품 패키지가 SNS에서 화제가 되고,
          &quot;보여주고 싶은 주방&quot;을 꾸미려는 소비자들이 늘어나고 있습니다.
        </p>
      </ArticleSection>

      <ArticleSection id="frozen" title="4. 냉동 식품의 미식화">
        <p>
          편의식의 대명사였던 냉동식품이 레스토랑 수준으로 진화하고 있습니다.
          &quot;레디 투 히트(Ready to Heat)&quot; 메뉴들은 로컬 퀴진을 구현한
          고급 냉동식으로, 집에서 파인다이닝을 즐기는 시대를 열고 있습니다.
        </p>
        <p>
          1인 가구 증가와 맞물려 덮밥류(+8.2%), 샐러드(+22.2%),
          비빔밥(+13.7%) 등 한 그릇에 영양 균형을 맞춘 프리미엄 간편식의 성장이
          두드러집니다.
        </p>
      </ArticleSection>

      <ArticleSection id="vinegar" title="5. 식초 르네상스의 도래">
        <p>
          식초를 마시고 즐기는 시대가 옵니다. 크래프트 식초, 생유산균이 살아있는
          비정제 식초, 과일과 허브로 풍미를 낸 수제 식초 음료가 새로운 음료
          카테고리로 떠오르고 있습니다.
        </p>
        <p>
          건강을 의식하면서도 맛있는 음료를 찾는 소비자들에게 식초 기반 음료는
          매력적인 대안이 되고 있으며, 제로 탄산음료에 이은 차세대 건강 음료로
          주목받고 있습니다.
        </p>
      </ArticleSection>

      <ArticleSection id="sweets" title="6. 단맛의 전환, 마인드풀 스위츠">
        <p>
          달콤함을 포기하지 않되 마음의 짐은 덜고 싶어하는 소비자들이 늘고
          있습니다. 대추야자 페이스트, 허브로 풍미를 더한 젤리, 메이플 시럽을
          사용한 그래놀라가 대세입니다.
        </p>
        <p>
          정제 설탕 대신 자연 유래 감미료를 활용한 디저트와 간식이 늘면서,
          &quot;죄책감 없는 단맛&quot;이 새로운 소비 트렌드로 자리 잡고 있습니다.
        </p>
      </ArticleSection>

      <ArticleSection id="instant" title="7. 즉석 식품의 재정의">
        <p>
          즉석 식품이 원재료 품질과 영양을 개선한 형태로 재탄생하고 있습니다.
          뼈를 고아 만든 베이스의 고단백 컵라면, 1회용 푸어오버 라떼 파우치 등
          프리미엄 즉석 식품이 잇따라 출시되고 있습니다.
        </p>
        <p>
          &quot;빠르지만 건강하게&quot;라는 소비자의 니즈에 부응하며, 편의성과
          품질 모두를 잡은 제품들이 시장을 이끌고 있습니다.
        </p>
      </ArticleSection>

      <ArticleSection id="micro" title="8. 마이크로 레스토랑의 확산">
        <p>
          코로나19 이후 늘어난 홈쿠커들이 자신의 집에서 작은 레스토랑을 여는
          트렌드가 확산되고 있습니다. 도심이 아닌 주택가에서도 카페, 칵테일 바,
          서퍼 클럽 등 다양한 형식의 작은 음식점이 등장하고 있습니다.
        </p>
        <p>
          국내에서는 좋아하는 푸드 인플루언서의 팝업 레스토랑, 쿠킹 클래스 등
          새로운 형태의 마이크로 레스토랑이 늘어나고 있으며, 같은 취향을 가진
          사람들이 모이는 느슨한 미식 공동체가 형성되고 있습니다.
        </p>
      </ArticleSection>

      <div className="mt-12 rounded-2xl bg-olive-light/5 px-6 py-5">
        <p className="text-[15px] font-medium text-gray-900">
          레시피오에서 트렌드를 직접 경험해 보세요
        </p>
        <p className="mt-1 text-sm text-gray-500">
          2026년 트렌드 재료를 활용한 레시피를 AI가 추천해 드립니다. 냉장고 속
          재료를 입력하고 올해의 트렌드 레시피를 만나보세요.
        </p>
      </div>

      <div className="mt-6 rounded-2xl bg-gray-50 px-6 py-5">
        <p className="text-xs text-gray-400">
          본 기사는 홀푸즈 마켓 트렌드 리포트, SPC매거진, 하퍼스 바자 코리아,
          식품음료신문 등의 자료를 참고하여 재구성하였습니다.
        </p>
      </div>
    </ArticleLayout>
  );
};

export default FoodTrends2026Page;
