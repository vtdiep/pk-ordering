import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Compare this property with another property with a custom predicate
 *
 * Based on:
 * - https://github.com/typestack/class-validator/issues/486#issuecomment-606767275
 * - https://github.com/typestack/class-validator/issues/486#issuecomment-732948222
 * - https://github.com/typestack/class-validator/issues/486#issuecomment-744989085
 * @param failedValidationMsg
 * @param property Name of the property to compare against
 * @param predicate How to compare the properties (this, that)=> boolean
 * @param validationOptions
 *
 *
 */
export function Match<K extends string, T extends { [$K in K]: U }, U>(
  failedValidationMsg: string,
  property: K,
  predicate: (thisProp: U, otherProp: U) => boolean,
  validationOptions?: ValidationOptions,
) {
  return (object: T, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property, predicate, failedValidationMsg],
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName, predicateFunction] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return predicateFunction(value, relatedValue);
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName, predicateFunction, failedValidationMsg] =
      args.constraints;
    return `${args.property} ${failedValidationMsg} ${relatedPropertyName}`;
  }
}
