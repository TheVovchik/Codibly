/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types/Product';

type FiltredState = {
  filtred: Product[];
  visible: Product[];
  query: string;
  page: number;
  rowsPerPage: number;
};

const initialState: FiltredState = {
  filtred: [],
  visible: [],
  query: '',
  page: 0,
  rowsPerPage: 5,
};

const FiltredSlice = createSlice({
  name: 'filtred',
  initialState,
  reducers: {
    addQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload.replace(/\D/g, ''); // filter user input to leave only digits
    },
    setFiltred: (state, action: PayloadAction<Product[]>) => {
      let filtredProducts = action.payload;

      if (state.query) {
        filtredProducts = action.payload
          .filter(product => product.id === +state.query);
      }

      state.filtred = filtredProducts;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setRows: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
    },
    setVisible: (state) => {
      const start = state.rowsPerPage * state.page;
      let end = start + state.rowsPerPage;

      end = end > state.filtred.length ? state.filtred.length : end;

      state.visible = state.filtred
        .slice(start, end);
    },
  },
});

export default FiltredSlice.reducer;
export const { actions } = FiltredSlice;
