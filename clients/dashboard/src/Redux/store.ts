'use client'
import {
    useDispatch as useDispatchBase,
    useSelector as useSelectorBase,
  } from "react-redux";
import  {authReducer, filterReducer ,organizationReducer ,superAdminReducer ,departmentReducer ,interviewReducer}  from "./slices";

import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

const store = configureStore({
    reducer:{
        authReducer,
        organizationReducer,
        superAdminReducer,
        departmentReducer,
        filterReducer,
        interviewReducer
    }
});



// Define the thunk type
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => useDispatchBase<AppDispatch>();

export const useSelector = <TSelected = unknown>(
  selector: (state: RootState) => TSelected
): TSelected => useSelectorBase<RootState, TSelected>(selector);

export default store;
