import { z } from "zod";
import { router, protectedProcedure } from "~/server/trpc";

const DeleteStockOrderSchema = z.array(z.string());

export const deleteStockOrderRouter = router({
  deleteStockOrder: protectedProcedure
    .input(DeleteStockOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      console.log("INPUT: ", input);

      const stockOrder = await ctx.prisma.stockOrder.deleteMany({
        where: {
          id: {
            in: input,
          },
        },
      });

      return {
        message: "Stock Order deleted successfully",
        stockOrder: stockOrder,
      };
    }),
});
