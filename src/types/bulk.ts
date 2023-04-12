import { z } from "zod";

export const BulkStockSchema = z.object({
  mill: z.string(),
  qualityName: z.string().trim(),
  breadth: z.number().positive(),
  length: z.number().nonnegative().nullable(),
  weight: z.number().positive(),
  gsm: z.number().positive(),
  sheets: z.number().nonnegative(),
  quantity: z.number().nonnegative(),
  invoice: z.string().trim().min(3),
  rate: z.number(),
});

export const BulkStockSchemaArr = z.array(BulkStockSchema);
