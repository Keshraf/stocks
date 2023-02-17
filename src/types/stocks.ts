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
  fullname?: string | null;
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
  bundle?: number | null;
  createdAt: Date;
  updatedAt: Date;
  specsId: string;
  specs?: PrismaSpecs[];
};

export type PrismaOrder = {
  id: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  specsId: string;
  clientId: string;
  billingAddress: string;
  shippingAddress: string;
  specs?: PrismaSpecs[];
  client?: PrismaDataClient[];
};

export type PrismaDataClient = {
  id: string;
  name: string;
  address: string[];
  mobile: bigint | null;
  email: string | null;
  gst: string | null;
  order?: PrismaOrder[];
  createdAt: Date;
  updatedAt: Date;
};

export const StockArrSchema = z.array(StockSchema);

export type Stock = z.infer<typeof StockSchema>;
