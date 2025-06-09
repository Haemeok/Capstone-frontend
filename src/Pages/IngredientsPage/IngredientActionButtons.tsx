import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

type IngredientActionButtonsProps = {
  isDeleteMode: boolean;
  setIsDeleteMode: (isDeleteMode: boolean) => void;
  handleDeleteIngredientBulk: () => void;
};

const IngredientActionButtons = ({
  isDeleteMode,
  setIsDeleteMode,
  handleDeleteIngredientBulk,
}: IngredientActionButtonsProps) => {
  const navigate = useNavigate();
  const handleDeleteButtonClick = () => {
    if (isDeleteMode) {
      handleDeleteIngredientBulk();
    }
    setIsDeleteMode(!isDeleteMode);
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={handleDeleteButtonClick}>
        {isDeleteMode ? '완료' : '재료 삭제'}
      </Button>
      <Button variant="outline" onClick={() => navigate('/ingredients/new')}>
        재료 추가
      </Button>
    </div>
  );
};

export default IngredientActionButtons;
