import { z } from "zod";
import { router, protectedProcedure } from "~/server/trpc";

const UpdateStockOrderSchema = z.object({
  orderId: z.string(),
  orderDate: z.date(),
  billingAddress: z.string(),
  shippingAddress: z.string(),
  clientName: z.string(),
  shippingClientName: z.string(),
});

export const updateOrderRouter = router({
  updateOrder: protectedProcedure
    .input(UpdateStockOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      await ctx.prisma.order
        .update({
          where: {
            orderId: input.orderId,
          },
          data: {
            orderDate: input.orderDate,
            billingAddress: input.billingAddress,
            shippingAddress: input.shippingAddress,
            clientName: input.clientName,
            shippingClientName: input.shippingClientName,
          },
        })
        .then(() => {
          return {
            message: "Order deleted successfully",
          };
        })
        .catch((err) => {
          throw new Error(err);
        });
    }),
});
