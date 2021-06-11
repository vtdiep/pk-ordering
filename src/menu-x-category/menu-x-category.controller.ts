import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { MenuXCategoryService } from './menu-x-category.service';
import { CreateMenuXCategoryDto } from './dto/create-menu-x-category.dto';
import { UpdateMenuXCategoryDto } from './dto/update-menu-x-category.dto';
import { menu_X_category } from '@prisma/client';

@Controller('menu-x-category')
export class MenuXCategoryController {
  constructor(private readonly menuXCategoryService: MenuXCategoryService) {}

  @Post()
  async create(@Body() createMenuXCategoryDto: CreateMenuXCategoryDto) {
    let result: menu_X_category;
    result = await this.menuXCategoryService.create(createMenuXCategoryDto);
    return result;
  }

  @Get()
  async findAll() {
    let result: menu_X_category[];
    result = await this.menuXCategoryService.findAll();
    return result;
  }

  @Get(':mid/:cid')
  async findOne(@Param('mid') mid: string, @Param('cid') cid: string) {
    let result: menu_X_category;
    result = await this.menuXCategoryService.findOne(+mid, +cid);
    return result;
  }

  @Patch(':mid/:cid')
  async update(
    @Param('mid') mid: string,
    @Param('cid') cid: string,
    @Body() updateMenuXCategoryDto: UpdateMenuXCategoryDto,
  ) {
    let result: menu_X_category;
    result = await this.menuXCategoryService.update(
      +mid,
      +cid,
      updateMenuXCategoryDto,
    );
    return result;
  }

  @Delete(':mid/:cid')
  async remove(@Param('mid') mid: string, @Param('cid') cid: string) {
    let result: menu_X_category;
    result = await this.menuXCategoryService.remove(+mid, +cid);
    return result;
  }
}
