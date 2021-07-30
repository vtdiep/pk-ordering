import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { MenuModule } from './menu/menu.module';
import { CategoryModule } from './category/category.module';
import { ItemModule } from './item/item.module';
import { ModgroupModule } from './modgroup/modgroup.module';
import { MenuXCategoryModule } from './menu-x-category/menu-x-category.module';
import { CategoryXItemModule } from './category-x-item/category-x-item.module';
import { StoreConfirmationModule } from './store-confirmation/store-confirmation.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '../.env' }),
    OrderModule,
    MenuModule,
    CategoryModule,
    ItemModule,
    ModgroupModule,
    MenuXCategoryModule,
    CategoryXItemModule,
    StoreConfirmationModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
