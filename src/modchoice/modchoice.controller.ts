import { Controller, Get, Param } from '@nestjs/common';
import { ModchoiceService } from './modchoice.service';

@Controller('modchoice')
export class ModchoiceController {
  constructor(private readonly modchoiceService: ModchoiceService) {}

  @Get()
  findAll() {
    return this.modchoiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modchoiceService.findOne(+id);
  }
}
