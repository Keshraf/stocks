import { z } from "zod";
import { router, protectedProcedure } from "~/server/trpc";

const UpdateStockSchema = z.object({
  id: z.array(z.string()),
  salesOrderNo: z.string(),
});

export const updateStockSalesOrderNoRouter = router({
  updateStockSalesOrderNo: protectedProcedure
    .input(UpdateStockSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      if (!input) {
        throw new Error("No input");
      }

      const updatedStock = await ctx.prisma.stock
        .updateMany({
          where: {
            id: {
              in: input.id,
            },
          },
          data: {
            salesOrderNo: input.salesOrderNo,
          },
        })
        .then((res) => {
          return {
            message: "Stock updated successfully",
          };
        })
        .catch((err) => {
          console.log(err);
          return {
            message: "Error updating stock",
          };
        });
    }),
});
