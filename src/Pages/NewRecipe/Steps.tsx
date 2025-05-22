import { RecipeFormValues } from '@/type/recipe';
import {
  Control,
  useFieldArray,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { UseFormRegister } from 'react-hook-form';
import React from 'react';
import { FieldErrors } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

import StepItem from './StepItem';

type StepsProps = {
  watch: UseFormWatch<RecipeFormValues>;
  register: UseFormRegister<RecipeFormValues>;
  errors: FieldErrors<RecipeFormValues>;
  setValue: UseFormSetValue<RecipeFormValues>;
  control: Control<RecipeFormValues>;
  stepImagePreviewUrls: (string | null)[];
  setStepImagePreviewUrls: React.Dispatch<
    React.SetStateAction<(string | null)[]>
  >;
};

const Steps = ({
  watch,
  register,
  errors,
  setValue,
  control,
  stepImagePreviewUrls,
  setStepImagePreviewUrls,
}: StepsProps) => {
  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: 'steps',
  });

  const addStep = () => {
    const currentSteps = watch('steps');
    const nextStepNumber = currentSteps.length;
    appendStep({
      stepNumber: nextStepNumber,
      instruction: '',
      imageFile: null,
      ingredients: [],
    });
    setStepImagePreviewUrls([...stepImagePreviewUrls, null]);
  };

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">조리 과정</h2>

      <div className="space-y-6">
        {stepFields.map((step, index) => {
          const mainIngredients = watch('ingredients');
          return (
            <StepItem
              key={step.id}
              stepId={step.id}
              control={control}
              register={register}
              index={index}
              errors={errors}
              watch={watch}
              setValue={setValue}
              stepImagePreviewUrls={stepImagePreviewUrls}
              setStepImagePreviewUrls={setStepImagePreviewUrls}
              stepFields={stepFields}
              removeStep={removeStep}
              mainIngredients={mainIngredients}
            />
          );
        })}
        <Button
          type="button"
          variant="outline"
          className="border-olive-light text-olive-medium mt-3 flex w-full items-center justify-center gap-1 rounded-lg border-2 border-dashed py-2"
          onClick={addStep}
        >
          <Plus size={16} />
          과정 추가
        </Button>
      </div>
    </div>
  );
};

export default Steps;
