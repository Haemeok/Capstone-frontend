import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Upload as UploadIcon, Plus, X, ChefHat, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProgressButton from '@/components/ProgressButton';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { useCreateRecipeWithUpload } from '@/hooks/useCreateRecipeWithUpload';
import { RecipeFormValues, IngredientPayload } from '@/type/recipe';
import Steps from '@/Pages/NewRecipe/Steps';
import { useToasts } from '@/hooks/useToasts';
import IngredientSelector from './IngredientSelector';
import { DISH_TYPES } from '@/constants/recipe';
import { cn } from '@/lib/utils';
import CookingToolsInput from './CookingToolsInput';
import RecipeTitleWithImage from './RecipeTitleWithImage';
import Description from './Description';
import IngredientSection from './IngredientSection';
import TagSection from './TagSection';

const NewRecipePage = () => {
  const navigate = useNavigate();
  const {
    mutate: createRecipeWithUpload,
    isUploading,
    isLoading: isCreatingRecipe,
    isSuccess,
    error: recipeCreationError,
    data: createdRecipeData,
  } = useCreateRecipeWithUpload();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [stepImagePreviewUrls, setStepImagePreviewUrls] = useState<
    (string | null)[]
  >([]);

  const { addToast } = useToasts();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<RecipeFormValues>({
    defaultValues: {
      title: '',
      imageFile: null,
      ingredients: [],
      cookingTime: undefined,
      servings: 0, // 0을 기본값으로 설정 (선택 안 함 상태)
      dishType: '',
      description: '',
      steps: [
        {
          instruction: '',
          stepNumber: 1,
          imageFile: null,
          ingredients: [],
        },
      ],
      cookingTools: [],
      tagNames: [], // 태그 기본값
    },
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<RecipeFormValues> = (formData) => {
    console.log('폼 데이터:', formData);

    createRecipeWithUpload(formData, {
      onSuccess: (createdData) => {
        console.log('레시피 생성 성공:', createdData);
        addToast({
          message: '레시피가 성공적으로 등록되었습니다!',
          variant: 'success',
        });
        reset();
        setImagePreviewUrl(null);
        setStepImagePreviewUrls([]);
        navigate('/recipes');
      },
      onError: (error) => {
        console.error('레시피 생성 실패:', error);
        addToast({
          message: `레시피 등록 중 오류가 발생했습니다: ${error.message}`,
          variant: 'error',
        });
      },
    });
  };

  const formValues = watch();

  const needSteps = [
    formValues.title.trim() !== '',
    formValues.imageFile !== null,
    formValues.description.trim() !== '',
    formValues.dishType.trim() !== '',
    (parseInt(String(formValues.cookingTime), 10) || 0) > 0,
    (parseInt(String(formValues.servings), 10) || 0) > 0,
    formValues.ingredients.some(
      (i: IngredientPayload) =>
        i.name?.trim() !== '' && i.quantity?.toString().trim() !== '',
    ),
    formValues.steps.some((s) => s.instruction?.trim() !== ''),
  ];

  const completedSteps = needSteps.filter(Boolean).length;
  const totalSteps = needSteps.length;
  const progressPercentage =
    totalSteps > 0 ? Math.floor((completedSteps / totalSteps) * 100) : 0;

  const isLoading = isUploading || isCreatingRecipe;
  const submitError = recipeCreationError;

  console.log(errors, isValid, isDirty);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <form id="recipe-form" onSubmit={handleSubmit(onSubmit)}>
        <RecipeTitleWithImage
          imagePreviewUrl={imagePreviewUrl}
          errors={errors}
          register={register}
          watch={watch}
          currentTitle={formValues.title}
          setImagePreviewUrl={setImagePreviewUrl}
        />

        <div className="mx-auto max-w-3xl px-4 pt-6">
          <Description register={register} errors={errors} />

          <div className="flex items-center justify-center gap-x-8 gap-y-6 border-b border-gray-200">
            <div className="flex flex-col items-center gap-2">
              <label
                htmlFor="dishType"
                className="text-sm font-medium text-gray-700"
              >
                카테고리
              </label>
              <select
                id="dishType"
                className={cn(
                  `w-28 rounded-lg border bg-gray-50 px-3 py-1.5 text-sm text-gray-900 transition-colors duration-150 ease-in-out focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none`,
                  errors.dishType ? 'border-red-500' : 'border-gray-300',
                )}
                {...register('dishType', {
                  required: '카테고리를 선택해주세요',
                })}
                defaultValue=""
              >
                <option value="" disabled>
                  선택
                </option>
                {DISH_TYPES.map((dishType) => (
                  <option key={dishType} value={dishType}>
                    {dishType}
                  </option>
                ))}
              </select>
              {errors.dishType && (
                <p className="mt-1 text-center text-xs text-red-500">
                  {errors.dishType.message}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center gap-2">
              <label
                htmlFor="cookingTime"
                className="text-sm font-medium text-gray-700"
              >
                조리시간 (분)
              </label>
              <input
                id="cookingTime"
                type="number"
                className={cn(
                  `w-20 rounded-lg border bg-gray-50 px-3 py-1.5 text-center text-sm text-gray-900 transition-colors duration-150 ease-in-out focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none`,
                  errors.cookingTime ? 'border-red-500' : 'border-gray-300',
                )}
                placeholder="숫자"
                min="0"
                {...register('cookingTime', {
                  required: '조리 시간을 입력해주세요',
                  valueAsNumber: true,
                  min: { value: 1, message: '1분 이상 입력해주세요.' },
                })}
              />
              {errors.cookingTime && (
                <p className="mt-1 text-center text-xs text-red-500">
                  {errors.cookingTime.message}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center gap-2">
              <label
                htmlFor="servings"
                className="text-sm font-medium text-gray-700"
              >
                인분
              </label>
              <input
                id="servings"
                type="number"
                className={cn(
                  'w-20 rounded-lg border bg-gray-50 px-3 py-1.5 text-center text-sm text-gray-900 transition-colors duration-150 ease-in-out focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none',
                  errors.servings
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300',
                )}
                {...register('servings', {
                  required: '인분을 선택해주세요',
                  valueAsNumber: true,
                  validate: (value) =>
                    Number(value) > 0 || '1인분 이상 선택해주세요.',
                })}
                min="1"
                placeholder="숫자"
                defaultValue={1}
              />
              {errors.servings && (
                <p className="mt-1 text-center text-xs text-red-500">
                  {errors.servings.message}
                </p>
              )}
            </div>
          </div>

          <IngredientSection
            control={control}
            errors={errors}
            register={register}
          />
          <Steps
            watch={watch}
            register={register}
            errors={errors}
            setValue={setValue}
            control={control}
            stepImagePreviewUrls={stepImagePreviewUrls}
            setStepImagePreviewUrls={setStepImagePreviewUrls}
          />
          <CookingToolsInput watch={watch} setValue={setValue} />
          <TagSection
            watch={watch}
            setValue={setValue}
            tagNames={formValues.tagNames}
          />
          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            {submitError && (
              <p className="text-sm text-red-600">
                오류: {submitError.message}
              </p>
            )}
            <ProgressButton
              progressPercentage={progressPercentage}
              isFormValid={isValid && isDirty}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewRecipePage;
