let orders:any[] = [];

export const mockedPrismaService = {
  order: {
    create: (order) => {
      orders.push(order);
      return order;
    },
  },
};
