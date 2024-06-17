import { Draft, PayloadAction, createSlice } from "@reduxjs/toolkit";

import { authState } from "../states/authState";
import { login } from "../actions/authActions";

const AuthSlice = createSlice({
  name: "authSlice",
  initialState: authState,
  reducers: {
    setAccessToken(
      state: Draft<typeof authState>,
      action: PayloadAction<(typeof authState)["accessToken"]>
    ) {
      state.accessToken = action.payload;
    },
    setUser(
      state: Draft<typeof authState>,
      action: PayloadAction<(typeof authState)["user"]>
    ) {
      state.user = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(login.fulfilled , (state , {payload})=>{
      state.accessToken = payload.data.token
    })
  },
});

export const { setAccessToken, setUser } = AuthSlice.actions;

export default AuthSlice.reducer;
