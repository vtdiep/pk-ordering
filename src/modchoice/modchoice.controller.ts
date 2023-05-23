// eslint-disable-next-line max-classes-per-file
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ModchoiceService } from './modchoice.service';
import { ModchoicesDTO } from './dto/Modchoices.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('modchoice')
export class ModchoiceController {
  constructor(private readonly modchoiceService: ModchoiceService) {}

  @Get()
  async findAll() {
    let result = await this.modchoiceService.findAll();
    return result.map((ele) => new ModchoicesDTO(ele));
  }

  @Get(':item_id')
  async findOne(@Param('item_id') item_id: number) {
    let result = await this.modchoiceService.findOne(+item_id);
    // eslint-disable-next-line arrow-body-style
    return result.map((ele) => {
      return new ModchoicesDTO(ele);
    });
  }
}
