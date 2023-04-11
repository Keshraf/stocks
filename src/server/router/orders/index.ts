import { mergeRouters } from "../../trpc";
import { createOrderRouter } from "./createOrder";
import { getOrdersRouter } from "./getOrders";
import { createStockOrderRouter } from "./createStockOrder";
import { getOrderByIdRouter } from "./getOrderById";

export const ordersRouter = mergeRouters(
  createOrderRouter,
  getOrdersRouter,
  createStockOrderRouter,
  getOrderByIdRouter
);
