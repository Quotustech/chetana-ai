import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { JwtPayload, jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { User } from "@/src/common/interfaces/user.interface";
import { Organization } from "@/src/common/interfaces/organization.interface";
import { Department } from "@/src/common/interfaces/department.interface";
import { Chat } from "@/src/common/interfaces/chat.interface";

interface ResObject<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ApproveData {
  apiKey: string;
  chatGptModel: string;
  departmentId: string;
}

interface OrgData{
  name: string,
  email: string,
  phoneNumber: number | string,
  password: string,
}

interface UserData{
  name: string;
  email: string;
  password: string;
  role: string;
}

const apiurl = process.env.NEXT_PUBLIC_PRODUCTION_API;

export const getAllOrgs = createAsyncThunk(
  "superadmin/get-all-orgs",
  async (_, thunkApi) => {
    try {
      const token = Cookies.get("auth");
      const res = await axios.get<ResObject<Organization[]>>(
        `${apiurl}/api/v1/organization`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${getAllOrgs.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "superadmin/get-all-users",
  async (_, thunkApi) => {
    try {
      const token = Cookies.get("auth");
      const res = await axios.get<ResObject<User[]>>(`${apiurl}/api/v1/users`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return res.data;
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${getAllUsers.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getAllDepts = createAsyncThunk(
  "superadmin/get-all-depts",
  async (_, thunkApi) => {
    try {
      const token = Cookies.get("auth");
      const res = await axios.get<ResObject<Department[]>>(
        `${apiurl}/api/v1/department`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${getAllDepts.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getAllChats = createAsyncThunk(
  "superadmin/get-all-chats",
  async (_, thunkApi) => {
    try {
      const token = Cookies.get("auth");
      const res = await axios.get<ResObject<Chat[]>>(
        `${apiurl}/api/v1/allChat`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${getAllDepts.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const approveDept = createAsyncThunk(
  "superadmin/approve-dept",
  async (approveData: ApproveData, thunkApi) => {
    try {
      // console.log('approveData', approveData)
      const token = Cookies.get("auth");
      const res = await axios.put<ResObject<Department>>(
        `${apiurl}/api/v1/deptapprove`,
        {...approveData},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${approveDept.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const rejectDept = createAsyncThunk(
  "superadmin/reject-dept",
  async (id:string , thunkApi) => {
    try {
      const token = Cookies.get("auth");
      const res = await axios.put<ResObject<Department>>(
        `${apiurl}/api/v1/department/${id}`,
        { status: "rejected" },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${approveDept.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const createOrg = createAsyncThunk(
  "superadmin/create-org",
  async (orgData: OrgData, thunkApi) => {
    try {
      const token = Cookies.get("auth");
      const res = await axios.post<ResObject<Organization>>(
        `${apiurl}/api/v1/organization`,
        {...orgData},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${createOrg.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const createUser = createAsyncThunk(
  "superadmin/create-user",
  async (userData: UserData, thunkApi) => {
    try {
      const token = Cookies.get("auth");
      const res = await axios.post<ResObject<User>>(
        `${apiurl}/api/v1/createuser`,
        {...userData},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${createUser.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'superadmin/delete-user',
  async (id: string, thunkApi) => {
    try {
      const token = Cookies.get('auth');
      const res = await axios.delete<ResObject<User>>(
        `${apiurl}/api/v1/users/${id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${deleteUser.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);
