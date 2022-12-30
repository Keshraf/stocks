import { router, publicProcedure } from "../../trpc";
import { NewUserSchema } from "~/types/user";

export const authRouter = router({
  createUser: publicProcedure
    .input(NewUserSchema)
    .mutation(({ input, ctx }) => {
      console.log(input);
    }),
});
