import { mergeRouters } from "../../trpc";
import { getSpecsRouter } from "./getSpecs";
import { getStocksRouter } from "./getStocks";
import { postStocksBulkRouter } from "./postStocksBulk";
import { addStockRouter } from "./addStocks";
import { getSpecByIdRouter } from "./getSpecById";
import { updateStocksQuantityRouter } from "./updateStocksQuantity";
import { getSpecsByIdsRouter } from "./getSpecsByIds";
import { deleteSpecsRouter } from "./deleteSpecs";
import { updateSpecsByIdRouter } from "./updateSpecsById";

export const stocksRouter = mergeRouters(
  getSpecsRouter,
  postStocksBulkRouter,
  getStocksRouter,
  getSpecByIdRouter,
  getSpecsByIdsRouter,
  updateStocksQuantityRouter,
  addStockRouter,
  deleteSpecsRouter,
  updateSpecsByIdRouter
);
