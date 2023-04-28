import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseArrayPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { modgroup } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { ModgroupService } from './modgroup.service';
import { CreateModgroupDto } from './dto/create-modgroup.dto';
import { UpdateModgroupDto } from './dto/update-modgroup.dto';
import { GetModgroupDTO } from './dto/get-modgroup.dto';
import { Modgroup } from './entities/modgroup.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('modgroup')
export class ModgroupController {
  constructor(private readonly modgroupService: ModgroupService) {}

  @Post()
  async create(@Body() createModgroupDto: CreateModgroupDto) {
    let result: modgroup;
    result = await this.modgroupService.create(createModgroupDto);
    return plainToClass(Modgroup, result);
  }

  // @Get()
  // async findAll() {
  //   let result: modgroup[];
  //   result = await this.modgroupService.findAll();
  //   return result;
  // }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let result = await this.modgroupService.findOne(+id);
    if (result == null) throw new NotFoundException();
    return new GetModgroupDTO(result);
  }

  @Get()
  async findMany(
    @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
    ids: number[],
  ): Promise<Array<GetModgroupDTO>> {
    let result: modgroup[] | null;
    result = await this.modgroupService.findMany(ids);
    return result.map((x) => new GetModgroupDTO(x));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateModgroupDto: UpdateModgroupDto,
  ) {
    let result: modgroup;
    result = await this.modgroupService.update(+id, updateModgroupDto);
    return plainToClass(Modgroup, result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    let result: modgroup;
    result = await this.modgroupService.remove(+id);
    return plainToClass(Modgroup, result);
  }
}
