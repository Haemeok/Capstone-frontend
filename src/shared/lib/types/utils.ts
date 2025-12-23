/**
 * Type-safe wrapper for Object.keys() that preserves literal key types
 * @param obj - Object to get keys from
 * @returns Array of keys with proper typing
 */
export function getTypedKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * Type-safe wrapper for Object.entries() that preserves key and value types
 * @param obj - Object to get entries from
 * @returns Array of [key, value] tuples with proper typing
 */
export function getTypedEntries<T extends object>(
  obj: T
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}
