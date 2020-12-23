import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import Knex from 'knex';
import { KnexService } from 'src/common/database/knex/knex.service';

@Injectable()
export class ValidatorPipe implements PipeTransform {

constructor(private knexService:KnexService){}

  async transform(value: any, metadata: ArgumentMetadata) {

    let knex = this.knexService.knex();
    let result:Knex<Prisma.orderSelect> = await knex.raw('select * from "order"');
    console.log(result);

    // validate schema?
    // check menu items available and cost is correct
    // check total sum is correct
    return value;
  }
}
