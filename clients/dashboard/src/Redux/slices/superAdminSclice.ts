import { Draft, PayloadAction, createSlice } from "@reduxjs/toolkit";

import { superAdminState } from "../states/superAdminState";
import { Department } from "@/src/common/interfaces/department.interface";
import { approveDept, createOrg, createUser, deleteUser, getAllChats, getAllDepts, getAllOrgs, getAllUsers, rejectDept } from "../actions/superAdminAction";

const SuperAdminSlice = createSlice({
  name: "SuperAdminSlice",
  initialState: superAdminState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAllOrgs.fulfilled , (state , {payload})=>{
      state.organizations = payload.data
    })
    .addCase(getAllUsers.fulfilled , (state , {payload})=>{
      state.users = payload.data
    })
    .addCase(getAllDepts.fulfilled , (state , {payload})=>{
      const { pending, approved } = payload.data.reduce((acc:{ pending: Department[], approved: Department[] }, dept) => {
        if (dept.status === "pending") {
            acc.pending.push(dept);
        } else if (dept.status === "approved") {
            acc.approved.push(dept);
        }
        return acc;
    }, { pending: [], approved: [] });
    state.approvedDepts = approved;
    state.pendingDepts = pending;
    })
    .addCase(getAllChats.fulfilled , (state , {payload})=>{
      state.chats = payload.data
    })
    .addCase(approveDept.fulfilled , (state , {payload})=>{
      state.approvedDepts.push(payload.data);
      state.pendingDepts = state.pendingDepts.filter(
        (dept) => dept._id !== payload.data._id
      );
    })
    .addCase(rejectDept.fulfilled , (state , {payload})=>{
      state.pendingDepts = state.pendingDepts.filter((dept)=> dept._id !== payload.data._id);
    })
    .addCase(createOrg.fulfilled , (state , {payload})=>{
      state.organizations.push(payload.data)
    })
    .addCase(createUser.fulfilled , (state , {payload})=>{
      state.users.push(payload.data)
    })
    .addCase(deleteUser.fulfilled , (state , {payload})=>{
      state.users = state.users.filter((user)=> user._id !== payload.data._id)
    })
  },
});

export default SuperAdminSlice.reducer;
