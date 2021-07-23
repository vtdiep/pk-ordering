import { order_status } from '@prisma/client';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { Order } from 'src/order/entities/order.entity';
import { OrderItemDataEntity } from 'src/order/entities/orderItemData.entity';
import { OrderModgroupDataEntity } from 'src/order/entities/orderModgroupData.entity';
import { OrderModOptDataEntity } from 'src/order/entities/orderModOptData.entity';
import { StoreOrderDetailItemEntity } from './store-order-detail-item.entity';
import { StoreOrderDetailModEntity } from './store-order-detail-mod.entity';

export class StoreOrderEntity extends Order {
  oid?: number;

  email: string;

  name: string;

  phone?: string | null | undefined;

  transaction_token?: string | null | undefined;

  time_placed: Date;

  time_accepted?: Date | null | undefined;

  pickup_time: Date;

  amount_paid: number;

  tax: number;

  status?: order_status;

  details: StoreOrderDetailItemEntity[];

  constructor(
    order: CreateOrderDto,
    itemDataDictByItemId: { [x: number]: OrderItemDataEntity },
    modgroupData: OrderModgroupDataEntity,
    modoptData: OrderModOptDataEntity[],
    transaction_token: string,
  ) {
    super();
    // this.oid
    this.email = order.email;
    this.name = order.name;
    this.phone = order.phone;
    this.transaction_token = transaction_token;
    this.time_placed = new Date();
    // this.time_accepted
    if (typeof order.pickup_time === 'string') {
      this.pickup_time = new Date(order.pickup_time);
    } else {
      this.pickup_time = order.pickup_time;
    }
    this.amount_paid = Number(order.amount_paid);
    this.tax = Number(order.tax);
    // this.status
    this.details = [];

    order.details.items.forEach((detailItem) => {
      let item = new StoreOrderDetailItemEntity();
      item.name = itemDataDictByItemId[detailItem.id].item_name;
      item.price = detailItem.price;
      item.quantity = detailItem.quantity;

      item.mods = [];
      detailItem.mods?.forEach((detailMod) => {
        let mod = new StoreOrderDetailModEntity();
        mod.modgroup = detailMod.id;
        mod.modgroup_name = modgroupData[detailMod.id].name;
        mod.modifierItemIds = detailMod.modifierItemIds;
        mod.modifierItems = detailMod.modifierItemIds.map(
          (id) =>
            modoptData.find(
              (e) => e.mod_id === detailMod.id && e.item_id === id,
            )!.modopt_name,
        );
        item.mods?.push(mod);
      });

      this.details.push(item);
    });
  }
}
