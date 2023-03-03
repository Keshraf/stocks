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
  invoice: z.string().trim().min(3),
});

export const AddStockSchema = StockSchema.extend({
  transit: z.number().nonnegative(),
  ordered: z.number().nonnegative(),
  client: z.string().trim().optional(),
});

export interface PrismaQuality {
  id: string;
  name: string;
  millName: string;
  createdAt: Date;
  updatedAt: Date;
  mill?: PrismaMill;
}

export interface PrismaMill {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
  quality?: PrismaQuality[];
}

export interface PrismaSpecs {
  id: string;
  qualityName: string;
  breadth: number;
  length: number | null;
  weight: number;
  gsm: number;
  sheets: number;
  createdAt: Date;
  updatedAt: Date;
  quality: PrismaQuality;
  stock?: PrismaStock[];
  order?: PrismaOrder[];
}

export interface PrismaStock {
  id: string;
  quantity: number;
  transit: number;
  ordered: number;
  bundle: number;
  pending: number;
  billed: number;
  shipped: number;
  invoiceName: string;
  invoice?: PrismaStockInvoice[];
  order?: PrismaStockOrder[];
  createdAt: Date;
  updatedAt: Date;
  specsId: string;
  specs?: PrismaSpecs[];
}

export interface PrismaStockOrder {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  orderId: string;
  stockId: string;
  order: PrismaOrder;
  stock: PrismaStock;
  quanity: number;
  remark?: Remark[];
}

export interface Remark {
  id: string;
  remark: string;
  createdAt: Date;
  updatedAt: Date;
  stockorderId: string;
  stockorder: PrismaStockOrder;
}

export interface PrismaStockInvoice {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  invoice: string;
  stock: Stock[];
  clientId: string | null;
  client: PrismaDataClient[] | null;
}

export interface PrismaOrder {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  clientId: string;
  billingAddress: string;
  shippingAddress: string;
  client?: PrismaDataClient;
  stockorder?: PrismaStockOrder[];
}

export interface PrismaDataClient {
  id: string;
  name: string;
  address: string[];
  mobile: string | null;
  email: string | null;
  gst: string | null;
  order?: PrismaOrder[];
  createdAt: Date;
  updatedAt: Date;
  stockinvoice?: PrismaStockInvoice[];
}

export const StockUpdateSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  from: z.enum(["transit", "ordered", "quantity"]),
  to: z.enum(["transit", "ordered", "quantity"]),
});

export type StockUpdate = z.infer<typeof StockUpdateSchema>;

export const StockArrSchema = z.array(StockSchema);

export type Stock = z.infer<typeof StockSchema>;
export type AddStock = z.infer<typeof AddStockSchema>;
