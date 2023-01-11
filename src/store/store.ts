import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import filtred from '../features/filtred';
import products from '../features/products';
import selected from '../features/selected';

export const store = configureStore({
  reducer: {
    filtred,
    products,
    selected,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

/* eslint-disable @typescript-eslint/indent */
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
