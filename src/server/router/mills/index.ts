import { mergeRouters } from "~/server/trpc";
import { getMillsRouter } from "./getMills";

export const millsRouter = mergeRouters(getMillsRouter);
