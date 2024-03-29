import { router, publicProcedure } from "../../trpc";
import { NewUserSchema } from "~/types/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { env } from "~/env/server.mjs";
import { TRPCError } from "@trpc/server";

export const createUserRouter = router({
  createUser: publicProcedure
    .input(NewUserSchema)
    .mutation(async ({ input, ctx }) => {
      console.log(input);
      const salt = bcrypt.genSaltSync();
      const { name, email, password, company } = input;
      let user;
      try {
        user = await ctx.prisma.user.create({
          data: {
            name,
            email,
            password: bcrypt.hashSync(password, salt),
            company: {
              create: {
                name: company,
              },
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "User already exists!",
        });
      }

      const companyData = await ctx.prisma.company.findUnique({
        where: {
          userEmail: user.email,
        },
      });

      const token = jwt.sign(
        {
          email: user.email,
          id: user.id,
          company: companyData?.id,
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
          httpOnly: false,
          maxAge: 14 * 60 * 60,
          path: "/",
          sameSite: "lax",
          secure: env.NODE_ENV === "production",
        })
      );

      return user;
    }),
});
