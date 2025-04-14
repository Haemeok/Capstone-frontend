import CategoriesTabs from "@/components/CategoriesTabs";
import CateGoryItem from "@/components/CateGoryItem";
import { categoriesItems } from "@/mock";
import { useToastStore } from "@/store/useToastStore";
import { ChevronRight } from "lucide-react";
const HomePage = () => {
  const { addToast, toastList } = useToastStore();
  return (
    <div className="min-h-screen bg-[#f7f7f7] text-gray-800 pb-20">
      <div className="sticky top-0 bg-[#f7f7f7] backdrop-blur-md z-20 px-6 pt-6 pb-3">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">Home</h1>
        </div>
      </div>

      <div className="relative z-10">
        <CategoriesTabs title="카테고리" />
        <div className="mt-8 w-full">
          <div className="flex justify-between items-center px-6 mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-800">추천 레시피</h2>
            </div>
            <button className="text-sm text-gray-500 flex items-center hover:text-gray-700">
              더보기
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="pl-6 flex gap-3 w-full overflow-x-auto pb-4 scrollbar-hide">
            {categoriesItems.map((item) => (
              <CateGoryItem
                key={item.id}
                id={item.id}
                name={item.name}
                imageUrl={item.imageUrl}
                onClick={() => {
                  // TODO: 실제 라우팅 로직 구현 (예: /recipes/{item.id})
                  console.log(`Navigating to item: ${item.id}`);
                  // navigate(`/recipes/${category.id}`);
                }}
                className="w-40 h-40"
              />
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            addToast({ message: "레시피를 생성했어요 !", variant: "success" });
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          토스트 테스트 버튼
        </button>
        <button
          onClick={() => {
            addToast({ message: "문제가 발생했어요", variant: "error" });
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          토스트 테스트 버튼
        </button>
      </div>
    </div>
  );
};

export default HomePage;
