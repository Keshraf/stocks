import { router, protectedProcedure } from "~/server/trpc";

export const getInvoicesRouter = router({
  getInvoices: protectedProcedure.query(async ({ ctx }) => {
    const companyId = ctx.user.company;

    if (!companyId) {
      throw new Error("User is not associated with a company");
    }

    const invoices = ctx.prisma.stockInvoice.findMany({
      where: {},
    });

    return {
      message: "Invoices returned successfully",
      data: invoices,
    };
  }),
});
