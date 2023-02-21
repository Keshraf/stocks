import { router, protectedProcedure } from "~/server/trpc";
import { z } from "zod";

export const getSpecByIdRouter = router({
  getSpecById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const stock = await ctx.prisma.specs.findUnique({
        where: {
          id: input,
        },
        include: {
          stock: {
            select: {
              id: true,
              quantity: true,
              transit: true,
              ordered: true,
              bundle: true,
              invoiceName: true,
              createdAt: true,
            },
          },
          quality: {
            select: {
              millName: true,
            },
          },
        },
      });

      return stock;
    }),
});
