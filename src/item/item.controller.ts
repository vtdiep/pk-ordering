import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseBoolPipe,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { item } from '@prisma/client';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemEntity } from './entities/item.entity';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async create(@Body() createItemDto: CreateItemDto) {
    console.log(createItemDto);
    let result: item;
    result = await this.itemService.create(createItemDto);
    return result;
  }

  @Get()
  async findAll() {
    let result: item[];
    result = await this.itemService.findAll();
    return result;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string, @Query('include') include?: string) {
    let result = await this.itemService.findOne(+id, Boolean(include));

    if (!result) return null;

    return new ItemEntity(result);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    let result: item;
    result = await this.itemService.update(+id, updateItemDto);
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    let result: item;
    result = await this.itemService.remove(+id);
    return result;
  }
}
