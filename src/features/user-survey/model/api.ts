import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import { SurveyAnswers, SurveyResponse } from "./types";

export const postSurvey = async (
  surveyData: SurveyAnswers
): Promise<SurveyResponse> => {
  const response = await api.post<SurveyResponse>(
    END_POINTS.MY_SURVEY,
    surveyData
  );
  return response;
};
