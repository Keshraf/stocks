import { router, protectedProcedure } from "~/server/trpc";
import { CreateOrderSchema } from "~/types/orders";

export const createOrderRouter = router({
  createOrder: protectedProcedure
    .input(CreateOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      const order = await ctx.prisma.order.upsert({
        where: {
          orderId: input.orderId,
        },
        update: {},
        create: {
          billingAddress: input.billingAddress,
          shippingAddress: input.shippingAddress,
          clientName: input.clientName,
          shippingClientName: input.shippingClientName,
          orderId: input.orderId,
          orderDate: input.orderDate ? input.orderDate : new Date(),
        },
      });

      return {
        message: "Order created successfully",
        order,
      };
    }),
});
