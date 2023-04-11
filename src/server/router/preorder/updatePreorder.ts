import { z } from "zod";
import { protectedProcedure, router } from "~/server/trpc";
import { AddPreorderSchema } from "~/types/preorder";

const UpdatePreorderSchema = z.object({
  id: z.string(),
  status: z.enum(["pending", "confirmed", "cancelled"]),
});

export const addPreorderRouter = router({
  addPreorder: protectedProcedure
    .input(UpdatePreorderSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;
      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      console.log("INPUT: ", input);

      if (!input) {
        throw new Error("No input");
      }

      const preorder = await ctx.prisma.preorder.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });

      return {
        message: "Preorder added successfully",
        preorder,
      };
    }),
});
