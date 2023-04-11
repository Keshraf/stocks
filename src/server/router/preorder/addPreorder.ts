import { z } from "zod";
import { protectedProcedure, router } from "~/server/trpc";
import { AddPreorderInput, AddPreorderSchema } from "~/types/preorder";

export const addPreorderRouter = router({
  addPreorder: protectedProcedure
    .input(z.array(AddPreorderSchema))
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;
      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      console.log("INPUT: ", input);

      if (!input) {
        throw new Error("No input");
      }

      const createPreorder = async (input: AddPreorderInput) => {
        const preorder = await ctx.prisma.preorder.create({
          data: {
            client: {
              connect: {
                name: input.client,
              },
            },
            quantity: input.quantity,
            status: input.status,
            invoice: {
              connect: {
                invoice: input.invoiceName,
              },
            },
            specs: {
              connect: {
                qualityName_breadth_length_weight_gsm_sheets: {
                  qualityName: input.qualityName,
                  breadth: input.breadth,
                  length: input.length ? input.length : 0,
                  weight: input.weight,
                  gsm: input.gsm,
                  sheets: input.sheets,
                },
              },
            },
          },
        });

        return preorder;
      };

      const preorders = [];
      for (let i = 0; i < input.length; i++) {
        if (!input[i] || input[i] === null || input[i] === undefined) {
          continue;
        } else {
          preorders.push(await createPreorder(input[i] as AddPreorderInput));
        }
      }

      return {
        message: "Preorder added successfully",
        preorders,
      };
    }),
});
