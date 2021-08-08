import { Controller, Post, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripe: StripeService) {}

  @Post('checkout')
  async login(@Res() res) {
    return this.stripe.create(res);
  }
}
