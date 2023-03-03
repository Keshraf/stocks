import { mergeRouters } from "../../trpc";
import { createOrderRouter } from "./createOrder";

export const ordersRouter = mergeRouters(createOrderRouter);
