import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
  const [newIngredient, setNewIngredient] = useState("");

  if (!isOpen) return null;

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      onAddIngredient(newIngredient.trim());
      setNewIngredient("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-start justify-center pt-4 z-50">
      <div className="bg-white rounded-t-lg w-full max-h-[95vh] overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">재료 추가</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={18} />
            </Button>
          </div>

          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="재료명 입력"
              className="flex-1 p-2 border rounded-lg"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddIngredient();
                }
              }}
            />
            <Button onClick={handleAddIngredient}>추가</Button>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">현재 재료</h3>
            {ingredients.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"
                  >
                    <span>{ingredient}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto"
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

          <Button className="w-full mt-6" onClick={onClose}>
            완료
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IngredientModal;
