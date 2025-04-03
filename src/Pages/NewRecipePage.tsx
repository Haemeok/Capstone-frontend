import React, { useRef } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Upload,
  Plus,
  X,
  Camera,
  ChefHat,
  Clock,
  Upload as UploadIcon,
  BookOpen,
  ChevronLeft,
  Share,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgressButton from "@/components/ProgressButton";
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from "react-hook-form";
// 패키지 설치 필요: npm install zod @hookform/resolvers
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";

// 임시로 타입 정의로 대체
interface Ingredient {
  id: number;
  name: string;
  amount: string;
  unit: string;
}

interface Step {
  id: number;
  description: string;
}

interface RecipeFormValues {
  title: string;
  thumbnail: string | null;
  category: string;
  cookingTime: string;
  difficulty: string;
  ingredients: Ingredient[];
  steps: Step[];
}

const NewRecipePage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // react-hook-form 설정
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<RecipeFormValues>({
    // resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: "",
      thumbnail: null,
      category: "",
      cookingTime: "",
      difficulty: "",
      ingredients: [{ id: 1, name: "", amount: "", unit: "" }],
      steps: [{ id: 1, description: "" }],
    },
    mode: "onChange",
  });

  // 재료와 스텝을 위한 필드 배열 설정
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: "steps",
  });

  // 썸네일 업로드 핸들러
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setValue("thumbnail", e.target.result as string, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 재료 추가
  const addIngredient = () => {
    const newId =
      ingredientFields.length > 0
        ? Math.max(...ingredientFields.map((f) => f.id as number)) + 1
        : 1;
    appendIngredient({ id: newId, name: "", amount: "", unit: "" });
  };

  // 조리 과정 추가
  const addStep = () => {
    const newId =
      stepFields.length > 0
        ? Math.max(...stepFields.map((f) => f.id as number)) + 1
        : 1;
    appendStep({ id: newId, description: "" });
  };

  // 폼 제출 핸들러
  const onSubmit: SubmitHandler<RecipeFormValues> = (data) => {
    console.log("제출 데이터:", data);

    // 필터링된 데이터로 가공 (빈 재료나 단계 제거)
    const filteredData = {
      ...data,
      ingredients: data.ingredients.filter((i) => i.name.trim() !== ""),
      steps: data.steps.filter((s) => s.description.trim() !== ""),
    };

    console.log("정제된 제출 데이터:", filteredData);

    // 저장 후 레시피 목록 페이지로 이동
    navigate("/recipes");
  };

  // 구성 요소 완료 여부 추적
  const formValues = watch();

  const needSteps = [
    formValues.title.trim() !== "",
    formValues.thumbnail !== null,
    formValues.category !== "",
    formValues.cookingTime !== "",
    formValues.difficulty !== "",
    formValues.ingredients.some((i: Ingredient) => i.name.trim() !== ""),
    formValues.steps.some((s: Step) => s.description.trim() !== ""),
  ];

  const completedSteps = needSteps.filter(Boolean).length;
  const totalSteps = needSteps.length;
  const progressPercentage = Math.floor((completedSteps / totalSteps) * 100);

  return (
    <div className="min-h-screen">
      <form id="recipe-form" onSubmit={handleSubmit(onSubmit)}>
        {/* 이미지 영역 및 헤더 */}
        <div className="relative">
          {/* 이미지 영역 */}
          <div
            className="w-full h-[40vh] flex items-center justify-center cursor-pointer relative"
            onClick={() => fileInputRef.current?.click()}
          >
            {formValues.thumbnail ? (
              <img
                src={formValues.thumbnail}
                alt="Recipe thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <UploadIcon size={48} className="text-[#58C16A] mx-auto mb-3" />
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

          <div className="flex flex-col justify-center absolute bottom-0 h-32 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center w-7/8 max-w-7/8 justify-between">
              <input
                type="text"
                className={` bg-transparent text-4xl pb-2 font-bold border-b text-white ${
                  errors.title ? "border-red-500" : "border-white/30"
                }  focus:outline-none focus:border-white`}
                placeholder="레시피 이름"
                {...register("title", {
                  required: "레시피 이름은 필수입니다",
                })}
              />
              <p className="text-white text-sm">{formValues.title.length}/20</p>
            </div>
            {errors.title && (
              <p className="text-red-300 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="max-w-3xl mx-auto px-4 pt-6">
          {/* 레시피 설명 박스 */}
          <div className="bg-white rounded-xl p-4 mb-8 shadow-sm">
            <p className="text-[#777777]">
              레시피에 대한 간단한 설명을 작성하세요. 어떤 특징이 있는지, 어떤
              상황에서 먹기 좋은지 등을 알려주세요.
            </p>
          </div>

          {/* 레벨/조리시간/난이도 정보 */}
          <div className="grid grid-cols-3 gap-4 border-t border-b border-[#00473c]/20 py-4 mb-8">
            <div className="text-center">
              <p className="text-[#777777] mb-1">카테고리</p>
              <select
                className={`w-full bg-transparent border-b ${
                  errors.category ? "border-red-500" : "border-[#00473c]/30"
                } pb-1 text-center focus:outline-none focus:border-[#00473c]`}
                {...register("category", {
                  required: "카테고리를 선택해주세요",
                })}
              >
                <option value="" className="bg-[#f4f3e7]">
                  선택하기
                </option>
                <option value="korean" className="bg-[#f4f3e7]">
                  한식
                </option>
                <option value="western" className="bg-[#f4f3e7]">
                  양식
                </option>
                <option value="japanese" className="bg-[#f4f3e7]">
                  일식
                </option>
                <option value="chinese" className="bg-[#f4f3e7]">
                  중식
                </option>
                <option value="dessert" className="bg-[#f4f3e7]">
                  디저트
                </option>
              </select>
            </div>
            <div className="text-center">
              <p className="text-[#777777] mb-1">조리시간</p>
              <div className="relative">
                <input
                  type="text"
                  className={`w-full bg-transparent border-b ${
                    errors.cookingTime
                      ? "border-red-500"
                      : "border-[#00473c]/30"
                  } pb-1 text-center focus:outline-none focus:border-[#00473c]`}
                  placeholder="30"
                  {...register("cookingTime", {
                    required: "조리 시간을 입력해주세요",
                    pattern: {
                      value: /^\d+$/,
                      message: "숫자만 입력 가능합니다",
                    },
                  })}
                />
                <span className="text-sm ml-1">분</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[#777777] mb-1">난이도</p>
              <select
                className={`w-full bg-transparent border-b ${
                  errors.difficulty ? "border-red-500" : "border-[#00473c]/30"
                } pb-1 text-center focus:outline-none focus:border-[#00473c]`}
                {...register("difficulty", {
                  required: "난이도를 선택해주세요",
                })}
              >
                <option value="" className="bg-[#f4f3e7]">
                  선택하기
                </option>
                <option value="easy" className="bg-[#f4f3e7]">
                  쉬움
                </option>
                <option value="normal" className="bg-[#f4f3e7]">
                  보통
                </option>
                <option value="hard" className="bg-[#f4f3e7]">
                  어려움
                </option>
              </select>
            </div>
          </div>

          {/* 재료 영역 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-[#58C16A]">재료</h2>
              <div className="flex items-center gap-2">
                <span className="text-[#777777]">인원</span>
                <select className="bg-white border border-[#00473c]/20 rounded-md p-1">
                  <option value="1" className="bg-white">
                    1
                  </option>
                  <option value="2" className="bg-white">
                    2
                  </option>
                  <option value="4" className="bg-white">
                    4
                  </option>
                  <option value="8" className="bg-white">
                    8
                  </option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {ingredientFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center gap-3 p-3 border-b border-[#00473c]/10 bg-white rounded-lg shadow-sm"
                >
                  <div className="w-10 h-10 bg-[#00473c]/10 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <ChefHat size={20} className="text-[#00473c]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className={`flex-1 bg-transparent ${
                          errors.ingredients?.[index]?.name
                            ? "border-red-500"
                            : "border-[#00473c]/10"
                        } focus:outline-none border-b`}
                        placeholder="재료명"
                        {...register(`ingredients.${index}.name`, {
                          required: index === 0 ? "재료명은 필수입니다" : false,
                        })}
                      />
                      <div className="flex gap-1">
                        <input
                          type="text"
                          className="w-16 bg-transparent border-b border-[#00473c]/10 text-center focus:outline-none focus:border-[#00473c]"
                          placeholder="수량"
                          {...register(`ingredients.${index}.amount`)}
                        />
                        <input
                          type="text"
                          className="w-16 bg-transparent border-b border-[#00473c]/10 text-center focus:outline-none focus:border-[#00473c]"
                          placeholder="단위"
                          {...register(`ingredients.${index}.unit`)}
                        />
                      </div>
                    </div>
                    {errors.ingredients?.[index]?.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.ingredients[index]?.name?.message}
                      </p>
                    )}
                  </div>
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
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full mt-2 flex items-center justify-center gap-1 border-dashed border-[#00473c]/40 text-[#00473c] hover:bg-[#00473c]/5"
                onClick={addIngredient}
              >
                <Plus size={16} />
                재료 추가
              </Button>
            </div>
          </div>

          {/* 조리 과정 영역 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-[#00473c]">
              조리 과정
            </h2>

            <div className="space-y-4">
              {stepFields.map((step, index) => (
                <div key={step.id} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#00473c] rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 relative">
                    <textarea
                      className={`w-full bg-white p-3 rounded-lg ${
                        errors.steps?.[index]?.description
                          ? "border border-red-500"
                          : "border border-[#00473c]/20"
                      } focus:outline-none focus:border-[#00473c] shadow-sm min-h-[80px]`}
                      placeholder={`${index + 1}번째 과정을 설명해주세요`}
                      {...register(`steps.${index}.description`, {
                        required:
                          index === 0 ? "조리 과정 설명은 필수입니다" : false,
                      })}
                    />
                    {errors.steps?.[index]?.description && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.steps[index]?.description?.message}
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
                className="w-full mt-2 flex items-center justify-center gap-1 border-dashed border-[#00473c]/40 text-[#00473c] hover:bg-[#00473c]/5"
                onClick={addStep}
              >
                <Plus size={16} />
                과정 추가
              </Button>
            </div>
          </div>

          {/* 하단 버튼 영역 */}
          <div className="flex justify-center mt-8">
            <ProgressButton
              progressPercentage={progressPercentage}
              isFormValid={isValid && isDirty}
              completedSteps={completedSteps}
              totalSteps={totalSteps}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewRecipePage;
