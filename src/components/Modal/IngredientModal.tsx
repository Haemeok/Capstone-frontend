import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type IngredientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  ingredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (index: number) => void;
};

const IngredientModal = ({
  isOpen,
  onClose,
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
}: IngredientModalProps) => {
  const [newIngredient, setNewIngredient] = useState('');

  if (!isOpen) return null;

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      onAddIngredient(newIngredient.trim());
      setNewIngredient('');
    }
  };

  return (
    <div className="bg-opacity-70 fixed inset-0 z-50 flex items-start justify-center bg-black pt-4">
      <div className="max-h-[95vh] w-full overflow-y-auto rounded-t-lg bg-white">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">재료 추가</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={18} />
            </Button>
          </div>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="재료명 입력"
              className="flex-1 rounded-lg border p-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddIngredient();
                }
              }}
            />
            <Button onClick={handleAddIngredient}>추가</Button>
          </div>

          <div className="mt-4">
            <h3 className="mb-2 font-semibold">현재 재료</h3>
            {ingredients.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1"
                  >
                    <span>{ingredient}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0"
                      onClick={() => onRemoveIngredient(index)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">추가된 재료가 없습니다.</p>
            )}
          </div>

          <Button className="mt-6 w-full" onClick={onClose}>
            완료
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IngredientModal;
