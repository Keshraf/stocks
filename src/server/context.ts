import { PrismaClient } from "@prisma/client";
import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";
import { env } from "~/env/server.mjs";
/* import prisma from "../utils/prisma"; */

interface CtxUser extends jwt.JwtPayload {
  email: string;
  id: string;
  company: string;
}

const getUserFromCookie = (req: NextApiRequest) => {
  const token = req.cookies.STOCKS_ACCESS_TOKEN;
  if (token) {
    try {
      const verified = jwt.verify(token, env.JWT_SECRET);
      if (typeof verified === "string") {
        return null;
      }

      return verified;
    } catch (error) {
      return null;
    }
  }
  return null;
};

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const prisma = new PrismaClient();
  const user = getUserFromCookie(opts.req);
  return {
    req: opts.req,
    res: opts.res,
    prisma,
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
