import { router, protectedProcedure } from "~/server/trpc";
import { z } from "zod";

export const getSpecsByIdsRouter = router({
  getSpecsByIds: protectedProcedure
    .input(z.array(z.string()))
    .query(async ({ ctx, input }) => {
      const stock = await ctx.prisma.specs.findMany({
        where: {
          id: {
            in: input,
          },
        },
      });

      return stock;
    }),
});
