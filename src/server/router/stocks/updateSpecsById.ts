import { z } from "zod";
import { router, protectedProcedure } from "~/server/trpc";

const UpdateStockSchema = z.object({
  id: z.string(),
  breadth: z.number(),
  length: z.number(),
  weight: z.number(),
  sheets: z.number(),
  gsm: z.number(),
});

export const updateSpecsByIdRouter = router({
  updateSpecsById: protectedProcedure
    .input(UpdateStockSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      if (!input) {
        throw new Error("No input");
      }

      const updatedSpec = await ctx.prisma.specs
        .update({
          where: {
            id: input.id,
          },
          data: {
            breadth: input.breadth,
            length: input.length,
            weight: input.weight,
            sheets: input.sheets,
            gsm: input.gsm,
          },
        })
        .then((res) => {
          return {
            message: "Specs updated successfully",
          };
        })
        .catch((err) => {
          console.log(err);
          return {
            message: "Error updating specs",
          };
        });
    }),
});
