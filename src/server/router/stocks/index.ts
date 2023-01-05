import { mergeRouters } from "../../trpc";
import { getStocksRouter } from "./getStocks";

export const stocksRouter = mergeRouters(getStocksRouter);
