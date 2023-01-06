import { protectedProcedure, router } from "~/server/trpc";
import { StockSchema, StockArrSchema } from "~/types/stocks";

export const postStocksBulkRouter = router({
  postStocksBulk: protectedProcedure
    .input(StockArrSchema)
    .mutation(async ({ input, ctx }) => {
      console.log(ctx);
      /* return {
        message: "bc",
      };
 */
      const data = input.map(async (val) => {
        const mill = await ctx.prisma.mill.upsert({
          where: {
            name: val.mill,
          },
          update: {},
          create: {
            name: val.mill,
            companyId: ctx.user.company,
          },
        });

        const quality = await ctx.prisma.quality.upsert({
          where: {
            name: val.qualityName,
          },
          update: {},
          create: {
            name: val.qualityName,
            millName: val.mill,
            companyId: ctx.user.company,
          },
        });

        const stock = await ctx.prisma.stock.create({
          data: {
            ...val,
            companyId: ctx.user.company,
          },
        });

        return {
          mill,
          quality,
          stock,
        };
      });

      return {
        data,
      };
    }),
});
