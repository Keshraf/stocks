import { router, protectedProcedure } from "~/server/trpc";
import { AddStockSchema } from "~/types/stocks";

export const addStockRouter = router({
  addStock: protectedProcedure
    .input(AddStockSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      const stock = await ctx.prisma.stock
        .create({
          data: {
            quantity: input.quantity,
            bundle: input.bundle,
            transit: input.transit,
            ordered: input.ordered,
            invoice: {
              connectOrCreate: {
                where: {
                  invoice: input.invoice.toUpperCase(),
                },
                create: {
                  invoice: input.invoice.toUpperCase(),
                  clientName:
                    input.client !== "" || input.client !== null
                      ? input.client
                      : null,
                },
              },
            },
            specs: {
              connectOrCreate: {
                where: {
                  qualityName_breadth_length_weight_gsm_sheets: {
                    qualityName: input.qualityName,
                    breadth: input.breadth,
                    length: input.length,
                    weight: input.weight,
                    gsm: input.gsm,
                    sheets: input.sheets,
                  },
                },
                create: {
                  breadth: input.breadth,
                  length: input.length,
                  weight: input.weight,
                  gsm: input.gsm,
                  sheets: input.sheets,
                  quality: {
                    connectOrCreate: {
                      where: {
                        name: input.qualityName,
                      },
                      create: {
                        name: input.qualityName,
                        mill: {
                          connectOrCreate: {
                            where: {
                              name: input.mill,
                            },
                            create: {
                              name: input.mill,
                              company: {
                                connect: {
                                  id: companyId,
                                },
                              },
                            },
                          },
                        },
                        companyId: companyId,
                      },
                    },
                  },
                },
              },
            },
          },
        })
        .catch((err) => {
          /* console.log(err); */
          throw new Error("Error adding stock");
        });

      return {
        message: "Stock added successfully",
        stock,
      };
    }),
});
