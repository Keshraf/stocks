import { router, protectedProcedure } from "~/server/trpc";
import { z } from "zod";

const FilterSchema = z.object({
  transit: z.boolean().default(false).optional(),
  ordered: z.boolean().default(false).optional(),
});

export const getStocksRouter = router({
  getStocks: protectedProcedure
    .input(FilterSchema)
    .query(async ({ ctx, input }) => {
      const companyId = ctx.user.company;
      const stocks = await ctx.prisma.stock.findMany({
        where: {
          specs: {
            quality: {
              mill: {
                companyId,
              },
            },
          },
        },
        include: {
          specs: {
            include: {
              quality: {
                select: {
                  millName: true,
                },
              },
            },
          },
        },
      });

      if (input.transit && input.ordered) {
        return stocks.filter((stock) => stock.transit > 0 || stock.ordered > 0);
      } else if (input.transit) {
        return stocks.filter((stock) => stock.transit > 0);
      } else if (input.ordered) {
        return stocks.filter((stock) => stock.ordered > 0);
      } else {
        return stocks;
      }
    }),
});
