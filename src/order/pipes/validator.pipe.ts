import { ArgumentMetadata, Inject, Injectable, PipeTransform } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import Knex from 'knex';
import { KNEX_CONNECTION } from '../../common/constants';
import { KnexService } from 'src/common/database/knex/knex.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderDetailDto } from '../dto/order-details.dto';

@Injectable()
export class ValidatorPipe implements PipeTransform {

constructor(@Inject(KNEX_CONNECTION) private knex:Knex){}

  async transform(value: CreateOrderDto, metadata: ArgumentMetadata) {

    let items:OrderDetailDto = value.details;

    console.log(items)

    // check that items+modifiers are available and that prices are correct
    let result:Knex<Prisma.orderSelect> = await this.knex.raw('select * from "order"');
    console.log(result);
    console.log(`value: ${JSON.stringify(value)}`)
    // check total sum is correct
    return value;
  }
}
