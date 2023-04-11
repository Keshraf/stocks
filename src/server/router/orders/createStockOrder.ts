import { z } from "zod";
import { router, protectedProcedure } from "~/server/trpc";
import { CreateStockOrderSchema, CreateStockOrderType } from "~/types/orders";

export const createStockOrderRouter = router({
  createStockOrder: protectedProcedure
    .input(z.array(CreateStockOrderSchema))
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      console.log("INPUT: ", input);

      const createStockOrder = async (stock: CreateStockOrderType) => {
        const stockOrder = await ctx.prisma.stockOrder.create({
          data: {
            pending: stock.quantity,
            rate: stock.rate,
            stock: {
              connect: {
                id: stock.stockId,
              },
            },
            order: {
              connect: {
                orderId: stock.orderId,
              },
            },
          },
        });

        return stockOrder;
      };

      const orders = [];
      for (let i = 0; i < input.length; i++) {
        if (!input[i] || input[i] === null || input[i] === undefined) {
          continue;
        } else {
          orders.push(await createStockOrder(input[i] as CreateStockOrderType));
        }
      }

      return {
        message: "Order created successfully",
        stockOrder: orders,
      };
    }),
});
