import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type selectedSchema = {
  id: string;
  millName: string;
  qualityName: string;
  breadth: number;
  weight: number;
  length: number;
  gsm: number;
  sheets: number;
};

export type InitalState = selectedSchema & {
  invoice: string;
  client: string;
  bundle: number;
  quantity: number;
  transit: number;
  ordered: number;
};

type ChangeNumberPayload = {
  id: string;
  value: number;
  type: "bundle" | "quantity" | "transit" | "ordered";
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
      state.push({
        ...action.payload,
        invoice: "",
        client: "",
        bundle: 0,
        quantity: 0,
        transit: 0,
        ordered: 0,
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
} = selectedSpecsSlice.actions;

export default selectedSpecsSlice.reducer;
