import { mergeRouters } from "../../trpc";
import { getStocksRouter } from "./getStocks";
import { postStocksBulkRouter } from "./postStocksBulk";

export const stocksRouter = mergeRouters(getStocksRouter, postStocksBulkRouter);
