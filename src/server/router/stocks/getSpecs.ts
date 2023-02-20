import { router, protectedProcedure } from "~/server/trpc";

export const getSpecsRouter = router({
  getSpecs: protectedProcedure.query(async ({ ctx }) => {
    const companyId = ctx.user.company;
    const stocks = await ctx.prisma.specs.findMany({
      where: {
        quality: {
          mill: {
            companyId,
          },
        },
      },
      include: {
        quality: {
          include: {
            mill: true,
          },
        },
        stock: true,
      },
    });

    return stocks;
  }),
});
