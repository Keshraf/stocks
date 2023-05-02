import { z } from "zod";
import { router, protectedProcedure } from "~/server/trpc";

const DeleteStockOrderSchema = z.object({
  id: z.string(),
});

export const deleteStockOrderRouter = router({
  deleteStockOrder: protectedProcedure
    .input(DeleteStockOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      console.log("INPUT: ", input);

      const stockOrder = await ctx.prisma.stockOrder.delete({
        where: {
          id: input.id,
        },
      });

      return {
        message: "Order created successfully",
        stockOrder: stockOrder,
      };
    }),
});
