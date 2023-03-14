import { z } from "zod";

export const CreateOrderSchema = z.object({
  orderId: z.string().min(3, { message: "Order ID is too short!" }),
  billingAddress: z.string().min(3, { message: "Billing address not given" }),
  shippingAddress: z.string().min(3, { message: "Shipping address not given" }),
  clientName: z.string().min(2),
  stocks: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().nonnegative(),
      transit: z.number().nonnegative(),
      ordered: z.number().nonnegative(),
      pending: z.number().positive(),
    })
  ),
});

export const ImportedOrderSchema = z.object({
  id: z.string(),
  orderId: z.string().min(3, { message: "Order ID is too short!" }),
  billingAddress: z.string().min(3, { message: "Billing address not given" }),
  shippingAddress: z.string().min(3, { message: "Shipping address not given" }),
  clientName: z.string().min(2),
  createdAt: z.date(),
  updatedAt: z.date(),
  stockOrder: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().nonnegative(),
      createdAt: z.date(),
      updatedAt: z.date(),
      stockId: z.string(),
      status: z.string(),
      stock: z.object({
        id: z.string(),
        quantity: z.number().nonnegative(),
        transit: z.number().nonnegative(),
        ordered: z.number().nonnegative(),
        pending: z.number().positive(),
        billed: z.number().nonnegative(),
        shipped: z.number().nonnegative(),
        invoiceName: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
        specsId: z.string(),
        specs: z.object({
          id: z.string(),
          breadth: z.number().nonnegative(),
          gsm: z.number().nonnegative(),
          length: z.number().nonnegative().nullable(),
          sheets: z.number().nonnegative(),
          weight: z.number().nonnegative(),
          qualityName: z.string(),
          quality: z.object({
            millName: z.string(),
          }),
        }),
      }),
    })
  ),
});

export type CreateOrderType = z.infer<typeof CreateOrderSchema>;
export type ImportedOrderType = z.infer<typeof ImportedOrderSchema>;
