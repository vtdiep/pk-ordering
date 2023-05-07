import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { menu_X_category } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { MenuXCategoryService } from './menu-x-category.service';
import { CreateMenuXCategoryDto } from './dto/create-menu-x-category.dto';
import { UpdateMenuXCategoryDto } from './dto/update-menu-x-category.dto';
import { MenuXCategory } from './entities/menu-x-category.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('menu-x-category')
export class MenuXCategoryController {
  constructor(private readonly menuXCategoryService: MenuXCategoryService) {}

  @Post()
  async create(@Body() createMenuXCategoryDto: CreateMenuXCategoryDto) {
    let result: menu_X_category;
    result = await this.menuXCategoryService.create(createMenuXCategoryDto);
    return plainToClass(MenuXCategory, result);
  }

  @Get()
  async findAll() {
    let result: menu_X_category[];
    result = await this.menuXCategoryService.findAll();
    return result.map((mxc) => plainToClass(MenuXCategory, mxc));
  }

  @Get(':mid/:cid')
  async findOne(@Param('mid') mid: string, @Param('cid') cid: string) {
    let result: menu_X_category | null;
    result = await this.menuXCategoryService.findOne(+mid, +cid);
    return plainToClass(MenuXCategory, result);
  }

  @Patch()
  async update(
    @Query('mid') mid: string,
    @Query('cid') cid: string,
    @Body() updateMenuXCategoryDto: UpdateMenuXCategoryDto,
  ) {
    let result: menu_X_category;
    result = await this.menuXCategoryService.update(
      +mid,
      +cid,
      updateMenuXCategoryDto,
    );
    return plainToClass(MenuXCategory, result);
  }

  @Delete(':mid/:cid')
  async remove(@Param('mid') mid: string, @Param('cid') cid: string) {
    let result: menu_X_category;
    result = await this.menuXCategoryService.remove(+mid, +cid);
    return plainToClass(MenuXCategory, result);
  }
}
