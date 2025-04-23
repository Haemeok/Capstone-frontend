import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Upload as UploadIcon, Plus, X, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProgressButton from '@/components/ProgressButton';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { useCreateRecipeWithUpload } from '@/hooks/useCreateRecipeWithUpload';
import { RecipeFormValues, IngredientPayload } from '@/type/recipe';
import Steps from '@/Pages/NewRecipe/Steps';
import { useToasts } from '@/hooks/useToasts';
import IngredientSelector from './IngredientSelector';

const NewRecipePage = () => {
  const navigate = useNavigate();
  const {
    mutate: createRecipeWithUpload,
    isUploading,
    isLoading: isCreatingRecipe,
    isSuccess,
    error: recipeCreationError,
    uploadError,
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
      ingredients: [{ quantity: '', name: '', unit: '' }],
      cookingTime: undefined,
      servings: undefined,
      dishType: '',
      description: '',
      steps: [
        {
          instruction: '',
          stepNumber: 1,
          stepImageFile: null,
          ingredients: [],
        },
      ],
      cookingTools: [],
      tagNames: [],
      youtubeUrl: '',
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

  // const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setValue('imageFile', file, { shouldValidate: true, shouldDirty: true });
  //     const reader = new FileReader();
  //     reader.onloadend = () => setImagePreviewUrl(reader.result as string);
  //     reader.readAsDataURL(file);
  //   } else {
  //     setValue('imageFile', null, { shouldValidate: true });
  //     setImagePreviewUrl(null);
  //   }
  //   e.target.value = '';
  // };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setValue('description', e.target.value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const addIngredient = (ingredient: IngredientPayload) => {
    appendIngredient({
      name: ingredient.name,
      quantity: '',
      unit: ingredient.unit,
    });
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
    !!formValues.cookingTime,
    !!formValues.servings,
    formValues.ingredients.some(
      (i: IngredientPayload) => i.name?.trim() !== '',
    ),
    formValues.steps.some((s) => s.instruction?.trim() !== ''),
  ];

  const completedSteps = needSteps.filter(Boolean).length;
  const totalSteps = needSteps.length;
  const progressPercentage =
    totalSteps > 0 ? Math.floor((completedSteps / totalSteps) * 100) : 0;

  const isLoading = isUploading || isCreatingRecipe;
  const submitError = uploadError || recipeCreationError;
  console.log('Current form errors:', errors);

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
              className="h-24 w-full text-[#777777] focus:outline-none"
              placeholder="레시피에 대한 간단한 설명을 작성하세요. 어떤 특징이 있는지, 어떤 상황에서 먹기 좋은지 등을 알려주세요."
              onChange={handleDescriptionChange}
            />
          </div>

          <div className="mb-4 flex justify-center gap-4 border-b border-[#00473c]/20 py-4">
            <div className="flex flex-1 flex-col">
              <div className="flex h-10 items-center justify-center gap-2 text-center">
                <p className="mb-1 text-[#777777]">카테고리</p>
                <select
                  className={`w-20 rounded-md border-1 border-gray-300 bg-transparent ${
                    errors.dishType ? 'border-red-500' : 'border-[#00473c]/30'
                  } pb-1 text-center focus:outline-none`}
                  {...register('dishType', {
                    required: '카테고리를 선택해주세요',
                  })}
                >
                  <option value="" className="">
                    선택하기
                  </option>
                  <option value="korean" className="">
                    한식
                  </option>
                  <option value="western" className="">
                    양식
                  </option>
                  <option value="japanese" className="">
                    일식
                  </option>
                  <option value="chinese" className="">
                    중식
                  </option>
                  <option value="dessert" className="">
                    디저트
                  </option>
                </select>
              </div>
              {errors.dishType && (
                <p className="mt-1 text-center text-xs text-red-300">
                  {errors.dishType.message}
                </p>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex h-10 items-center justify-center gap-2 text-center">
                <p className="mb-1 text-[#777777]">조리시간</p>
                <div className="relative">
                  <input
                    type="text"
                    className={`w-20 border-b bg-transparent ${
                      errors.cookingTime
                        ? 'border-red-500'
                        : 'border-[#00473c]/30'
                    } pb-1 text-center focus:border-[#00473c] focus:outline-none`}
                    placeholder="30"
                    {...register('cookingTime', {
                      required: '조리 시간을 입력해주세요',
                      pattern: {
                        value: /^\d+$/,
                        message: '숫자만 입력 가능합니다',
                      },
                    })}
                  />
                  <span className="ml-1 text-sm">분</span>
                </div>
              </div>
              {errors.cookingTime && (
                <p className="mt-1 text-center text-xs text-red-300">
                  {errors.cookingTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex h-20 items-center justify-between py-4">
              <h2 className="text-2xl font-semibold text-gray-700">재료</h2>
              <div className="flex flex-col">
                <div className="flex h-full w-40 items-center justify-center gap-2 text-center">
                  <select
                    className={`border-b bg-transparent ${
                      errors.servings ? 'border-red-500' : 'border-[#00473c]/30'
                    } pb-1 text-center focus:border-[#00473c] focus:outline-none`}
                    {...register('servings', {
                      required: '인분을 선택해주세요',
                      valueAsNumber: true,
                    })}
                  >
                    <option value="0" className="bg-[#f4f3e7]">
                      선택하기
                    </option>
                    <option value="1" className="bg-[#f4f3e7]">
                      1
                    </option>
                    <option value="2" className="bg-[#f4f3e7]">
                      2
                    </option>
                    <option value="3" className="bg-[#f4f3e7]">
                      3
                    </option>
                  </select>
                  <p className="mb-1 text-[#777777]">인분</p>
                </div>
                {errors.servings && (
                  <p className="mt-1 text-center text-xs text-red-300">
                    {errors.servings.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {ingredientFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <ChefHat size={20} className="text-green-600" />
                  </div>

                  <div className="flex flex-1 items-center justify-between gap-2">
                    <p>{field.name}</p>

                    <div className="flex gap-1">
                      <input
                        type="number"
                        className={`w-20 rounded border border-gray-300 px-2 py-1 text-center focus:border-green-500 focus:outline-none ${
                          errors.ingredients?.[index]?.quantity
                            ? 'border-red-500'
                            : ''
                        }`}
                        placeholder="수량"
                        {...register(`ingredients.${index}.quantity`, {
                          valueAsNumber: true,
                          min: { value: 0, message: '0 이상 입력' },
                        })}
                      />
                      {errors.ingredients?.[index]?.quantity && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.ingredients[index]?.quantity?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-red-500"
                      onClick={() =>
                        ingredientFields.length > 1 && removeIngredient(index)
                      }
                      disabled={ingredientFields.length <= 1}
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
              className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border-2 border-dashed border-green-300 py-2 text-green-600 hover:border-green-500 hover:bg-green-50"
              onClick={() => setIsOpen(true)}
            >
              <Plus size={16} />
              재료 추가
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
