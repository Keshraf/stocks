import { z } from "zod";
import { router, protectedProcedure } from "~/server/trpc";

const ShiftOrderSchema = z.object({
  to: z.enum(["shipped", "billed"]),
  ids: z.array(z.string()),
  from: z.enum(["pending", "billed"]),
});

export const shiftOrderRouter = router({
  shiftOrder: protectedProcedure
    .input(ShiftOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      const getStockOrders = async (str: string) => {
        const stockOrders = await ctx.prisma.stockOrder.findMany({
          where: {
            orderId: str,
          },
          select: {
            id: true,
            pending: true,
            billed: true,
            shipped: true,
          },
        });

        console.log(stockOrders);

        for (let index = 0; index < stockOrders.length; index++) {
          const element = stockOrders[index];

          console.log(element);

          if (!element) continue;

          await ctx.prisma.stockOrder.update({
            where: {
              id: element.id,
            },
            data: {
              [input.from]: 0,
              [input.to]: element[input.to] + element[input.from],
            },
          });
        }
      };

      for (let index = 0; index < input.ids.length; index++) {
        const element = input.ids[index];
        console.log(element);
        if (!element) continue;
        await getStockOrders(element);
      }

      return {
        message: "Order shifted successfully",
      };
    }),
});
