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
