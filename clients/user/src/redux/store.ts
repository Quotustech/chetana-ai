import {
    useDispatch as useDispatchBase,
    useSelector as useSelectorBase,
  } from "react-redux";
  
  import { configureStore } from "@reduxjs/toolkit";
  import authReducer from '@/redux/slices/auth/authSlice';
  import chatReducer from "@/redux/slices/chat/chatSlice";
  import transpilerReducer from '@/redux/slices/transpiler/transpilerSlice';
  import jobReducer from  "@/redux/slices/job/jobSlice";
  import questionReducer from "@/redux/slices/question/questionSlice"

  export const store = configureStore({
    reducer: {
      authReducer,
      chatReducer,
      transpilerReducer,
      jobReducer,
      questionReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      })
  });
  
  export type RootState = ReturnType<typeof store.getState>;
  
  type AppDispatch = typeof store.dispatch;
  
  export const useDispatch = () => useDispatchBase<AppDispatch>();
  
  export const useSelector = <TSelected = unknown>(
    selector: (state: RootState) => TSelected,
  ): TSelected => useSelectorBase<RootState, TSelected>(selector);
  