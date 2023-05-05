import { z } from "zod";
import { router, protectedProcedure } from "~/server/trpc";

const UpdateStockOrderSchema = z.object({
  id: z.string(),
  rate: z.number(),
  pending: z.number(),
  billed: z.number(),
  shipped: z.number(),
});

export const updateStockOrderRouter = router({
  updateStockOrder: protectedProcedure
    .input(UpdateStockOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      console.log("INPUT: ", input);

      const stockOrder = await ctx.prisma.stockOrder.update({
        where: {
          id: input.id,
        },
        data: {
          rate: {
            set: input.rate,
          },
          pending: {
            set: input.pending,
          },
          billed: {
            set: input.billed,
          },
          shipped: {
            set: input.shipped,
          },
        },
      });

      return {
        message: "Order created successfully",
        stockOrder: stockOrder,
      };
    }),
});
