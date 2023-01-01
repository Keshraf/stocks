import { z } from "zod";
import connectDB from "~/utils/prisma";
import { publicProcedure, router, protectedProcedure } from "../trpc";
import { authRouter } from "./auth";

export const appRouter = router({
  auth: authRouter,
  check: protectedProcedure.mutation(({ ctx }) => {
    return ctx.user;
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
