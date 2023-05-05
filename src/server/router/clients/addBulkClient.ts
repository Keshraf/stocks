import { z } from "zod";
import { router, protectedProcedure } from "~/server/trpc";

const NewClientSchemaArr = z.array(
  z.object({
    name: z.string(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    gst: z.string().optional(),
  })
);

export const addBulkClientRouter = router({
  addBulkClient: protectedProcedure
    .input(NewClientSchemaArr)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.user.company;

      if (!companyId) {
        throw new Error("User is not associated with a company");
      }

      const clients = await ctx.prisma.client.createMany({
        data: input.map((value) => {
          return {
            name: value.name,
            address: value.address ? value.address : "",
            mobile: value.phone ? value.phone : "",
            email: value.email ? value.email : "",
            gst: value.gst ? value.gst : "",
            companyId,
          };
        }),
        skipDuplicates: true,
      });

      return {
        message: "Client added successfully",
        clients,
      };
    }),
});
