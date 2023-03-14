import { router, protectedProcedure } from "~/server/trpc";
import { z } from "zod";

export const getOrdersRouter = router({
  getOrders: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "billed", "shipped"]),
      })
    )
    .query(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      const order = await ctx.prisma.order.findMany({
        where: {
          stockOrder: {
            some: {
              status: input.status,
            },
          },
        },
        include: {
          stockOrder: {
            include: {
              stock: {
                include: {
                  specs: {
                    select: {
                      id: true,
                      qualityName: true,
                      breadth: true,
                      length: true,
                      weight: true,
                      gsm: true,
                      sheets: true,
                      quality: {
                        select: {
                          millName: true,
                        },
                      },
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
        data: order,
      };
    }),
});
