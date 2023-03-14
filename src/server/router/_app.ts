import { router, protectedProcedure } from "../trpc";
import { authRouter } from "./auth";
import { clientsRouter } from "./clients";
import { stocksRouter } from "./stocks";
import { millsRouter } from "./mills";
import { ordersRouter } from "./orders";
import { invoiceRouter } from "./invoices";

export const appRouter = router({
  auth: authRouter,
  getMe: protectedProcedure.query(({ ctx }) => {
    return {
      message: "Authorized!",
    };
  }),
  stocks: stocksRouter,
  clients: clientsRouter,
  mills: millsRouter,
  orders: ordersRouter,
  invoices: invoiceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
