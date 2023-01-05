import { router, protectedProcedure } from "~/server/trpc";

export const getStocksRouter = router({
  getStocks: protectedProcedure.query(async ({ ctx }) => {
    const companyId = ctx.user.company;
    const stocks = await ctx.prisma.stock.findMany({
      where: {
        companyId,
      },
    });

    return stocks;
  }),
});
