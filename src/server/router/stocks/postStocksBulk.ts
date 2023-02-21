import { protectedProcedure, router } from "~/server/trpc";
import { StockSchema, StockArrSchema } from "~/types/stocks";

interface Mill {
  [key: string]: string;
}

const millsName: Mill = {
  SH: "SAHOTA PAPERS LIMITED",
  EDI: "EDICON PAPER PRODUCTS PRIVATE LIMITED ",
  VP: " VISHAL PAPERTECH (INDIA) LTD",
  KD: "KAILASHIDEVI PULPS & PAPER PRODUCTS",
  EM: "EMAMI PAPER MILLS LIMITED",
  DP: "DIYAN PAPERS LLP",
  TN: "TAMILNADU NEWSPRINT AND PAPERS LIMITED",
  LEM: "LEMIT PAPERS LLP",
  DS: "DEEVYA SHAKTI INDIA PRIVATE LIMITED",
  UNI: "UNIGLOBAL PAPERS PRIVATE LIMITED",
};

export const postStocksBulkRouter = router({
  postStocksBulk: protectedProcedure
    .input(StockArrSchema)
    .mutation(async ({ input, ctx }) => {
      console.log(ctx);

      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      const mills = await ctx.prisma.mill.createMany({
        data: input.map((stock) => ({
          name: stock.mill,
          companyId,
          fullname: millsName[stock.mill] || stock.mill,
        })),
        skipDuplicates: true,
      });

      const qualities = await ctx.prisma.quality.createMany({
        data: input.map((stock) => ({
          name: stock.qualityName,
          millName: stock.mill,
          companyId,
        })),
        skipDuplicates: true,
      });

      input.forEach(async (stock) => {
        await ctx.prisma.specs.create({
          data: {
            qualityName: stock.qualityName,
            breadth: stock.breadth,
            length: stock.length || undefined,
            sheets: stock.sheets,
            weight: stock.weight,
            gsm: stock.gsm,
            stock: {
              create: {
                quantity: stock.quantity,
                bundle: stock.bundle,
                invoice: {
                  connectOrCreate: {
                    where: {
                      invoice: stock.invoice,
                    },
                    create: {
                      invoice: stock.invoice,
                    },
                  },
                },
              },
            },
          },
        });
      });

      return {
        message: "Stocks added successfully",
      };
    }),
});
