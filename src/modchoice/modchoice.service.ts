import { Injectable } from '@nestjs/common';

@Injectable()
export class ModchoiceService {
  findAll() {
    return `This action returns all modchoice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} modchoice`;
  }
}
