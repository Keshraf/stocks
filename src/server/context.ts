import { PrismaClient } from "@prisma/client";
import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
/* import prisma from "../utils/prisma"; */

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const prisma = new PrismaClient();
  return {
    req: opts.req,
    res: opts.res,
    prisma,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
