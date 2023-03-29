import { z } from "zod";
import { router, protectedProcedure } from "~/server/trpc";
import { AddStockSchemaArr, type AddStock } from "~/types/stocks";

export const addStockRouter = router({
  addStock: protectedProcedure
    .input(AddStockSchemaArr)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      console.log("INPUT: ", input);

      if (!input) {
        throw new Error("No input");
      }

      const createStock = async (value: AddStock) => {
        const stock = await ctx.prisma.stock
          .create({
            data: {
              client:
                value.client && value.client !== ""
                  ? {
                      connect: {
                        name: value.client,
                      },
                    }
                  : undefined,
              quantity: value.quantity,
              rate: value.rate,
              invoice: {
                connectOrCreate: {
                  where: {
                    invoice: value.invoice.toUpperCase(),
                  },
                  create: {
                    invoice: value.invoice.toUpperCase(),
                  },
                },
              },
              specs: {
                connectOrCreate: {
                  where: {
                    qualityName_breadth_length_weight_gsm_sheets: {
                      qualityName: value.qualityName,
                      breadth: value.breadth,
                      length: value.length,
                      weight: value.weight,
                      gsm: value.gsm,
                      sheets: value.sheets,
                    },
                  },
                  create: {
                    breadth: value.breadth,
                    length: value.length,
                    weight: value.weight,
                    gsm: value.gsm,
                    sheets: value.sheets,
                    quality: {
                      connectOrCreate: {
                        where: {
                          name: value.qualityName,
                        },
                        create: {
                          name: value.qualityName,
                          mill: {
                            connectOrCreate: {
                              where: {
                                name: value.mill,
                              },
                              create: {
                                name: value.mill,
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
            console.log("Error adding stock: ", err);
            throw new Error("Error adding stock: ", err);
          });

        return stock;
      };

      const stocks = [];
      for (let i = 0; i < input.length; i++) {
        if (!input[i] || input[i] === null || input[i] === undefined) {
          continue;
        } else {
          stocks.push(await createStock(input[i] as AddStock));
        }
      }

      return {
        message: "Stock added successfully",
        stocks,
      };
    }),
});
