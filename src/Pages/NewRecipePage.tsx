import React, { useRef } from 'react';
import { useNavigate } from 'react-router';
import { Upload as UploadIcon, Plus, X, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProgressButton from '@/components/ProgressButton';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';

import useCreateRecipeMutation from '@/hooks/useCreateRecipeMutation';
import { Ingredient, Recipe, RecipeStep } from '@/type/recipe';

const NewRecipePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createRecipe = useCreateRecipeMutation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<Recipe>({
    defaultValues: {
      title: '',
      imageURL: '',
      ingredients: [{ quantity: '', name: '', unit: '' }],
      cookingTime: undefined,
      servings: undefined,
      dishType: '',
      description: '',
      steps: [
        {
          ingredients: [{ quantity: '', name: '', unit: '' }],
          instruction: '',
          stepImageUrl: '',
          stepNumber: 0,
        },
      ],
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

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: 'steps',
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setValue('imageURL', e.target.result as string, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setValue('description', e.target.value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const addIngredient = () => {
    appendIngredient({ name: '', quantity: '', unit: '' });
  };

  const addStep = () => {
    appendStep({ instruction: '', stepImageUrl: '', stepNumber: 0 });
  };

  const onSubmit: SubmitHandler<Recipe> = (data) => {
    console.log('제출 데이터:', data);

    const filteredData = {
      ...data,
      imageURL: '123',
      ingredients: data.ingredients.filter((i) => i.name.trim() !== ''),
      steps: data.steps.filter((s) => s.instruction.trim() !== ''),
      tagNames: ['비건', '건강한', '간편한', '영양가있는'],
    };

    console.log('정제된 제출 데이터:', filteredData);

    createRecipe.mutate(filteredData);

    navigate('/recipes');
  };

  const formValues = watch();

  const needSteps = [
    formValues.title.trim() !== '',
    formValues.imageURL !== '',
    formValues.description !== '',
    formValues.dishType !== '',
    formValues.cookingTime !== '',
    formValues.servings !== 0,
    formValues.ingredients.some((i: Ingredient) => i.name.trim() !== ''),
    formValues.steps.some((s: RecipeStep) => s.instruction.trim() !== ''),
  ];

  const completedSteps = needSteps.filter(Boolean).length;
  const totalSteps = needSteps.length;
  const progressPercentage = Math.floor((completedSteps / totalSteps) * 100);

  return (
    <div className="min-h-screen">
      <form id="recipe-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative">
          <div
            className="relative flex h-[40vh] w-full cursor-pointer items-center justify-center"
            onClick={() => fileInputRef.current?.click()}
          >
            {formValues.imageURL ? (
              <img
                src={formValues.imageURL}
                alt="Recipe thumbnail"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-center">
                <UploadIcon size={48} className="mx-auto mb-3 text-[#58C16A]" />
                <p className="text-[#58C16A]">이미지를 업로드해주세요</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleThumbnailChange}
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
                  className="flex items-center justify-between gap-3 rounded-lg border-b border-[#00473c]/10 bg-white p-3 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#58C16A]/10">
                    <ChefHat size={20} className="text-[#58C16A]" />
                  </div>

                  <div className="flex flex-1 justify-between gap-2">
                    <input
                      type="text"
                      className={`w-20 bg-transparent ${
                        errors.ingredients?.[index]?.name
                          ? 'border-red-500'
                          : 'border-[#00473c]/10'
                      } border-b focus:outline-none`}
                      placeholder="재료명"
                      {...register(`ingredients.${index}.name`, {
                        required: index === 0 ? '재료명은 필수입니다' : false,
                      })}
                    />
                    <div className="flex gap-1">
                      <input
                        type="text"
                        className="w-16 border-b border-[#00473c]/10 bg-transparent text-center focus:border-[#00473c] focus:outline-none"
                        placeholder="수량"
                        {...register(`ingredients.${index}.quantity`)}
                      />
                      <input
                        type="text"
                        className="w-16 border-b border-[#00473c]/10 bg-transparent text-center focus:border-[#00473c] focus:outline-none"
                        placeholder="단위"
                        {...register(`ingredients.${index}.unit`)}
                      />
                    </div>
                    {errors.ingredients?.[index]?.name && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.ingredients[index]?.name?.message}
                      </p>
                    )}
                  </div>
                  <div className="">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-[#777777] hover:text-red-500"
                      onClick={() =>
                        ingredientFields.length > 1 && removeIngredient(index)
                      }
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
              className="mt-2 flex w-full items-center justify-center gap-1 border-dashed border-[#58C16A]/40 text-[#58C16A] hover:bg-[#58C16A]/5"
              onClick={addIngredient}
            >
              <Plus size={16} />
              재료 추가
            </Button>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-700">조리 과정</h2>

            <div className="space-y-4">
              {stepFields.map((step, index) => (
                <div key={step.id} className="flex gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#58C16A] font-bold text-white">
                    {index + 1}
                  </div>
                  <div className="relative flex-1">
                    <textarea
                      className={`w-full rounded-lg bg-white p-3 ${
                        errors.steps?.[index]?.instruction
                          ? 'border border-red-500'
                          : 'border border-[#00473c]/20'
                      } min-h-[80px] shadow-sm focus:border-[#00473c] focus:outline-none`}
                      placeholder={`${index + 1}번째 과정을 설명해주세요`}
                      {...register(`steps.${index}.instruction`, {
                        required:
                          index === 0 ? '조리 과정 설명은 필수입니다' : false,
                      })}
                    />
                    {errors.steps?.[index]?.instruction && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.steps[index]?.instruction?.message}
                      </p>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-[#777777] hover:text-red-500"
                      onClick={() => stepFields.length > 1 && removeStep(index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="mt-2 flex w-full items-center justify-center gap-1 border-dashed border-[#58C16A]/40 text-[#58C16A] hover:bg-[#58C16A]/5"
                onClick={addStep}
              >
                <Plus size={16} />
                과정 추가
              </Button>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <ProgressButton
              progressPercentage={progressPercentage}
              isFormValid={isValid && isDirty}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewRecipePage;
