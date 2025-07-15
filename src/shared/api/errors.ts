export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = "ApiError";
  }

  // 에러 타입 체크 헬퍼
  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }

  // 특정 상태 코드 체크
  static isStatus(error: unknown, status: number): boolean {
    return ApiError.isApiError(error) && error.status === status;
  }

  // 일반적인 에러 상태 체크 헬퍼들
  static isUnauthorized(error: unknown): boolean {
    return ApiError.isStatus(error, 401);
  }

  static isForbidden(error: unknown): boolean {
    return ApiError.isStatus(error, 403);
  }

  static isNotFound(error: unknown): boolean {
    return ApiError.isStatus(error, 404);
  }

  static isServerError(error: unknown): boolean {
    return ApiError.isApiError(error) && error.status >= 500;
  }

  static isClientError(error: unknown): boolean {
    return (
      ApiError.isApiError(error) && error.status >= 400 && error.status < 500
    );
  }

  // 에러를 사용자 친화적 메시지로 변환
  toUserMessage(): string {
    switch (this.status) {
      case 400:
        return "잘못된 요청입니다. 입력 내용을 확인해주세요.";
      case 401:
        return "로그인이 필요합니다.";
      case 403:
        return "접근 권한이 없습니다.";
      case 404:
        return "요청하신 내용을 찾을 수 없습니다.";
      case 408:
        return "요청 시간이 초과되었습니다. 다시 시도해주세요.";
      case 429:
        return "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.";
      case 500:
        return "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      case 502:
      case 503:
      case 504:
        return "서비스가 일시적으로 이용할 수 없습니다. 잠시 후 다시 시도해주세요.";
      default:
        return "알 수 없는 오류가 발생했습니다.";
    }
  }
}

export const parseErrorResponse = async (response: Response): Promise<any> => {
  try {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  } catch {
    return response.statusText;
  }
};

export const createApiError = async (response: Response): Promise<ApiError> => {
  const errorData = await parseErrorResponse(response);
  const error = new ApiError(response.status, response.statusText, errorData);

  return error;
};

export const handleNetworkError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    if (error.message.includes("timeout")) {
      return new ApiError(408, "Request Timeout", "Request timed out");
    }
    if (error.message.includes("fetch")) {
      return new ApiError(0, "Network Error", "Network connection failed");
    }
  }

  return new ApiError(0, "Unknown Error", "An unknown error occurred");
};

export const isRetryableError = (error: ApiError): boolean => {
  return error.status >= 500 || error.status === 0 || error.status === 408;
};

export const isErrorResponse = (response: Response): boolean => {
  return !response.ok;
};
