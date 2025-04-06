import { useForm } from "react-hook-form";
import { ChefHat, Clock, Tag } from "lucide-react";
import IngredientsDrawer from "@/components/Modal/IngredientsDrawer";
import SelectionSection from "@/components/SelectionSection";
import IngredientSection from "@/components/IngredientSection";
import ProgressButton from "@/components/ProgressButton";
import { categories, cookingTimes, recommendedTags } from "@/mock";
import { useState } from "react";

// 폼 타입 정의
interface AIRecipeFormData {
  ingredients: string[];
  selectedCategories: string[];
  selectedTimes: string[];
  selectedTags: string[];
}

const AIRecipePage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // react-hook-form 설정
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isValid, isDirty },
  } = useForm<AIRecipeFormData>({
    defaultValues: {
      ingredients: [],
      selectedCategories: [],
      selectedTimes: [],
      selectedTags: [],
    },
    mode: "onChange",
  });

  // watch로 폼 값 구독
  const formValues = watch();
  const { ingredients, selectedCategories, selectedTimes, selectedTags } =
    formValues;

  // 재료 관련 핸들러
  const handleAddIngredient = (ingredient: string) => {
    const newIngredients = [...ingredients, ingredient];
    setValue("ingredients", newIngredients, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setValue("ingredients", newIngredients, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleRemoveAllIngredients = () => {
    setValue("ingredients", [], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // 토글 핸들러 함수
  const toggle = <T,>(
    fieldName: keyof AIRecipeFormData,
    currentItems: T[],
    item: T
  ) => {
    let newItems: T[];
    if (currentItems.includes(item)) {
      newItems = currentItems.filter((i) => i !== item);
    } else {
      newItems = [...currentItems, item];
    }

    setValue(fieldName as any, newItems, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // 항목 토글 핸들러
  const toggleCategory = (category: string) =>
    toggle("selectedCategories", selectedCategories, category);

  const toggleTime = (time: string) =>
    toggle("selectedTimes", selectedTimes, time);

  const toggleTag = (tag: string) => toggle("selectedTags", selectedTags, tag);

  // 진행 상태 계산
  const totalSteps = 4;
  const completedSteps = [
    ingredients.length > 0,
    selectedCategories.length > 0,
    selectedTimes.length > 0,
    selectedTags.length > 0,
  ].filter(Boolean).length;

  const progressPercentage = Math.floor((completedSteps / totalSteps) * 100);
  const isFormReady = completedSteps === totalSteps;

  // 폼 제출 핸들러
  const onSubmit = (data: AIRecipeFormData) => {
    if (isFormReady) {
      console.log("레시피 생성 요청", data);
      // API 호출 또는 다른 작업 수행
    }
  };

  return (
    <>
      <div className="text-center">
        <p className="text-gray-600">
          나만의 맞춤형 레시피를 AI가 추천해드립니다
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <IngredientSection
            ingredients={ingredients}
            onRemoveIngredient={handleRemoveIngredient}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onRemoveAllIngredients={handleRemoveAllIngredients}
          />

          <div className="space-y-6">
            <SelectionSection
              title="태그"
              icon={<ChefHat size={18} />}
              items={categories}
              selectedItems={selectedCategories}
              onToggle={toggleCategory}
            />

            <SelectionSection
              title="조리시간"
              icon={<Clock size={18} />}
              items={cookingTimes}
              selectedItems={selectedTimes}
              onToggle={toggleTime}
            />

            <SelectionSection
              title="태그"
              icon={<Tag size={18} />}
              items={recommendedTags}
              selectedItems={selectedTags}
              onToggle={toggleTag}
              className="border-b-0"
            />
          </div>
        </div>

        <ProgressButton
          progressPercentage={progressPercentage}
          isFormValid={isFormReady && isDirty}
          completedSteps={completedSteps}
          totalSteps={totalSteps}
          onClick={handleSubmit(onSubmit)}
        />
      </form>

      <IngredientsDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        ingredients={ingredients}
        onAddIngredient={handleAddIngredient}
        onRemoveIngredient={handleRemoveIngredient}
        onRemoveAllIngredients={handleRemoveAllIngredients}
      />
    </>
  );
};

export default AIRecipePage;
