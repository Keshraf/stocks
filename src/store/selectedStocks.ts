import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SelectedStocksSchema = {
  id: string;
  ordered: number;
  transit: number;
  quantity: number;
  bundle: number;
  breadth: number;
  length: number | null;
  gsm: number;
  sheets: number;
  weight: number;
  qualityName: string;
  millName: string;
  invoice: string;
  client: string;
};

type ChangeNumberPayload = {
  id: string;
  value: number;
  type: "amount";
};
type ChangeStringPayload = {
  id: string;
  value: "Ordered" | "Godown" | "Transit";
  type: "from" | "to";
};

export type InitialState = SelectedStocksSchema & {
  from: "Ordered" | "Godown" | "Transit";
  to: "Ordered" | "Godown" | "Transit";
  amount: number;
};

const initialState: InitialState[] = [];

export const selectedStocksSlice = createSlice({
  name: "selectedStock",
  initialState,
  reducers: {
    addSelectedStocks: (state, action: PayloadAction<SelectedStocksSchema>) => {
      state.push({
        ...action.payload,
        from: "Ordered",
        to: "Transit",
        amount: 0,
      });
    },
    changeNumberStocks: (state, action: PayloadAction<ChangeNumberPayload>) => {
      state.map((item) => {
        if (item.id === action.payload.id)
          item[action.payload.type] = action.payload.value;
      });
    },
    changeStringStocks: (state, action: PayloadAction<ChangeStringPayload>) => {
      state.map((item) => {
        if (item.id === action.payload.id)
          item[action.payload.type] = action.payload.value;
      });
    },
    resetSelectedStocks: () => {
      return [];
    },
    removeStocks: (state, action: PayloadAction<string>) => {
      state.forEach((item, index) => {
        if (item.id === action.payload) state.splice(index, 1);
      });
    },
  },
});

export const {
  addSelectedStocks,
  removeStocks,
  resetSelectedStocks,
  changeNumberStocks,
  changeStringStocks,
} = selectedStocksSlice.actions;

export default selectedStocksSlice.reducer;
