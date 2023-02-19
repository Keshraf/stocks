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

const initialState: selectedSchema[] = [];

export const selectedStockSlice = createSlice({
  name: "selectedStock",
  initialState,
  reducers: {
    addSelectedStock: (state, action: PayloadAction<selectedSchema>) => {
      state.push(action.payload);
    },
    resetSelectedStock: (state) => {
      return [];
    },
    removeStock: (state, action: PayloadAction<string>) => {
      state.forEach((item, index) => {
        if (item.id === action.payload) state.splice(index, 1);
      });
    },
  },
});

export const { addSelectedStock, resetSelectedStock, removeStock } =
  selectedStockSlice.actions;

export default selectedStockSlice.reducer;
