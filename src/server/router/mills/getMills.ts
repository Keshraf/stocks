import { router, protectedProcedure } from "~/server/trpc";

export const getMillsRouter = router({
  getMills: protectedProcedure.query(async ({ ctx }) => {
    const companyId = ctx.user.company;
    const mills = await ctx.prisma.mill.findMany({
      where: {
        companyId,
      },
      include: {
        quality: true,
      },
    });

    return mills;
  }),
});
