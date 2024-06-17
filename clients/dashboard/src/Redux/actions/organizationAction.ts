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

interface DeptData{
    deptHeadName: string;
    email: string;
    password: string;
    description: string;
    name: string;
    organization: string;
}

const apiurl = process.env.NEXT_PUBLIC_PRODUCTION_API;

export const getOrgUsers = createAsyncThunk(
  "organization/get-org-users",
  async (orgId: string, thunkApi) => {
    try {
      const token = Cookies.get("auth");
      const res = await axios.get<ResObject<User[]>>(
        `${apiurl}/api/v1/users/organization/${orgId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${getOrgUsers.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getOrgDepartments = createAsyncThunk(
  "organization/get-org-departments",
  async (orgId: string, thunkApi) => {
    try {
      const token = Cookies.get("auth");
      const res = await axios.get<ResObject<Department[]>>(
        `${apiurl}/api/v1/department/organization/${orgId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${getOrgDepartments.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getOrgUsersChats = createAsyncThunk(
  "organization/get-org-users-chats",
  async (orgId: string, thunkApi) => {
    try {
      const token = Cookies.get("auth");
      const res = await axios.get<ResObject<Chat[]>>(
        `${apiurl}/api/v1/allChat/organization/${orgId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${getOrgUsersChats.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const createDept = createAsyncThunk(
  "organization/create-dept",
  async (deptData: DeptData, thunkApi) => {
    try {
      const token = Cookies.get("auth");
      const res = await axios.post<ResObject<Department>>(
        `${apiurl}/api/v1/department`,
        { ...deptData },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${createDept.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);
