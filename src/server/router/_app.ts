import { router, protectedProcedure } from "../trpc";
import { authRouter } from "./auth";
import { clientsRouter } from "./clients";
import { stocksRouter } from "./stocks";

export const appRouter = router({
  auth: authRouter,
  getMe: protectedProcedure.query(({ ctx }) => {
    return {
      message: "Authorized!",
    };
  }),
  stocks: stocksRouter,
  clients: clientsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
