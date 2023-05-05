import { mergeRouters } from "../../trpc";
import { createOrderRouter } from "./createOrder";
import { getOrdersRouter } from "./getOrders";
import { createStockOrderRouter } from "./createStockOrder";
import { getOrderByIdRouter } from "./getOrderById";
import { shiftOrderRouter } from "./shiftOrder";
import { deleteOrderRouter } from "./deleteOrder";
import { updateStockOrderRouter } from "./updateStockOrder";
import { deleteStockOrderRouter } from "./deleteStockOrder";
import { updateOrderRouter } from "./updateOrder";

export const ordersRouter = mergeRouters(
  createOrderRouter,
  getOrdersRouter,
  createStockOrderRouter,
  getOrderByIdRouter,
  shiftOrderRouter,
  deleteOrderRouter,
  updateStockOrderRouter,
  deleteStockOrderRouter,
  updateOrderRouter
);
