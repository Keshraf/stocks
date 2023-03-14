import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PrismaStockInvoice } from "~/types/stocks";

export type StockSchema = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  invoiceName: string;
  ordered: number;
  transit: number;
  quantity: number;
  bundle: number;
  specsId: string;
  invoice?: PrismaStockInvoice;
};

export type selectedSchema = {
  id: string;
  millName: string;
  qualityName: string;
  breadth: number;
  weight: number;
  length: number | null;
  gsm: number;
  sheets: number;
  stock?: StockSchema[];
};

type Bundles = {
  [key: number]: number;
};

type BundlePayload = {
  id: string;
  key: number;
  value: number;
};

export type InitalState = selectedSchema & {
  invoice: string;
  client: string;
  bundle: number;
  quantity: number;
  transit: number;
  ordered: number;
  rate: number;
  bundleSelected: Bundles;
};

type ChangeNumberPayload = {
  id: string;
  value: number;
  type: "bundle" | "quantity" | "transit" | "ordered" | "rate";
};
type ChangeStringPayload = {
  id: string;
  value: string;
  type: "invoice" | "client";
};

const initialState: InitalState[] = [];

export const selectedSpecsSlice = createSlice({
  name: "selectedSpecs",
  initialState,
  reducers: {
    addSelectedSpecs: (state, action: PayloadAction<selectedSchema>) => {
      let bundleSelected: Bundles = { 0: 0 };
      if (action.payload.stock && action.payload.stock.length > 0) {
        const availableBundles = new Set(
          action.payload.stock.map((item) => {
            if (item.quantity > 0) return item.bundle;
            if (item.transit > 0) return item.bundle;
            if (item.ordered > 0) return item.bundle;
            return -1;
          })
        );
        bundleSelected = Array.from(availableBundles)
          .filter((val) => val !== -1)
          .reduce((acc, item) => {
            return { ...acc, [item]: 0 };
          }, {});
      }

      state.push({
        ...action.payload,
        invoice: "",
        client: "",
        bundle: 0,
        quantity: 0,
        transit: 0,
        ordered: 0,
        rate: 0,
        bundleSelected,
      });
    },
    resetSelectedSpecs: (state) => {
      return [];
    },
    changeNumberSpecs: (state, action: PayloadAction<ChangeNumberPayload>) => {
      state.map((item) => {
        if (item.id === action.payload.id)
          item[action.payload.type] = action.payload.value;
      });
    },
    changeStringSpecs: (state, action: PayloadAction<ChangeStringPayload>) => {
      state.map((item) => {
        if (item.id === action.payload.id)
          item[action.payload.type] = action.payload.value;
      });
    },
    setAllClientSpecs: (state, action: PayloadAction<string>) => {
      state.map((item) => (item.client = action.payload));
    },
    setAllInvoiceSpecs: (state, action: PayloadAction<string>) => {
      state.map((item) => (item.invoice = action.payload));
    },
    removeSpecs: (state, action: PayloadAction<string>) => {
      state.forEach((item, index) => {
        if (item.id === action.payload) state.splice(index, 1);
      });
    },
    updateSelectedBundle: (state, action: PayloadAction<BundlePayload>) => {
      state.map((item) => {
        if (item.id === action.payload.id) {
          console.log("action.payload.value", action.payload.value);
          console.log(
            "item.bundleSelected[action.payload.key]",
            item.bundleSelected[action.payload.key]
          );
          item.bundleSelected[action.payload.key] = action.payload.value;
        }
      });
    },
  },
});

export const {
  addSelectedSpecs,
  resetSelectedSpecs,
  removeSpecs,
  setAllClientSpecs,
  setAllInvoiceSpecs,
  changeNumberSpecs,
  changeStringSpecs,
  updateSelectedBundle,
} = selectedSpecsSlice.actions;

export default selectedSpecsSlice.reducer;
