import { useForm } from 'react-hook-form';
import { ChefHat, Clock, Tag } from 'lucide-react';
import IngredientsDrawer from '@/components/Modal/IngredientsDrawer';
import SelectionSection from '@/components/SelectionSection';
import IngredientSection from '@/components/IngredientSection';
import ProgressButton from '@/components/ProgressButton';
import { categories, cookingTimes, recommendedTags } from '@/mock';
import { useState } from 'react';

interface AIRecipeFormData {
  ingredients: string[];
  selectedCategories: string[];
  selectedTimes: string[];
  selectedTags: string[];
}

const AIRecipePage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    mode: 'onChange',
  });

  const formValues = watch();
  const { ingredients, selectedCategories, selectedTimes, selectedTags } =
    formValues;

  const handleAddIngredient = (ingredient: string) => {
    const newIngredients = [...ingredients, ingredient];
    setValue('ingredients', newIngredients, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setValue('ingredients', newIngredients, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleRemoveAllIngredients = () => {
    setValue('ingredients', [], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const toggle = <T,>(
    fieldName: keyof AIRecipeFormData,
    currentItems: T[],
    item: T,
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

  const toggleCategory = (category: string) =>
    toggle('selectedCategories', selectedCategories, category);

  const toggleTime = (time: string) =>
    toggle('selectedTimes', selectedTimes, time);

  const toggleTag = (tag: string) => toggle('selectedTags', selectedTags, tag);

  const totalSteps = 4;
  const completedSteps = [
    ingredients.length > 0,
    selectedCategories.length > 0,
    selectedTimes.length > 0,
    selectedTags.length > 0,
  ].filter(Boolean).length;

  const progressPercentage = Math.floor((completedSteps / totalSteps) * 100);
  const isFormReady = completedSteps === totalSteps;

  const onSubmit = (data: AIRecipeFormData) => {
    if (isFormReady) {
      console.log('레시피 생성 요청', data);
    }
  };

  return (
    <div className="relative mx-auto bg-[#f7f7f7] p-4">
      <div className="text-center">
        <p className="text-dark text-2xl font-semibold">
          나만의 맞춤형 레시피를 AI가 추천해드립니다
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <img src="/robot.png" alt="robot" className="h-30 w-30" />
        <p className="text-sm text-gray-500">
          이런 음식을 주로 잘 만듭니다. 맡겨주세요
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
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
    </div>
  );
};

export default AIRecipePage;
