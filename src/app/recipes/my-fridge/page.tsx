import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

const MyFridgePage = () => {
  return (
    <Container>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-4">
        <PrevButton className="absolute left-4 top-4" />
        <div className="text-6xl">🔧</div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            서비스 점검 중이에요
          </h1>
          <p className="mt-2 text-gray-500">
            더 나은 서비스를 위해 준비 중입니다.
            <br />
            빠른 시일 내에 돌아올게요!
          </p>
        </div>
      </div>
    </Container>
  );
};

export default MyFridgePage;
