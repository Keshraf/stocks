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

const isAuthed = t.middleware(({ next, ctx }) => {
  console.log(ctx);

  return next({
    ctx: {
      // Infers the `session` as non-nullable
      session: true,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
