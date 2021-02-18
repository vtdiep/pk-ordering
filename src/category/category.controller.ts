import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { category } from '@prisma/client';


@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    let result:category;
    result = await this.categoryService.create(createCategoryDto);
    return result;
  }

  @Get()
  async findAll() {
    let result:category[];
    result = await this.categoryService.findAll();
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let result:category;
    result = await this.categoryService.findOne(+id);
    return result
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    let result:category;
    result = await this.categoryService.update(+id, updateCategoryDto);
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    let result:category;
    result = await this.categoryService.remove(+id);
    return result;
  }
}
