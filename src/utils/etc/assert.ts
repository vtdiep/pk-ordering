export function assertDefined<T>(obj: T): asserts obj is NonNullable<T> {
  if (obj === undefined || obj === null) {
    throw new Error('Must not be a nullable value');
  }
}

/**
 * Asserts that the array is not (null or undefined) and that the array does not contain (undefined or null).
 * Note that the array can be empty
 * @param arr
 */
export function assertDefinedArray<T>(
  arr: (T | undefined | null)[],
): asserts arr is NonNullable<T>[] {
  if (arr === undefined || arr === null) {
    throw new Error('Must not be a nullable value');
  }
  if (arr.includes(undefined)) {
    throw new Error('Must not contain undefined value');
  }
  if (arr.includes(null)) {
    throw new Error('Must not contain null value');
  }
}
