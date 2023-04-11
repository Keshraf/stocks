import { z } from "zod";

export const CreateStockOrderSchema = z.object({
  quantity: z.number().nonnegative(),
  rate: z.number().nonnegative(),
  stockId: z.string(),
  orderId: z.string(),
});

export const CreateOrderSchema = z.object({
  billingAddress: z.string().min(3, { message: "Billing address not given" }),
  shippingAddress: z.string().min(3, { message: "Shipping address not given" }),
  clientName: z.string().min(2),
  shippingClientName: z.string().min(2),
  orderId: z.string().min(3, { message: "Order ID is too short!" }),
  orderDate: z.date().nullable(),
});

export const StockOrderSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  pending: z.number().nonnegative(),
  billed: z.number().nonnegative(),
  shipped: z.number().nonnegative(),
  rate: z.number().nonnegative(),
  stockId: z.string(),
  orderId: z.string(),
});

export const ImportedOrderSchema = z.object({
  id: z.string(),
  orderId: z.string().min(3, { message: "Order ID is too short!" }),
  billingAddress: z.string().min(3, { message: "Billing address not given" }),
  shippingAddress: z.string().min(3, { message: "Shipping address not given" }),
  clientName: z.string().min(2),
  shippingClientName: z.string().min(2),
  createdAt: z.date(),
  updatedAt: z.date(),
  orderDate: z.date(),
  stockOrder: z.array(StockOrderSchema),
});

export type CreateStockOrderType = z.infer<typeof CreateStockOrderSchema>;
export type CreateOrderType = z.infer<typeof CreateOrderSchema>;
export type ImportedOrderType = z.infer<typeof ImportedOrderSchema>;
export type StockOrderType = z.infer<typeof StockOrderSchema>;
