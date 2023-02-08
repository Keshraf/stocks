import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./context";
import superjson from "superjson";
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});
// Base router and procedure helpers
const isAuthed = t.middleware(async ({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (!ctx.user.company) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const company = await ctx.prisma.company.findUnique({
    where: {
      id: ctx.user.company,
    },
  });

  if (!company) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

const isAuthedAdmin = t.middleware(async ({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (!ctx.user.company) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (!ctx.user.email) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = await ctx.prisma.user.findUnique({
    where: {
      email: ctx.user.email,
    },
  });

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const router = t.router;
export const mergeRouters = t.mergeRouters;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const protectedAdminProcedure = t.procedure.use(isAuthedAdmin);
