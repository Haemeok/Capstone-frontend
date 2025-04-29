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

// 추가: 선택 가능한 태그 목록
const TAG_OPTIONS = [
  '한식',
  '양식',
  '일식',
  '중식',
  '간단',
  '자취',
  '집밥',
  '비건',
  '저탄고지',
  '다이어트',
  '간식',
  '야식',
];

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
  const [isOpen, setIsOpen] = useState(false);

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

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const addIngredient = (ingredient: IngredientPayload) => {
    appendIngredient({
      name: ingredient.name,
      quantity: '',
      unit: ingredient.unit,
    });
  };

  // 추가: 태그 선택/해제 핸들러
  const handleTagToggle = (tag: string) => {
    const currentTags = watch('tagNames') || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag) // 선택 해제
      : [...currentTags, tag]; // 선택 추가
    setValue('tagNames', newTags, { shouldDirty: true, shouldValidate: true });
  };

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

  const imageFileValue = watch('imageFile');

  // imageFileValue가 변경될 때 미리보기 업데이트
  useEffect(() => {
    const fileList = imageFileValue;
    console.log('imageFileValue (should be FileList):', fileList);

    // FileList의 첫 번째 항목을 가져옵니다. 파일이 없으면 undefined가 됩니다.
    const actualFile = fileList?.[0]; // Optional chaining 사용
    console.log('Extracted file (should be File or undefined):', actualFile);

    // 실제 File 객체인지 확인합니다.
    if (actualFile instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      // 추출한 실제 파일(actualFile)을 사용합니다.
      reader.readAsDataURL(actualFile);
    } else {
      // 파일이 없거나 유효하지 않은 경우 미리보기 제거
      setImagePreviewUrl(null);
    }
    // imageFileValue (FileList)가 변경될 때마다 이 effect 실행
  }, [imageFileValue]);

  console.log(errors, isValid, isDirty);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <form id="recipe-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative">
          <div className="relative flex h-[40vh] w-full cursor-pointer items-center justify-center border-b bg-gray-200 text-gray-400 hover:bg-gray-300">
            <label
              htmlFor="imageFile-input"
              className="absolute inset-0 cursor-pointer"
            >
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt="Recipe thumbnail"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <UploadIcon size={48} className="mb-3" />
                  <p>레시피 대표 이미지 업로드</p>
                  {errors.imageFile && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.imageFile.message || '이미지 파일은 필수입니다.'}
                    </p>
                  )}
                </div>
              )}
            </label>
            <input
              type="file"
              id="imageFile-input"
              className="hidden"
              accept="image/*"
              {...register('imageFile', {
                required: '대표 이미지를 등록해주세요.',
              })}
            />
          </div>

          <div className="absolute right-0 bottom-0 left-0 flex h-32 flex-col justify-center bg-gradient-to-t from-black/80 to-transparent p-4 pb-8">
            <div className="flex w-7/8 max-w-7/8 items-center justify-between">
              <input
                type="text"
                className={`border-b bg-transparent pb-2 text-4xl font-bold text-white ${
                  errors.title ? 'border-red-500' : 'border-white/30'
                } focus:border-white focus:outline-none`}
                placeholder="레시피 이름"
                {...register('title', {
                  required: '레시피 이름은 필수입니다',
                })}
              />
              <p className="text-sm text-white">{formValues.title.length}/20</p>
            </div>
            {errors.title && (
              <p className="mt-1 text-xs text-red-300">
                {errors.title.message}
              </p>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 pt-6">
          <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
            <textarea
              className="h-24 w-full resize-none text-[#777777] focus:outline-none"
              placeholder="레시피에 대한 간단한 설명을 작성하세요. 어떤 특징이 있는지, 어떤 상황에서 먹기 좋은지 등을 알려주세요."
              {...register('description', {
                required: '레시피 설명을 입력해주세요.',
              })}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center gap-x-8 gap-y-6 border-b border-gray-200">
            {/* 카테고리 섹션 - 세로 배치로 수정 */}
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

            {/* 조리시간 섹션 - 세로 배치로 수정 */}
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

            {/* 인분 섹션 (기존 세로 배치 유지) */}
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

          <div className="mb-4">
            <div className="flex h-16 items-center justify-between border-b border-gray-200 pb-2">
              <h2 className="text-xl font-semibold text-gray-700">재료</h2>
            </div>

            <div className="space-y-3 pt-4">
              {ingredientFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100">
                    <ChefHat size={20} className="text-green-600" />
                  </div>

                  <div className="flex flex-1 items-center justify-between gap-2">
                    <p className="flex-1 font-medium text-gray-800">
                      {field.name}
                    </p>

                    <div className="flex flex-shrink-0 items-center gap-1">
                      <input
                        type="text"
                        className={`w-24 rounded border border-gray-300 px-2 py-1 text-right focus:border-green-500 focus:outline-none ${errors.ingredients?.[index]?.quantity ? 'border-red-500' : ''}`}
                        placeholder="예: 100g, 1개, 약간"
                        {...register(`ingredients.${index}.quantity`, {
                          required: '수량/단위를 입력해주세요.',
                        })}
                      />
                      {errors.ingredients?.[index]?.quantity && (
                        <p className="absolute bottom-[-1rem] text-xs text-red-500">
                          {errors.ingredients[index]?.quantity?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => removeIngredient(index)}
                    >
                      <X size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border-2 border-dashed border-green-300 py-3 text-green-600 hover:border-green-500 hover:bg-green-50"
              onClick={() => setIsOpen(true)}
            >
              <Plus size={16} />
              재료 추가하기
            </Button>
          </div>
          <IngredientSelector
            open={isOpen}
            onOpenChange={setIsOpen}
            onIngredientSelect={addIngredient}
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

          <div className="mt-6 mb-4">
            <h2 className="mb-3 text-xl font-semibold text-gray-700">태그</h2>
            <div className="flex flex-wrap gap-2 rounded-xl bg-white p-4 shadow-sm">
              {TAG_OPTIONS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    formValues.tagNames?.includes(tag)
                      ? 'border-green-500 bg-green-100 text-green-700'
                      : 'border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

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
