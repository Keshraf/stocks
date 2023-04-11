import { mergeRouters } from "../../trpc";
import { addPreorderRouter } from "./addPreorder";

export const preorderRouter = mergeRouters(addPreorderRouter);
