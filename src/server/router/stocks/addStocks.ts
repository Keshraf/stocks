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

      const e = [
        {
          gsm: 350,
          sheets: 100,
          breadth: 86.5,
          length: 73.5,
          weight: 22.3,
          qualityName: "APM",
          mill: "TN",
          quantity: 10,
          invoice: "001",
          rate: 0,
        },
        {
          gsm: 230,
          sheets: 144,
          breadth: 81,
          length: 66,
          weight: 17.7,
          qualityName: "LWC",
          mill: "UNI",
          quantity: 42,
          invoice: "001",
          rate: 0,
        },
        {
          gsm: 180,
          sheets: 144,
          breadth: 96.5,
          length: 61,
          weight: 15.3,
          qualityName: "LWC",
          mill: "UNI",
          quantity: 58.5,
          invoice: "001",
          rate: 0,
        },
        {
          gsm: 230,
          sheets: 144,
          breadth: 106,
          length: 72,
          weight: 25.3,
          qualityName: "PDB",
          mill: "UNI",
          quantity: 14,
          invoice: "001",
          rate: 0,
        },
        {
          gsm: 250,
          sheets: 144,
          breadth: 52,
          length: 71,
          weight: 13.3,
          qualityName: "PDB",
          mill: "UNI",
          quantity: 66,
          invoice: "001",
          rate: 0,
        },
        {
          gsm: 250,
          sheets: 144,
          breadth: 58.5,
          length: 66,
          weight: 13.9,
          qualityName: "PDB",
          mill: "UNI",
          quantity: 160,
          invoice: "001",
          rate: 0,
        },
        {
          gsm: 230,
          sheets: 144,
          breadth: 58.5,
          length: 98.5,
          weight: 19.1,
          qualityName: "PDB",
          mill: "UNI",
          quantity: 40,
          invoice: "001",
          rate: 0,
        },
        {
          gsm: 390,
          sheets: 144,
          breadth: 43.5,
          length: 48.5,
          weight: 11.8,
          qualityName: "KGB PR",
          mill: "VP",
          quantity: 140,
          invoice: "001",
          rate: 0,
        },
        {
          gsm: 320,
          sheets: 144,
          breadth: 52,
          length: 88,
          weight: 21.1,
          qualityName: "KGB PR",
          mill: "VP",
          quantity: 29,
          invoice: "001",
          rate: 0,
        },
        {
          gsm: 390,
          sheets: 144,
          breadth: 56,
          length: 71,
          weight: 22.3,
          qualityName: "KGB PR",
          mill: "VP",
          quantity: 67,
          invoice: "001",
          rate: 0,
        },
      ];

      const createStock = async (value: AddStock) => {
        const stock = await ctx.prisma.stock
          .create({
            data: {
              ordered: value.quantity,
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
                      length: value.length ? value.length : 0,
                      weight: value.weight,
                      gsm: value.gsm,
                      sheets: value.sheets,
                    },
                  },
                  create: {
                    breadth: value.breadth,
                    length: value.length ? value.length : 0,
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
