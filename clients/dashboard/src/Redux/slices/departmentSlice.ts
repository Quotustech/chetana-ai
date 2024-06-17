import { createSlice } from "@reduxjs/toolkit";
import { departmentState } from "../states/departmentState";
import { User } from "@/src/common/interfaces/user.interface";
import { approveUser, getDeptUsers, getDeptUsersChats, rejectUser } from "../actions/departmentAction";

const DepartmentSlice = createSlice({
  name: "departmentSlice",
  initialState: departmentState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getDeptUsers.fulfilled , (state , {payload})=>{
      const { pending, approved } = payload.data.reduce((acc:{ pending: User[], approved: User[] }, dept) => {
        if (dept.status === "pending") {
            acc.pending.push(dept);
        } else if (dept.status === "approved") {
            acc.approved.push(dept);
        }
        return acc;
    }, { pending: [], approved: [] });
    state.approvedUsers = approved;
    state.pendingUsers = pending;
    })
    .addCase(getDeptUsersChats.fulfilled , (state , {payload})=>{
      state.userChats = payload.data
    })
    .addCase(approveUser.fulfilled , (state , {payload})=>{
      state.approvedUsers.push(payload.data);
      state.pendingUsers = state.pendingUsers.filter(
        (user) => user._id !== payload.data._id
      );
    })
    .addCase(rejectUser.fulfilled , (state , {payload})=>{
      state.pendingUsers = state.pendingUsers.filter((user)=> user._id !== payload.data._id);
    })
  },
});


export default DepartmentSlice.reducer;
