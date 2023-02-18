import { router, protectedProcedure } from "~/server/trpc";

export const getClientsRouter = router({
  getClients: protectedProcedure.query(async ({ ctx }) => {
    const companyId = ctx.user.company;
    const clients = await ctx.prisma.client.findMany({
      where: {
        companyId,
      },
      include: {
        order: true,
      },
    });

    return clients;
  }),
});
