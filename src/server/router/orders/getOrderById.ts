import { router, protectedProcedure } from "~/server/trpc";
import { z } from "zod";

export const getOrderByIdRouter = router({
  getOrderById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      const order = await ctx.prisma.order.findUnique({
        where: {
          id: input,
        },
        include: {
          stockOrder: {
            include: {
              stock: {
                include: {
                  specs: {
                    include: {
                      quality: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return {
        message: "Order returned successfully",
        order,
      };
    }),
});
