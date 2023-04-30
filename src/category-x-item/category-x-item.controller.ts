import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseFilters,
  ClassSerializerInterceptor,
  UseInterceptors,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma, category_X_item } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { CategoryXItemService } from './category-x-item.service';
import { CreateCategoryXItemDto } from './dto/create-category-x-item.dto';
import { UpdateCategoryXItemDto } from './dto/update-category-x-item.dto';
import { CategoryXItem } from './entities/category-x-item.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('category-item')
export class CategoryXItemController {
  constructor(private readonly categoryXItemService: CategoryXItemService) {}

  @Post()
  async create(@Body() createCategoryXItemDto: CreateCategoryXItemDto) {
    let result: category_X_item | null = null;
    try {
      result = await this.categoryXItemService.create(createCategoryXItemDto);
      console.log(result);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          console.log(
            'There is a unique constraint violation, a new category-x-item cannot be created',
          );
          throw new BadRequestException();
        }
        throw new BadRequestException();
      }
    }
    if (result == null) {
      throw new BadRequestException();
    }

    return plainToClass(CategoryXItem, result);
  }

  @Get()
  async findAll() {
    let result: category_X_item[] = [];
    try {
      result = await this.categoryXItemService.findAll();
    } catch (error) {
      throw new BadRequestException();
    }
    console.log(result);

    // eslint-disable-next-line arrow-body-style
    return result.map((entry) => {
      return plainToClass(CategoryXItem, entry);
    });
  }

  @Get(':cid/:iid')
  async findOne(@Param('cid') cid: string, @Param('iid') iid: string) {
    let result: category_X_item | null;
    result = await this.categoryXItemService.findOne(+cid, +iid);
    if (result == null) throw new NotFoundException();
    return plainToClass(CategoryXItem, result);
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
    return plainToClass(CategoryXItem, result);
  }

  @Delete(':cid/:iid')
  async remove(@Param('cid') cid: string, @Param('iid') iid: string) {
    let result: category_X_item;
    result = await this.categoryXItemService.remove(+cid, +iid);
    return plainToClass(CategoryXItem, result);
  }
}
