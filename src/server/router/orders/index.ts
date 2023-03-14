import { mergeRouters } from "../../trpc";
import { createOrderRouter } from "./createOrder";
import { getOrdersRouter } from "./getOrders";

export const ordersRouter = mergeRouters(createOrderRouter, getOrdersRouter);
