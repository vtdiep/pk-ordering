import { Module } from '@nestjs/common';
import { StoreConfirmationGateway } from './store-confirmation.gateway';

@Module({
  providers: [StoreConfirmationGateway],
  exports: [StoreConfirmationGateway],
})
export class StoreConfirmationModule {}
