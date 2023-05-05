import { z } from "zod";
import { router, protectedProcedure } from "~/server/trpc";

export const deleteSpecsRouter = router({
  deleteSpecs: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      if (!input) {
        throw new Error("No input");
      }

      const stock = await ctx.prisma.specs
        .delete({
          where: {
            id: input,
          },
          include: {
            stock: true,
          },
        })
        .then((res) => {
          return {
            message: "Specs deleted successfully",
          };
        })
        .catch((err) => {
          console.log(err);
          return {
            message: "Error deleting specs",
          };
        });
    }),
});
