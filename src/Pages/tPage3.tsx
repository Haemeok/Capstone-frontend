import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ingredientItems } from '@/mock'; // 가정: ingredientItems 배열과 id 포함

// --- 혁신적인 UI를 위한 설정 ---

// 1. 카테고리별 색상 정의 (Tailwind 색상 클래스 활용 - 필요시 커스텀 색상 정의)
const categoryColors: { [key: string]: string } = {
  야채: 'bg-green-500',
  '가공/유제품': 'bg-blue-500',
  고기: 'bg-red-500',
  곡물: 'bg-yellow-600', // 노란색은 대비 주의
  과일: 'bg-orange-500',
  면: 'bg-purple-500',
};

// 2. 카테고리 리스트
const ingreCategory = ['야채', '가공/유제품', '고기', '곡물', '과일', '면'];

// --- 컴포넌트 ---

const Page2 = () => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {' '}
      {/* 전체 배경색 추가 */}
      {/* 헤더 */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-4">
        <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
          도원진님의 냉장고
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm" // 버튼 크기 조절
            onClick={() => setIsDeleteMode(!isDeleteMode)}
            className={cn(
              'transition-colors',
              isDeleteMode && 'border-red-500 text-red-500 hover:bg-red-50', // 삭제 모드일 때 스타일
            )}
          >
            {isDeleteMode ? '삭제 완료' : '재료 삭제'}
          </Button>
          <Button
            variant="default" // 주요 액션 버튼 강조
            size="sm"
            onClick={() => navigate('/ingredients/new')}
            className="bg-indigo-600 text-white hover:bg-indigo-700" // 버튼 색상 변경
          >
            재료 추가
          </Button>
        </div>
      </div>
      {/* 카테고리 및 재료 목록 */}
      <div className="flex flex-col gap-6 p-4">
        {' '}
        {/* 카테고리 간 간격(gap) 증가 */}
        {ingreCategory.map((category) => {
          // 현재 카테고리에 해당하는 재료 필터링
          const itemsInCategory = ingredientItems.filter(
            (item) => item.category === category,
          );

          // 해당 카테고리에 아이템이 없으면 렌더링하지 않음 (선택 사항)
          // if (itemsInCategory.length === 0) return null;

          return (
            <div key={category} className="flex flex-col gap-3">
              <div className="flex items-center gap-1">
                <img src={'meat.png'} className="h-20 w-20" />
                <h2 className="text-lg font-semibold text-gray-700">
                  {category}
                </h2>
              </div>
              {/* 2. 재료 목록 (고정 2열 그리드) */}

              <div className="grid flex-1 grid-cols-2 gap-x-3 gap-y-2">
                {itemsInCategory.length > 0 ? (
                  itemsInCategory.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className={cn(
                        'flex items-center justify-center rounded-lg px-3 py-2 text-center text-sm font-medium', // 기본 스타일
                        'border border-gray-200 bg-gray-50 text-gray-700', // 배경, 테두리, 텍스트 색상
                        'relative cursor-pointer', // 트랜지션 효과
                      )}
                      onClick={() => {
                        if (isDeleteMode) {
                          console.log('Delete:', ingredient.name); // 실제 삭제 로직 구현
                          // 예: deleteIngredient(ingredient.id);
                        } else {
                          console.log('View:', ingredient.name); // 상세 보기 또는 다른 액션
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      {ingredient.name}
                      {isDeleteMode && ( // 삭제 모드 시 X 아이콘 표시 (옵션)
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                          X
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  // 아이템이 없을 때 표시 (옵션)
                  <div className="col-span-2 py-4 text-center text-sm text-gray-400">
                    재료가 없습니다.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page2;

// --- 참고: Tailwind CSS 설정 ---
// 만약 writing-mode 유틸리티가 없다면 tailwind.config.js에 추가 필요
// const plugin = require('tailwindcss/plugin')
// module.exports = {
//   // ...
//   plugins: [
//     plugin(function({ addUtilities }) {
//       addUtilities({
//         '.writing-mode-vertical-rl': { 'writing-mode': 'vertical-rl' },
//         '.writing-mode-horizontal-tb': { 'writing-mode': 'horizontal-tb' },
//         // 필요에 따라 다른 writing-mode 추가
//       })
//     })
//   ],
// }
