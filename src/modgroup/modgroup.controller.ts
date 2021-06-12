import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { modgroup } from '@prisma/client';
import { ModgroupService } from './modgroup.service';
import { CreateModgroupDto } from './dto/create-modgroup.dto';
import { UpdateModgroupDto } from './dto/update-modgroup.dto';

@Controller('modgroup')
export class ModgroupController {
  constructor(private readonly modgroupService: ModgroupService) {}

  @Post()
  async create(@Body() createModgroupDto: CreateModgroupDto) {
    let result: modgroup;
    result = await this.modgroupService.create(createModgroupDto);
    return result;
  }

  @Get()
  async findAll() {
    let result: modgroup[];
    result = await this.modgroupService.findAll();
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let result: modgroup;
    result = await this.modgroupService.findOne(+id);
    return result;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateModgroupDto: UpdateModgroupDto,
  ) {
    let result: modgroup;
    result = await this.modgroupService.update(+id, updateModgroupDto);
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    let result: modgroup;
    result = await this.modgroupService.remove(+id);
    return result;
  }
}
