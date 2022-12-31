import { router, publicProcedure } from "../../trpc";
import { SigninUserSchema } from "~/types/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { env } from "~/env/server.mjs";
import { TRPCError } from "@trpc/server";

export const signinUserRouter = router({
  signinUser: publicProcedure
    .input(SigninUserSchema)
    .mutation(async ({ input, ctx }) => {
      console.log(input);
      const salt = bcrypt.genSaltSync();
      const { email, password } = input;

      const user = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              time: Date.now(),
            },
            env.JWT_SECRET,
            {
              expiresIn: "14h",
            }
          );

          ctx.res.setHeader(
            "Set-Cookie",
            cookie.serialize("STOCKS_ACCESS_TOKEN", token, {
              httpOnly: true,
              maxAge: 14 * 60 * 60,
              path: "/",
              sameSite: "lax",
              secure: env.NODE_ENV === "production",
            })
          );

          return user;
        } else {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Password doesn't match",
          });
        }
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User doesn't exist",
        });
      }
    }),
});