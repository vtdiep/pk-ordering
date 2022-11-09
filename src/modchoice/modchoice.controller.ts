import { Controller, Get, Param } from '@nestjs/common';
import { ModchoiceService } from './modchoice.service';

@Controller('modchoice')
export class ModchoiceController {
  constructor(private readonly modchoiceService: ModchoiceService) {}

  @Get()
  findAll() {
    return this.modchoiceService.findAll();
  }

  @Get(':item_id')
  findOne(@Param('item_id') item_id: number) {
    return this.modchoiceService.findOne(+item_id);
  }
}
