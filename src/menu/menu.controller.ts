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
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { menu } from '@prisma/client';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  async create(@Body() createMenuDto: CreateMenuDto) {
    let result: menu;
    result = await this.menuService.create(createMenuDto);
    return result;
  }

  @Get()
  async findAll() {
    let result: menu[];
    result = await this.menuService.findAll();
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let result: menu;
    result = await this.menuService.findOne(+id);
    return result;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    let result: menu;
    result = await this.menuService.update(+id, updateMenuDto);
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    let result: menu;
    result = await this.menuService.remove(+id);
    return result;
  }
}
