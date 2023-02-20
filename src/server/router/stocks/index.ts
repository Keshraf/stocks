import { mergeRouters } from "../../trpc";
import { getSpecsRouter } from "./getSpecs";
import { getStocksRouter } from "./getStocks";
import { postStocksBulkRouter } from "./postStocksBulk";
import { addStockRouter } from "./addStocks";
import { getSpecByIdRouter } from "./getSpecById";

export const stocksRouter = mergeRouters(
  getSpecsRouter,
  postStocksBulkRouter,
  getStocksRouter,
  getSpecByIdRouter,
  addStockRouter
);
