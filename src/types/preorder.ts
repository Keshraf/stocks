import { z } from "zod";

export const AddPreorderSchema = z.object({
  client: z.string(),
  quantity: z.number(),
  status: z.enum(["pending", "confirmed", "cancelled"]),
  qualityName: z.string().trim(),
  breadth: z.number().positive(),
  length: z.number().nonnegative().nullable(),
  weight: z.number().positive(),
  gsm: z.number().positive(),
  sheets: z.number().nonnegative(),
  invoiceName: z.string().trim().min(3),
});

export type AddPreorderInput = z.infer<typeof AddPreorderSchema>;
