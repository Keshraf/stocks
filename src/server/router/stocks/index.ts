import { mergeRouters } from "../../trpc";
import { getStocksRouter } from "./getStocks";
import { postStocksBulkRouter } from "./postStocksBulk";
import { addStockRouter } from "./addStocks";

export const stocksRouter = mergeRouters(
  getStocksRouter,
  postStocksBulkRouter,
  addStockRouter
);
