import { router, protectedProcedure } from "~/server/trpc";
import { ClientWithIdSchema } from "~/types/clients";

export const updateClientByIdRouter = router({
  updateClientById: protectedProcedure
    .input(ClientWithIdSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      const client = await ctx.prisma.client.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          email: input.email,
          mobile: input.mobile,
          address: input.address,
          gst: input.gst,
        },
      });

      return {
        message: "Client updated successfully",
        client,
      };
    }),
});
