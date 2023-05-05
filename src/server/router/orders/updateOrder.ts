import { z } from "zod";
import { router, protectedProcedure } from "~/server/trpc";

const UpdateStockOrderSchema = z.object({
  id: z.string(),
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
            id: input.id,
          },
          data: {
            orderId: {
              set: input.orderId,
            },
            orderDate: input.orderDate,
            billingAddress: input.billingAddress,
            shippingAddress: input.shippingAddress,
            clientName: input.clientName,
            shippingClientName: input.shippingClientName,
          },
        })
        .then(() => {
          return {
            message: "Order updated successfully",
          };
        })
        .catch((err) => {
          throw new Error("Error UPDATING CLIENT", err);
        });
    }),
});
