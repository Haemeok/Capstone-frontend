export const isOneOf = <T>(value: unknown, array: readonly T[]): value is T =>
  array.includes(value as T);

export const isKeyOf = <Obj extends object>(
  obj: Obj,
  key: PropertyKey
): key is keyof Obj => key in obj;
