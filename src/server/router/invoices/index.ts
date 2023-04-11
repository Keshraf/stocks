import { mergeRouters } from "../../trpc";
import { getInvoicesRouter } from "./getInvoices";

export const invoiceRouter = mergeRouters(getInvoicesRouter);
