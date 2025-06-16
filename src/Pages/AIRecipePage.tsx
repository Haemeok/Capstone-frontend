import { useForm } from 'react-hook-form';
import { ChefHat, Clock, Tag, User } from 'lucide-react';
import IngredientSelector from '@/Pages/NewRecipe/IngredientSelector';
import SelectionSection from '@/components/SelectionSection';
import IngredientSection from '@/components/IngredientSection';
import ProgressButton from '@/components/ProgressButton';
import { cookingTimes } from '@/mock';
import { useRef, useState } from 'react';
import { IngredientPayload } from '@/type/recipe';
import useCreateAIRecipeMutation from '@/hooks/useCreateAIRecipeMutation';
import { AIRecommendedRecipeRequest } from '@/api/recipe';
import LoadingSection from './AIRecipe/LoadingSection';
import { aiModels, DISH_TYPES, FOUR_CUT_IMAGE } from '@/constants/recipe';
import AIRecipeDisplay from './AIRecipe/AIRecipeDisplay';
import SuspenseImage from '@/components/Image/SuspenseImage';

type AIRecipeFormData = AIRecommendedRecipeRequest;

interface AIModel {
  id: string;
  name: string;
  image: string;
  description: string;
}

const AIRecipePage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAI, setSelectedAI] = useState<AIModel | null>(null);
  const [addedIngredientIds, setAddedIngredientIds] = useState<Set<number>>(
    new Set(),
  );
  const observerRef = useRef<HTMLDivElement>(null);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isValid, isDirty },
  } = useForm<AIRecipeFormData>({
    defaultValues: {
      ingredients: [],
      dishType: '',
      cookingTime: '',
      servings: 2,
    },
    mode: 'onChange',
  });

  const formValues = watch();
  const { ingredients, dishType, cookingTime, servings } = formValues;

  const handleAddIngredient = (ingredientPayload: IngredientPayload) => {
    const newIngredients = [...ingredients, ingredientPayload.name];
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

  const handleIncrementServings = () => {
    setValue('servings', servings + 1, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleDecrementServings = () => {
    if (servings > 1) {
      setValue('servings', servings - 1, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
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

  const radioToggle = <T,>(fieldName: keyof AIRecipeFormData, item: T) => {
    setValue(fieldName as any, item, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const toggleCategory = (category: string) =>
    radioToggle('dishType', category);

  const toggleTime = (cookingTime: string) =>
    radioToggle('cookingTime', cookingTime);

  const totalSteps = 4;
  const completedSteps = [
    ingredients.length > 0,
    dishType.length > 0,
    cookingTime.length > 0,
    servings > 0,
  ].filter(Boolean).length;

  const progressPercentage = Math.floor((completedSteps / totalSteps) * 100);
  const isFormReady = completedSteps === totalSteps;

  const onSubmit = (data: AIRecipeFormData) => {
    createAIRecipe(data, {
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  const handleSelectAI = (ai: AIModel) => {
    setSelectedAI(ai);
  };

  const {
    createAIRecipe,
    isPending,
    isSuccess,
    data: createdRecipe,
  } = useCreateAIRecipeMutation();

  if (!selectedAI) {
    return (
      <div className="mx-auto flex h-full flex-col items-center justify-center gap-4 bg-[#f7f7f7] p-4">
        <p className="text-dark text-center text-2xl font-semibold">
          레시피를 생성할 AI를 선택해주세요.
        </p>
        <div className="grid grid-cols-2 gap-6">
          {aiModels.map((ai) => (
            <button
              key={ai.id}
              onClick={() => handleSelectAI(ai)}
              className="flex flex-col items-center rounded-2xl border bg-white px-4 py-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <SuspenseImage
                src={ai.image}
                alt={ai.name}
                className="mb-4 h-48 w-full rounded-2xl object-cover"
              />
              <p className="text-dark text-lg font-medium">{ai.name}</p>
              <p className="mt-2 text-center text-sm text-gray-600">
                {ai.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <LoadingSection
        name={selectedAI.name}
        robotImage={selectedAI.image}
        fourCutImage={FOUR_CUT_IMAGE}
      />
    );
  }

  if (isSuccess && createdRecipe) {
    return <AIRecipeDisplay createdRecipe={createdRecipe} />;
  }
  console.log(createdRecipe);
  return (
    <div className="relative mx-auto bg-[#f7f7f7] p-4">
      <div className="text-center">
        <p className="text-dark text-xl font-semibold">
          {selectedAI.name}와 함께
        </p>
        <p className="text-dark text-xl font-semibold">
          맞춤형 레시피를 생성해보세요 !
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 py-4">
        <SuspenseImage
          src={selectedAI.image}
          alt={selectedAI.name}
          className="h-80 w-full rounded-2xl object-cover shadow-md"
        />
        <p className="mt-2 text-center text-sm text-gray-600">
          {selectedAI.description}
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
              title="종류"
              icon={<ChefHat size={18} />}
              items={DISH_TYPES}
              selectedItems={dishType}
              onToggle={toggleCategory}
              isSingleSelect={true}
            />

            <SelectionSection
              title="조리시간"
              icon={<Clock size={18} />}
              items={cookingTimes}
              selectedItems={cookingTime ? cookingTime.toString() : ''}
              onToggle={toggleTime}
              isSingleSelect={true}
            />
            <div ref={observerRef} className="h-1 w-full" />
            <div className="mb-3 flex items-center gap-2">
              <span className="text-olive-mint">
                <User size={18} />
              </span>
              <h2 className="text-lg font-semibold text-gray-800">인분</h2>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleDecrementServings}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-lg text-gray-600 transition-colors hover:bg-gray-300 disabled:opacity-50"
                disabled={servings <= 1}
              >
                -
              </button>
              <span className="w-20 text-center font-medium text-gray-800">
                {servings}인분
              </span>
              <button
                type="button"
                onClick={handleIncrementServings}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-lg text-gray-600 transition-colors hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <ProgressButton
          progressPercentage={progressPercentage}
          isFormValid={isFormReady && isDirty}
          onClick={handleSubmit(onSubmit)}
        />
      </form>

      <IngredientSelector
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onIngredientSelect={handleAddIngredient}
        addedIngredientIds={addedIngredientIds}
        setAddedIngredientIds={setAddedIngredientIds}
      />
    </div>
  );
};

export default AIRecipePage;
