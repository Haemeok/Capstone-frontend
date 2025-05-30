import PrevButton from '@/components/Button/PrevButton';
import SuspenseImage from '@/components/Image/SuspenseImage';
import useRecipeHistoryDetailQuery from '@/hooks/useRecipeHistoryDetailQuery';
import { useToastStore } from '@/store/useToastStore';
import { formatPrice } from '@/utils/recipe';
import React from 'react';
import { useParams, useNavigate } from 'react-router';

const CalendarDetailPage = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  if (date === undefined) {
    navigate('/');
    addToast({
      message: '잘못된 접근입니다.',
      variant: 'error',
      position: 'bottom',
    });
    return;
  }

  const { data, isLoading, error } = useRecipeHistoryDetailQuery(date, {
    enabled: !!date,
  });

  return (
    <div>
      <header className="relative flex items-center justify-center p-4">
        <PrevButton className="absolute left-4" />
        <h2 className="text-xl font-bold">{date} 기록</h2>
      </header>
      <div className="flex flex-col gap-4 p-4">
        {data?.map((item) => (
          <div
            key={item.recipeId}
            onClick={() => navigate(`/recipes/${item.recipeId}`)}
            className="flex items-center gap-4 rounded-2xl border-1 border-gray-200 p-4 py-2"
          >
            <SuspenseImage
              src={item.imageUrl}
              alt={item.recipeTitle}
              className="h-32 w-32 rounded-md"
            />
            <div className="flex flex-col gap-2">
              <h1 className="text-lg font-bold">{item.recipeTitle}</h1>
              <div className="flex flex-col">
                <p className="text-sm text-slate-500">이 레시피로</p>
                <p className="text-olive-mint text-mm font-semibold">
                  {formatPrice(item.savings)}원을 절약했어요
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarDetailPage;
