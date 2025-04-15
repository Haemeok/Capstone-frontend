import CategoriesTabs from '@/components/CategoriesTabs';
import CateGoryItem from '@/components/CateGoryItem';
import { categoriesItems } from '@/mock';
import { useToastStore } from '@/store/useToastStore';
import { ChevronRight } from 'lucide-react';
const HomePage = () => {
  const { addToast, toastList } = useToastStore();
  return (
    <div className="min-h-screen bg-[#f7f7f7] pb-20 text-gray-800">
      <div className="sticky top-0 z-20 bg-[#f7f7f7] px-6 pt-6 pb-3 backdrop-blur-md">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Home</h1>
        </div>
      </div>

      <div className="relative z-10">
        <CategoriesTabs title="카테고리" />
        <div className="mt-8 w-full">
          <div className="mb-4 flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-800">추천 레시피</h2>
            </div>
            <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
              더보기
              <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>

          <div className="scrollbar-hide flex w-full gap-3 overflow-x-auto pb-4 pl-6">
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
                className="h-40 w-40"
              />
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            addToast({ message: '레시피를 생성했어요 !', variant: 'success' });
          }}
          className="rounded-md bg-green-500 px-4 py-2 text-white"
        >
          토스트 테스트 버튼
        </button>
        <button
          onClick={() => {
            addToast({ message: '문제가 발생했어요', variant: 'error' });
          }}
          className="rounded-md bg-red-500 px-4 py-2 text-white"
        >
          토스트 테스트 버튼
        </button>
      </div>
    </div>
  );
};

export default HomePage;
