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
  invoice: z.string().trim().length(3),
});

export const AddStockSchema = StockSchema.extend({
  transit: z.number().nonnegative(),
  ordered: z.number().nonnegative(),
  client: z.string().trim().optional(),
});

export type PrismaQuality = {
  id: string;
  name: string;
  millName: string;
  createdAt: Date;
  updatedAt: Date;
  mill?: PrismaMill;
};

export type PrismaMill = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
  quality?: PrismaQuality[];
};

export type PrismaSpecs = {
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
};

export type PrismaStock = {
  id: string;
  quantity: number;
  transit: number;
  ordered: number;
  bundle: number;
  invoiceName: string;
  invoice: PrismaStockInvoice[];
  order?: PrismaStockOrder[];
  createdAt: Date;
  updatedAt: Date;
  specsId: string;
  specs: PrismaSpecs[];
};

export type PrismaStockOrder = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  orderId: string;
  stockId: string;
  order: PrismaOrder;
  stock: PrismaStock;
  quanity: number;
  remark?: Remark[];
};

export type Remark = {
  id: string;
  remark: string;
  createdAt: Date;
  updatedAt: Date;
  stockorderId: string;
  stockorder: PrismaStockOrder;
};

export type PrismaStockInvoice = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  invoice: string;
  stock: Stock[];
  clientId: string | null;
  client: PrismaDataClient[] | null;
};

export type PrismaOrder = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  clientId: string;
  billingAddress: string;
  shippingAddress: string;
  client?: PrismaDataClient;
  stockorder?: PrismaStockOrder[];
};

export type PrismaDataClient = {
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
};

export const StockArrSchema = z.array(StockSchema);

export type Stock = z.infer<typeof StockSchema>;
export type AddStock = z.infer<typeof AddStockSchema>;
