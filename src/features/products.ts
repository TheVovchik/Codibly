/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProducts } from '../api/api';
import { Product } from '../types/Product';

type ProductsState = {
  products: Product[];
  loading: boolean;
  error: string;
};

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: '',
};

export const init = createAsyncThunk('users/fetch', () => {
  return getProducts();
});

const ProductsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(init.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(init.fulfilled, (state, action) => {
      state.products = action.payload;
      state.loading = false;
    });

    builder.addCase(init.rejected, (state) => {
      state.loading = false;
      state.error = 'Something went wrong';
    });
  },
});

export default ProductsSlice.reducer;
