import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { category_X_item } from '@prisma/client';
import { CategoryXItemService } from './category-x-item.service';
import { CreateCategoryXItemDto } from './dto/create-category-x-item.dto';
import { UpdateCategoryXItemDto } from './dto/update-category-x-item.dto';

@Controller('category-item')
export class CategoryXItemController {
  constructor(private readonly categoryXItemService: CategoryXItemService) {}

  @Post()
  async create(@Body() createCategoryXItemDto: CreateCategoryXItemDto) {
    let result: category_X_item;
    result = await this.categoryXItemService.create(createCategoryXItemDto);
    return result;
  }

  @Get()
  async findAll() {
    let result: category_X_item[];
    try {
      result = await this.categoryXItemService.findAll();
    } catch (error) {
      console.log(error);
    }
    console.log(result);

    return result;
  }

  @Get(':cid/:iid')
  async findOne(@Param('cid') cid: string, @Param('iid') iid: string) {
    let result: category_X_item;
    result = await this.categoryXItemService.findOne(+cid, +iid);
    return result;
  }

  @Put(':cid/:iid')
  async update(
    @Param('cid') cid: string,
    @Param('iid') iid: string,
    @Body() updateCategoryXItemDto: UpdateCategoryXItemDto,
  ) {
    let result: category_X_item;
    result = await this.categoryXItemService.update(
      +cid,
      +iid,
      updateCategoryXItemDto,
    );
    return result;
  }

  @Delete(':cid/:iid')
  async remove(@Param('cid') cid: string, @Param('iid') iid: string) {
    let result: category_X_item;
    result = await this.categoryXItemService.remove(+cid, +iid);
    return result;
  }
}
