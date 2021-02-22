import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { MenuModule } from './menu/menu.module';
import { CategoryModule } from './category/category.module';
import { ItemModule } from './item/item.module';
import { ModgroupModule } from './modgroup/modgroup.module';
import { MenuXCategoryModule } from './menu-x-category/menu-x-category.module';

@Module({
  imports: [OrderModule, MenuModule, CategoryModule, ItemModule, ModgroupModule, MenuXCategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
