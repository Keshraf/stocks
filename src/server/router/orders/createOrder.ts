import { router, protectedProcedure } from "~/server/trpc";
import { CreateOrderSchema } from "~/types/orders";

export const createOrderRouter = router({
  createOrder: protectedProcedure
    .input(CreateOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      console.log("INPUT: ", input);

      for (let stock of input.stocks) {
        const order = await ctx.prisma.stock
          .update({
            where: {
              id: stock.id,
            },
            data: {
              quantity: stock.quantity,
              ordered: stock.ordered,
              transit: stock.transit,
              pending: stock.pending,
              order: {
                create: {
                  quantity: stock.pending,
                  order: {
                    connectOrCreate: {
                      where: {
                        orderId: input.orderId,
                      },
                      create: {
                        orderId: input.orderId,
                        billingAddress: input.billingAddress,
                        shippingAddress: input.shippingAddress,
                        client: {
                          connect: {
                            name: input.clientName,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          })
          .catch((err) => {
            console.log(err);
            throw new Error("Error creating order");
          });
      }

      return {
        message: "Order created successfully",
      };
    }),
});
