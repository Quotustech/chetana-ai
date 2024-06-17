import { Draft, PayloadAction, createSlice } from "@reduxjs/toolkit";

import { organizationState } from "../states/organizationState";
import { Department } from "@/src/common/interfaces/department.interface";
import { createDept, getOrgDepartments, getOrgUsers, getOrgUsersChats } from "../actions/organizationAction";
import { Chat } from "@/src/common/interfaces/chat.interface";

const OrganizationSlice = createSlice({
  name: "organizationSlice",
  initialState: organizationState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getOrgUsers.fulfilled , (state , {payload})=>{
      state.orgUsers = payload.data
    })
    .addCase(getOrgDepartments.fulfilled , (state , {payload})=>{
      state.allDepartments = payload.data
    })
    .addCase(getOrgUsersChats.fulfilled , (state , {payload})=>{
      state.orgUserChats = payload.data
    })
    .addCase(createDept.fulfilled , (state, {payload})=>{
      state.allDepartments.push(payload.data);
    })
  },
});


export default OrganizationSlice.reducer;
