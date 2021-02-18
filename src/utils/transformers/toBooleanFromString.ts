import { BadRequestException } from "@nestjs/common/exceptions";
import { TransformationType, TransformFnParams } from "class-transformer";



/**
 * Replacement for @Type(()=>Boolean) decorator  
 * Note that @Type(()=>Boolean) will return a boolean, given any type of value
 * - - -
 * ### ToBooleanFromString  
 * Transforms value into a boolean if value is strictly "true" or strictly "false", with no interpolation  
 * More importantly,  
 * If value is not already a boolean, or is neither "true" nor "false", throws a BadRequestException  
 * If value is already a boolean, does nothing
 * 
 * @throws BadRequestException
 * @example
    throw new BadRequestException({
            "statusCode": 400,
            "message": [
              `${key} must be a boolean value`
            ],
            "error": "Bad Request"
          })

  @todo Replace with https://github.com/typestack/class-transformer/issues/550
 */
export function ToBooleanFromString(){
    return (params: TransformFnParams) => {
      let {key, obj, type, value}: {value: any, key: string, obj: any, type: TransformationType}  = params
      console.log(value);console.log(obj);
      console.log(this)
      
      
        if ( (typeof(value) == 'string' && ['true', 'false'].includes(value)) ){
          console.log('y');
          console.log(value);
          
          
            return value == 'false' ? false : true
            // Note that Boolean("false") == true
        }
        if ( typeof(value) == 'boolean'){
            return value
        }
        throw new BadRequestException({
            "statusCode": 400,
            "message": [
              `${key} must be a boolean value`
            ],
            "error": "Bad Request"
          })
    }
}