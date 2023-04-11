import { protectedProcedure, router } from "~/server/trpc";
import { z } from "zod";
import { StockUpdateSchema } from "~/types/stocks";

export const updateStocksQuantityRouter = router({
  updateStocksQuantity: protectedProcedure
    .input(z.array(StockUpdateSchema))
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      const updatedStocks = input.map(async (stock) => {
        const { id, quantity, transit, ordered } = stock;

        const stockToUpdate = ctx.prisma.stock
          .update({
            where: {
              id,
            },
            data: {
              quantity,
              transit,
              ordered,
            },
          })
          .catch((err) => {
            console.log(err);
          });

        return stockToUpdate;
      });

      return Promise.all(updatedStocks).then((stocks) => {
        return {
          stocks,
          message: "Stocks updated successfully",
        };
      });
    }),
});
