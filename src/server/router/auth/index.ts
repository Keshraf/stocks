import { router, publicProcedure, mergeRouters } from "../../trpc";
import { NewUserSchema } from "~/types/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { env } from "~/env/server.mjs";
import { createUserRouter } from "./createUser";
import { signinUserRouter } from "./signinUser";

export const authRouter = mergeRouters(createUserRouter, signinUserRouter);
