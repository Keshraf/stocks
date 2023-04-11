import { router, protectedProcedure } from "~/server/trpc";
import { z } from "zod";

export const getOrdersRouter = router({
  getOrders: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "billed", "shipped"]),
      })
    )
    .query(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      const orders = await await ctx.prisma.order.findMany({
        include: {
          stockOrder: true,
        },
      });

      const filteredOrders = orders.filter((order) => {
        let pass = false;

        order.stockOrder.forEach((stockOrder) => {
          if (stockOrder[input.status] > 0) {
            pass = true;
          }
        });

        return pass;
      });

      return {
        message: "Order returned successfully",
        orders: filteredOrders,
      };
    }),
});
