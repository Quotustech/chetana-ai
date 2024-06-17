import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import { User } from "@/src/common/interfaces/user.interface";
import { Department } from "@/src/common/interfaces/department.interface";
import { Chat } from "@/src/common/interfaces/chat.interface";

interface ResObject<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ApproveData {
  userId: string;
  deptId: string;
  orgId: string;
}

const apiurl = process.env.NEXT_PUBLIC_PRODUCTION_API;

export const getDeptUsers = createAsyncThunk(
  "department/get-dept-users",
  async (deptId: string, thunkApi) => {
    try {
      const token = Cookies.get("auth");
      const res = await axios.get<ResObject<User[]>>(
        `${apiurl}/api/v1/users/department/${deptId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${getDeptUsers.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getDeptUsersChats = createAsyncThunk(
  "department/get-dept-users-chats",
  async (deptId: string, thunkApi) => {
    try {
      const token = Cookies.get("auth");
      const res = await axios.get<ResObject<Chat[]>>(
        `${apiurl}/api/v1/allChat/department/${deptId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${getDeptUsersChats.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const approveUser = createAsyncThunk(
  "department/approve-user",
  async (approveData: ApproveData, thunkApi) => {
    try {
      // console.log("approveData", approveData);
      const token = Cookies.get("auth");
      const res = await axios.patch<ResObject<User>>(
        `${apiurl}/api/v1/department/userapprove`,
        { ...approveData },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      // console.log('approve user' , res)
      return res.data;
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${approveUser.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const rejectUser = createAsyncThunk(
  "department/reject-user",
  async (userId: string, thunkApi) => {
    try {
      const token = Cookies.get("auth");
      const res = await axios.put<ResObject<User>>(
        `${apiurl}/api/v1/updateuser/${userId}`,
        {status: 'rejected'},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${rejectUser.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);
