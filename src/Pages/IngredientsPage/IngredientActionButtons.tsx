import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

type IngredientActionButtonsProps = {
  isDeleteMode: boolean;
  setIsDeleteMode: (isDeleteMode: boolean) => void;
};

const IngredientActionButtons = ({
  isDeleteMode,
  setIsDeleteMode,
}: IngredientActionButtonsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={() => setIsDeleteMode(!isDeleteMode)}>
        {isDeleteMode ? '완료' : '재료 삭제'}
      </Button>
      <Button variant="outline" onClick={() => navigate('/ingredients/new')}>
        재료 추가
      </Button>
    </div>
  );
};

export default IngredientActionButtons;
