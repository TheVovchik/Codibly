/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types/Product';

type SelectedState = {
  selected: Product | null;
  selectedId: number;
};

const initialState: SelectedState = {
  selected: null,
  selectedId: 0,
};

const SelectedSlice = createSlice({
  name: 'selected',
  initialState,
  reducers: {
    addSelected: (state, action: PayloadAction<Product>) => {
      state.selected = action.payload;
      state.selectedId = action.payload.id;
    },
    removeSelected: (state) => {
      state.selected = null;
      state.selectedId = 0;
    },
    setSelectedId: (state, action: PayloadAction<number>) => {
      state.selectedId = action.payload;
    },
    initiateSelected: (state, action: PayloadAction<Product>) => {
      state.selected = action.payload;
    },
  },
});

export default SelectedSlice.reducer;
export const { actions } = SelectedSlice;
