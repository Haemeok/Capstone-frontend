import { Metadata } from "next";

import ArticleLayout from "@/shared/ui/article/ArticleLayout";
import ArticleSection from "@/shared/ui/article/ArticleSection";

export const metadata: Metadata = {
  title: "개인정보 처리방침 | 레시피오",
  description:
    "레시피오 개인정보 처리방침입니다. 개인정보의 수집, 이용, 보유, 파기 등에 대한 정책을 안내합니다.",
};

const PrivacyPage = () => {
  return (
    <ArticleLayout
      title="개인정보 처리방침"
      subtitle="정책"
      date="2026. 1. 20"
    >
      <p className="text-[15px] leading-relaxed text-gray-700">
        &#39;팀 레시피오&#39;(이하 &#39;회사&#39;라 한다)는 개인정보 보호법
        제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고
        원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을
        수립·공개합니다.
      </p>

      <ArticleSection title="제1조 (개인정보의 처리 목적)">
        <p>
          회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는
          개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이
          변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는
          등 필요한 조치를 이행할 예정입니다.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            홈페이지 회원가입 및 관리: 소셜 로그인(SNS)을 통한 본인
            식별·인증, 회원 자격 유지·관리, 서비스 부정이용 방지, 각종
            고지·통지
          </li>
          <li>
            재화 또는 서비스 제공: 레시피 추천 및 관리 서비스 제공, 콘텐츠
            제공
          </li>
          <li>
            서비스 개선 및 신규 서비스 개발: 서비스 이용 기록과 접속 빈도
            분석, 서비스 이용에 대한 통계, 서비스 분석 및 맞춤형 서비스 제공
          </li>
        </ol>
      </ArticleSection>

      <ArticleSection title="제2조 (개인정보의 수집 항목 및 방법)">
        <p>
          회사는 회원가입 시 아래와 같이 최소한의 개인정보를 수집하고
          있습니다.
        </p>
        <h3 className="mt-4 font-semibold text-gray-900">
          1. 소셜 로그인을 통해 수집하는 항목
        </h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>Google: 이름, 이메일 주소, 프로필 사진, Google 고유 ID</li>
          <li>Kakao: 닉네임, 이메일 주소(사용자 동의 시)</li>
          <li>Naver: 이름, 이메일 주소</li>
          <li>Apple: 이름, 이메일 주소</li>
        </ul>
        <h3 className="mt-4 font-semibold text-gray-900">
          2. 서비스 이용 과정에서 자동 생성되어 수집되는 항목
        </h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            IP 주소, 쿠키(Cookie), 로컬 스토리지(Local Storage), 서비스 이용
            기록(방문 일시, 기능 사용 기록), 기기 정보
          </li>
        </ul>
      </ArticleSection>

      <ArticleSection title="제3조 (개인정보의 처리 및 보유 기간)">
        <p>
          ① 회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터
          개인정보를 수집 시에 동의받은 개인정보 보유·이용 기간 내에서
          개인정보를 처리·보유합니다.
        </p>
        <p>② 구체적인 개인정보 처리 및 보유 기간은 다음과 같습니다.</p>
        <h3 className="mt-4 font-semibold text-gray-900">
          1. 회원 가입 및 관리: 회원 탈퇴 시까지
        </h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지
          </li>
          <li>
            관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당
            수사·조사 종료 시까지
          </li>
          <li>
            서비스 이용에 따른 채권·채무관계 잔존 시에는 해당
            채권·채무관계 정산 시까지
          </li>
        </ul>
        <h3 className="mt-4 font-semibold text-gray-900">
          2. 관련 법령에 의한 정보 보유 사유
        </h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            「통신비밀보호법」에 따른 웹사이트 방문 기록: 3개월
          </li>
        </ul>
      </ArticleSection>

      <ArticleSection title="제4조 (개인정보의 파기 절차 및 방법)">
        <p>
          ① 회사는 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가
          불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
        </p>
        <p>② 파기 절차 및 방법은 다음과 같습니다.</p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            파기 절차: 회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의
            개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.
          </li>
          <li>
            파기 방법: 전자적 파일 형태로 기록·저장된 개인정보는 기록을
            재생할 수 없도록 기술적 방법을 이용하여 파기하며, 종이 문서에
            기록·저장된 개인정보는 분쇄하거나 소각하여 파기합니다.
          </li>
        </ol>
      </ArticleSection>

      <ArticleSection title="제5조 (정보주체와 법정대리인의 권리·의무 및 그 행사방법)">
        <p>
          ① 정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지
          요구 등의 권리를 행사할 수 있습니다.
        </p>
        <p>
          ② 권리 행사는 회사에 대해 「개인정보 보호법」 시행령 제41조 제1항에
          따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며,
          회사는 이에 대해 지체 없이 조치하겠습니다.
        </p>
        <p>
          ③ 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을
          통하여 하실 수도 있습니다. 이 경우 &quot;개인정보 처리 방법에 관한
          고시(제2020-7호)&quot; 별지 제11호 서식에 따른 위임장을
          제출하셔야 합니다.
        </p>
      </ArticleSection>

      <ArticleSection title="제6조 (개인정보의 안전성 확보 조치)">
        <p>
          회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고
          있습니다.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            관리적 조치: 내부관리계획 수립·시행, 개인정보 취급 직원 최소화
            및 교육
          </li>
          <li>
            기술적 조치: 개인정보처리시스템 등의 접근권한 관리,
            접근통제시스템 설치, 고유식별정보 등의 암호화(SSL 인증서 설치
            등), 보안프로그램 설치
          </li>
          <li>
            웹 보안 조치: 세션 정보 등 중요 데이터는 보안 쿠키(HttpOnly,
            Secure)를 사용하여 스크립트 접근을 차단하고 네트워크 구간을
            암호화하여 전송
          </li>
        </ol>
      </ArticleSection>

      <ArticleSection title="제7조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)">
        <p>
          ① 회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를
          저장하고 수시로 불러오는 &#39;쿠키(cookie)&#39; 및 &#39;로컬
          스토리지(Local Storage)&#39;를 사용합니다.
        </p>
        <p>
          ② 쿠키는 이용자의 브라우저에 저장되며, 로컬 스토리지는 이용자의
          기기 내에 저장됩니다.
        </p>
        <p>
          ③ 거부 설정: 웹브라우저 상단의 도구 &gt; 인터넷 옵션 &gt; 개인정보
          메뉴의 옵션 설정을 통해 저장 거부를 설정할 수 있습니다. 단, 거부할
          경우 로그인이 필요한 일부 서비스 이용에 어려움이 발생할 수
          있습니다.
        </p>
      </ArticleSection>

      <ArticleSection title="제8조 (행태정보의 수집·이용 및 거부 등에 관한 사항)">
        <p>
          ① 회사는 서비스 이용분석 및 품질 개선을 위하여 아래와 같이 외부
          행태정보 분석 도구를 이용하고 있습니다.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>도구명: PostHog</li>
          <li>
            수집 항목: 이용자의 웹/앱 서비스 방문 기록, 기능 클릭수, 체류
            시간, 기기 정보 (단, 이용자가 입력하는 민감한 개인정보 및 화면
            녹화 데이터는 수집하지 않습니다.)
          </li>
          <li>
            수집 방법: 이용자가 웹 사이트 및 앱을 실행하거나 기능을 사용할 때
            자동 수집
          </li>
          <li>
            보유 및 이용 기간: 회원 탈퇴 또는 서비스 종료 시까지 (단, 통계
            분석 데이터는 비식별화하여 보관)
          </li>
        </ol>
        <p>
          ② 이용자는 브라우저의 &#39;Do Not Track(추적 금지)&#39; 설정을
          통해 이러한 행태정보 수집을 거부할 수 있습니다.
        </p>
      </ArticleSection>

      <ArticleSection title="제9조 (개인정보의 국외 이전)">
        <p>
          회사는 서비스 제공 및 향상을 위해 아래와 같이 개인정보 처리를 국외에
          위탁하고 있습니다.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>수탁 업체: PostHog, Inc.</li>
          <li>이전되는 국가: 미국 (US)</li>
          <li>
            이전 일시 및 방법: 서비스 이용 시 네트워크를 통해 수시로 전송
          </li>
          <li>
            이전되는 개인정보 항목: IP 주소, 서비스 이용 기록(방문 및 클릭
            로그), 기기 정보
          </li>
          <li>
            이전받는 자의 이용 목적 및 보유 기간: 서비스 이용 통계 및 분석 /
            위탁 계약 종료 시까지
          </li>
        </ol>
      </ArticleSection>

      <ArticleSection title="제10조 (개인정보 보호책임자)">
        <ul className="list-disc space-y-1 pl-5">
          <li>성명: 도원진</li>
          <li>직책: 대표</li>
          <li>연락처(이메일): 1119wj@naver.com</li>
        </ul>
      </ArticleSection>

      <div className="mt-12 rounded-2xl bg-gray-50 px-6 py-5">
        <p className="text-sm text-gray-500">
          이 개인정보 처리방침은 <strong>2026. 1. 20</strong>부터
          적용됩니다.
        </p>
      </div>
    </ArticleLayout>
  );
};

export default PrivacyPage;
