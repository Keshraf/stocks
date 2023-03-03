import { z } from "zod";

export const CreateOrderSchema = z.object({
  orderId: z.string(),
  billingAddress: z.string(),
  shippingAddress: z.string(),
  clientName: z.string(),
  stocks: z.array(
    z.object({
      id: z.string(),
      quantity: z.number(),
      transit: z.number(),
      ordered: z.number(),
      pending: z.number(),
    })
  ),
});

export type CreateOrderType = z.infer<typeof CreateOrderSchema>;
