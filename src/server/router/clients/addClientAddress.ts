import { z } from "zod";
import { router, protectedProcedure } from "~/server/trpc";

const NewClientAddressSchema = z.object({
  client: z.string(),
  address: z.string(),
});

export const addClientAddressRouter = router({
  addClientAddress: protectedProcedure
    .input(NewClientAddressSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      const client = await ctx.prisma.client.update({
        where: {
          name: input.client,
        },
        data: {
          address: {
            push: input.address,
          },
        },
      });

      return {
        message: "Client added successfully",
        client,
      };
    }),
});
