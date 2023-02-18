import { router, protectedProcedure } from "~/server/trpc";
import { z } from "zod";

export const getClientByIdRouter = router({
  getClientById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.id === "") {
        return null;
      }

      const client = await ctx.prisma.client.findUnique({
        where: {
          id: input.id,
        },
        include: {
          order: true,
        },
      });

      return client;
    }),
});
