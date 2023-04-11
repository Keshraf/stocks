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
          return acc + order.pending + order.shipped + order.billed;
        }, 0);

        // Fix first reduce quantity then reduce transit then reduce ordered
        const quantityReduced =
          stock.quantity > reduced ? reduced : stock.quantity;
        let newReduced = reduced - quantityReduced;
        const transitReduced =
          stock.transit > newReduced ? newReduced : stock.transit;
        newReduced = newReduced - transitReduced;
        const orderedReduced =
          stock.ordered > newReduced ? newReduced : stock.ordered;

        return {
          ...stock,
          quantity: stock.quantity - quantityReduced,
          transit: stock.transit - transitReduced,
          ordered: stock.ordered - orderedReduced,
        };
      });

      return {
        ...spec,
        stock,
      };
    });
  }),
});
