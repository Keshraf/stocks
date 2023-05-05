import { z } from "zod";
import { router, protectedProcedure } from "~/server/trpc";

export const deleteOrderRouter = router({
  deleteOrder: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      await ctx.prisma.order
        .delete({
          where: {
            orderId: input,
          },
          include: {
            stockOrder: true,
          },
        })
        .then(() => {
          return {
            message: "Order deleted successfully",
          };
        })
        .catch((err) => {
          throw new Error(err);
        });
    }),
});
