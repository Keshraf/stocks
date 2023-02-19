import { z } from "zod";

export const NewClientSchema = z.object({
  name: z.string().min(3, { message: "Name must contain atleast 3 letters" }),
  email: z
    .union([
      z
        .string({
          required_error: "Email is required",
          invalid_type_error: "Email must be a string",
        })
        .email({
          message: "Email must be a valid email",
        }),
      z.string().length(0),
    ])
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
  mobile: z
    .union([
      z.string().length(10, {
        message: "Mobile number must be 10 digits",
      }),
      z.string().length(0),
    ])
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
  address: z.array(z.string()),
  gst: z.string().optional(),
});

export const ClientWithIdSchema = NewClientSchema.extend({
  id: z.string(),
});

export type NewClientType = z.infer<typeof NewClientSchema>;
export type ClientWithIdType = z.infer<typeof ClientWithIdSchema>;
