import { z } from "zod";

export const NewUserSchema = z
  .object({
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .min(3, { message: "Name must contain atleast 3 letters" })
      .trim(),
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .email({ message: "Invalid Email Address" })
      .trim(),
    company: z
      .string({
        required_error: "Company is required",
        invalid_type_error: "Company must be a string",
      })
      .min(3, { message: "Name must contain atleast 3 letters" })
      .trim(),
    password: z
      .string()
      .min(5, { message: "Password must contain atleast 5 letters" })
      .trim(),
    confirm: z.string().trim(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match!",
  });

export type NewUser = z.infer<typeof NewUserSchema>;

export const SigninUserSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Invalid Email Address" })
    .trim(),
  password: z
    .string()
    .min(5, { message: "Password must contain atleast 5 letters" })
    .trim(),
});

export type SigninUser = z.infer<typeof SigninUserSchema>;
