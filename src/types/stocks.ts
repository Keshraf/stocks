import { z } from "zod";

export const StockSchema = z.object({
  mill: z.string(),
  qualityName: z.string().trim(),
  breadth: z.number().positive(),
  length: z.number().nonnegative(),
  weight: z.number().positive(),
  gsm: z.number().positive(),
  sheets: z.number().nonnegative(),
  bundle: z.number().nonnegative(),
  quantity: z.number().nonnegative(),
  packets: z.number().nonnegative(),
});

export const StockArrSchema = z.array(StockSchema);

export type Stock = z.infer<typeof StockSchema>;
