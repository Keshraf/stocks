import { z } from "zod";

export const NewClientSchema = z.object({
  name: z.string().min(3, { message: "Name must contain atleast 3 letters" }),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Invalid Email Address" })
    .optional(),
  mobile: z.number().optional(),
  address: z.array(z.string()),
  gst: z.string().optional(),
});

export type NewClientType = z.infer<typeof NewClientSchema>;
