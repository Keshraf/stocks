import { mergeRouters } from "../../trpc";
import { createUserRouter } from "./createUser";
import { signinUserRouter } from "./signinUser";

export const authRouter = mergeRouters(createUserRouter, signinUserRouter);
