import { mergeRouters } from "../../trpc";
import { createOrderRouter } from "./createOrder";
import { getOrdersRouter } from "./getOrders";
import { createStockOrderRouter } from "./createStockOrder";
import { getOrderByIdRouter } from "./getOrderById";
import { shiftOrderRouter } from "./shiftOrder";

export const ordersRouter = mergeRouters(
  createOrderRouter,
  getOrdersRouter,
  createStockOrderRouter,
  getOrderByIdRouter,
  shiftOrderRouter
);
