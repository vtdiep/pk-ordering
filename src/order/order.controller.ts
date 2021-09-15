import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { order } from '@prisma/client';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ValidatorPipe } from './pipes/validator.pipe';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body(ValidatorPipe) createOrderDto: CreateOrderDto) {
    let orderSession: { url: string };
    try {
      orderSession = await this.orderService.create(createOrderDto);
    } catch (error) {
      return error;
    }
    return orderSession;
    // cannot redirect from server due to possible cors issue with stripe
    // https://stackoverflow.com/questions/68630229/stripe-checkout-example-running-into-cors-error-from-localhost
    // res.redirect(303, session_url)
  }

  @Get()
  async findAll() {
    let result: order[];
    try {
      result = await this.orderService.findAll();
    } catch (error) {
      return error;
    }
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let result: order | null;
    try {
      result = await this.orderService.findOne(+id);
    } catch (error) {
      return error;
    }
    return result;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    let result: order;
    try {
      result = await this.orderService.update(+id, updateOrderDto);
    } catch (error) {
      return error;
    }
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    let result: order;
    try {
      result = await this.orderService.remove(+id);
    } catch (error) {
      return error;
    }
    return result;
  }
}
