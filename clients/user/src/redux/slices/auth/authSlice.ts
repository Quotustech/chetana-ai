import { Draft, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { login , getProfile , logout, getOrgs, getDepts, register } from "./authActions";
import { User } from "@/common/interfaces/user.interface";
import { Organization } from "@/common/interfaces/organization.interface";
import { Department } from "@/common/interfaces/department.interface";



type InitialState = {
  accessToken: string;
  isAuthenticated: boolean;
  authLoading: boolean;
  user: User;
  organizations: Organization[];
  departments: Department[]
};

const initialState: InitialState = {
  accessToken: "",
  isAuthenticated: false,
  authLoading: false,
  user: {} as User,
  organizations: [] as Organization[],
  departments: [] as Department[]
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setAccessToken(
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.accessToken>,
    ) {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
    setUser(
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.user>,
    ) {
      state.user = action.payload;
    },
    setAuthLoading(
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.authLoading>,
    ) {
      state.authLoading = action.payload;
    },
    removeAccessToken(state: Draft<typeof initialState>) {
      state.accessToken = "";
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder)=>{
    builder.addCase(login.fulfilled , (state , {payload})=>{
      state.accessToken = payload.data.token
      state.authLoading = false
    })
    .addCase(register.fulfilled , (state , {payload})=>{
      if (payload.success){
        state.organizations = [];
        state.departments = [];
      }
    })
    .addCase(getProfile.fulfilled , (state , {payload})=>{
      state.user = payload.data
    })
    .addCase(getOrgs.fulfilled , (state , {payload})=>{
      state.organizations = payload.data
    }).addCase(getDepts.fulfilled , (state , {payload})=>{
      state.departments = payload.data
    })
    .addCase(logout.fulfilled , (state, {payload})=>{
      if (payload.logout){
        state.accessToken = '';
        state.user = {} as User
      }
    })
  }
});

export const { setAccessToken, removeAccessToken ,setAuthLoading , setUser} = authSlice.actions;

export default authSlice.reducer;
