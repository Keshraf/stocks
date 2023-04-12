import { z } from "zod";
import { router, protectedProcedure } from "~/server/trpc";
import { NewClientSchema } from "~/types/clients";

export const addBulkClientRouter = router({
  addBulkClient: protectedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      const clients = await ctx.prisma.client.createMany({
        data: input.map((value) => {
          return {
            name: value,
            companyId,
          };
        }),
        skipDuplicates: true,
      });

      return {
        message: "Client added successfully",
        clients,
      };
    }),
});
