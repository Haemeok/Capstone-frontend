import { useForm } from 'react-hook-form';
import { ChefHat, Clock, Tag } from 'lucide-react';
import IngredientSelector from '@/Pages/NewRecipe/IngredientSelector';
import SelectionSection from '@/components/SelectionSection';
import IngredientSection from '@/components/IngredientSection';
import ProgressButton from '@/components/ProgressButton';
import {
  categories,
  cookingTimeItems,
  cookingTimes,
  recommendedTags,
} from '@/mock';
import { useState } from 'react';
import { IngredientPayload } from '@/type/recipe';
import useCreateAIRecipeMutation from '@/hooks/useCreateAIRecipeMutation';
import { AIRecommendedRecipeRequest } from '@/api/recipe';
import LoadingSection from './AIRecipe/LoadingSection';
import { FOUR_CUT_IMAGE } from '@/constants/recipe';

type AIRecipeFormData = AIRecommendedRecipeRequest;

// Define AI model data
const aiModels = [
  {
    id: 'chefBot',
    name: '요리사 로봇',
    image: '/robot.png',
    description: '가장 기본적인 레시피를 추천해 드립니다. 저에게 맡겨주세요!',
  },
  {
    id: 'nutritionBot',
    name: '영양사 로봇',
    image: '/nutrition_robot.png', // Placeholder, replace with actual image path
    description: '균형 잡힌 영양을 고려한 레시피를 전문적으로 추천합니다.',
  },
  {
    id: 'quickBot',
    name: '스피드 로봇',
    image: '/quick_robot.png', // Placeholder, replace with actual image path
    description: '바쁜 현대인을 위한 빠르고 간편한 레시피를 제공합니다.',
  },
  {
    id: 'gourmetBot',
    name: '미식가 로봇',
    image: '/gourmet_robot.png', // Placeholder, replace with actual image path
    description: '특별한 날을 위한 고급스럽고 창의적인 레시피를 제안합니다.',
  },
];

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
      tagNames: [],
    },
    mode: 'onChange',
  });

  const formValues = watch();
  const { ingredients, dishType, cookingTime, tagNames } = formValues;

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

  const toggleTag = (tag: string) => toggle('tagNames', tagNames, tag);

  const totalSteps = 4;
  const completedSteps = [
    ingredients.length > 0,
    dishType.length > 0,
    cookingTime.length > 0,
    tagNames.length > 0,
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

  const { createAIRecipe, isPending } = useCreateAIRecipeMutation();

  if (!selectedAI) {
    return (
      <div className="relative mx-auto flex min-h-screen flex-col items-center justify-center bg-[#f7f7f7] p-4">
        <p className="text-dark mb-8 text-center text-2xl font-semibold">
          레시피를 생성할 AI를 선택해주세요.
        </p>
        <div className="grid grid-cols-2 gap-6">
          {aiModels.map((ai) => (
            <button
              key={ai.id}
              onClick={() => handleSelectAI(ai)}
              className="flex flex-col items-center rounded-2xl border bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <img
                src={ai.image}
                alt={ai.name}
                className="mb-4 h-40 w-40 rounded-full object-cover"
              />
              <p className="text-dark text-lg font-medium">{ai.name}</p>
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

  return (
    <div className="relative mx-auto bg-[#f7f7f7] p-4">
      <div className="text-center">
        <p className="text-dark text-xl font-semibold">
          {selectedAI.name}가 맞춤형 레시피를 추천해드립니다
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 py-4">
        <img
          src={selectedAI.image}
          alt={selectedAI.name}
          className="h-40 w-40 rounded-full object-cover shadow-md"
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
              items={categories}
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

            <SelectionSection
              title="태그"
              icon={<Tag size={18} />}
              items={recommendedTags}
              selectedItems={tagNames}
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
