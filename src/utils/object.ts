export const buildParams = <T extends object>(
  base: T,
  optionals: Partial<T>,
): T => {
  const params = { ...base };
  (Object.keys(optionals) as Array<keyof T>).forEach((key) => {
    const value = optionals[key];
    if (value !== null && value !== undefined) {
      params[key] = value;
    }
  });
  return params;
};

export const customParamsSerializer = (params: Record<string, any>): string => {
  const parts: string[] = [];

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || typeof value === 'undefined') {
      return;
    }

    const encodedKey = encodeURIComponent(key);

    if (Array.isArray(value)) {
      value.forEach((arrayElement) => {
        if (arrayElement !== null && typeof arrayElement !== 'undefined') {
          parts.push(
            `${encodedKey}=${encodeURIComponent(String(arrayElement))}`,
          );
        }
      });
    } else {
      parts.push(`${encodedKey}=${encodeURIComponent(String(value))}`);
    }
  });

  return parts.join('&');
};
