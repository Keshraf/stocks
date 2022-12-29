import { z } from "zod";
import connectDB from "~/utils/prisma";
import { publicProcedure, router, protectedProcedure } from "../trpc";

export const appRouter = router({
  hello: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input.text}`,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
