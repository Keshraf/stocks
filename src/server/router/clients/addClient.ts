import { router, protectedProcedure } from "~/server/trpc";
import { NewClientSchema } from "~/types/clients";

export const addClientRouter = router({
  addClient: protectedProcedure
    .input(NewClientSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      const client = await ctx.prisma.client.create({
        data: {
          ...input,
          companyId,
        },
      });

      return {
        message: "Client added successfully",
        client,
      };
    }),
});
