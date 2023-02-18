import { router, protectedProcedure } from "~/server/trpc";
import { z } from "zod";

export const deleteClientByIdRouter = router({
  deleteClientById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.client.delete({
        where: {
          id: input.id,
        },
        include: {
          order: true,
        },
      });

      return {
        message: "Client deleted successfully",
      };
    }),
});
