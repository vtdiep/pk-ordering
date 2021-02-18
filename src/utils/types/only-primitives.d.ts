// https://stackoverflow.com/questions/50837171/remove-properties-of-a-type-from-another-type
// https://stackoverflow.com/questions/61476095/restricting-types-on-object-properties-in-typescript-dynamically-based-on-other
// https://stackoverflow.com/a/49397693

type PrimitiveKeys<T> = {
    [P in keyof T]: Exclude<T[P], undefined> extends object ? never : P
}[keyof T];


/**
 * Returns a type with only properties that are primitives. 
 * Any types that extend object are stripped.  
 * The unknown type is not stripped
 */
export type OnlyPrimitives<T> = Pick<T, PrimitiveKeys<T>>