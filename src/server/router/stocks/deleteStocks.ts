import { z } from "zod";
import { router, protectedProcedure } from "~/server/trpc";

const DeleteStockSchema = z.array(z.string());

export const deleteStocksRouter = router({
  deleteStocks: protectedProcedure
    .input(DeleteStockSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      if (!input) {
        throw new Error("No input");
      }

      await ctx.prisma.stock
        .deleteMany({
          where: {
            id: {
              in: input,
            },
          },
        })
        .then((res) => {
          return {
            message: "Stock deleted successfully",
          };
        })
        .catch((err) => {
          console.log(err);
          return {
            message: "Error deleting stock",
          };
        });
    }),
});
