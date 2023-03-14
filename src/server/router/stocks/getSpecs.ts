import { router, protectedProcedure } from "~/server/trpc";

export const getSpecsRouter = router({
  getSpecs: protectedProcedure.query(async ({ ctx }) => {
    const companyId = ctx.user.company;
    const specs = await ctx.prisma.specs.findMany({
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
        stock: {
          include: {
            order: true,
            invoice: true,
          },
        },
      },
    });

    return specs.map((spec) => {
      const stock = spec.stock.map((stock) => {
        const reduced = stock.order.reduce((acc, order) => {
          return acc + order.quantity;
        }, 0);

        // Fix first reduce quantity then reduce transit then reduce ordered

        return {
          ...stock,
          quantity: stock.quantity - reduced,
        };
      });

      return {
        ...spec,
        stock,
      };
    });
  }),
});
