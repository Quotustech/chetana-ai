import { createAsyncThunk, SerializedError } from "@reduxjs/toolkit";
import axios from "axios";
import { JwtPayload, jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { User } from "@/common/interfaces/user.interface";
import { cookies } from "next/headers";
import { Organization } from "@/common/interfaces/organization.interface";
import { Department } from "@/common/interfaces/department.interface";

interface ResObject<T> {
  success: boolean;
  message: string;
  data: T;
}

interface JwtTokenPayload extends JwtPayload {
  userId: string;
  role: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  organization: string;
  department: string;
}

interface LoginResponse {
  token: string;
}


const ApiUrl = process.env.NEXT_PUBLIC_API_URL;

export const login = createAsyncThunk(
  "auth/login",
  async (body: LoginData, thunkApi) => {
    try {
      const res = await axios.post<ResObject<string>>(
        `${ApiUrl}/api/v1/auth/login`,
        body
      );
      const decoded = jwtDecode<JwtTokenPayload>(res.data.data);
      if (decoded && decoded.role !== undefined) {
        Cookies.set("authToken", res.data.data, { expires: 1 });
      } else {
        throw new Error("Unauthorized");
      }
      return {
        success: res.data.success,
        message: res.data.message,
        data: {
          token: res.data.data,
        }
      }
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${login.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const register = createAsyncThunk(
  "user/register", async (data: RegisterData, thunkApi) => {
  try {
    // console.log('@@@@@@@' , data);
    const res = await axios.post<ResObject<User>>(`${ApiUrl}/api/v1/auth/register`, data);
    return res.data;
  } catch (error: any) {
    // console.error(
    //   `🔥 Error from createAsyncThunk [${register.pending.type}]: `,
    //   error
    // );
    return thunkApi.rejectWithValue(error);
  }
});

export const getProfile = createAsyncThunk(
  "user/get-profile",
  async (userId: string, thunkApi) => {
    try {
      const token = Cookies.get("authToken");
      const res = await axios.get<ResObject<User>>(`${ApiUrl}/api/v1/users/${userId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (res.statusText === "OK") {
        return res.data;
      } else {
        throw new Error("Can't find User");
      }
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${getProfile.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getOrgs = createAsyncThunk(
  "user/get-organizations",
  async (_, thunkApi) => {
    try {
      const res = await axios.get<ResObject<Organization[]>>(
        `${ApiUrl}/api/v1/organization`
      );

      if (res.statusText === "OK") {
        return res.data;
      } else {
        throw new Error("Can't find User");
      }
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${getOrgs.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getDepts = createAsyncThunk(
  "user/get-departments",
  async (orgId: string, thunkApi) => {
    try {
      const res = await axios.get<ResObject<Department[]>>(
        `${ApiUrl}/api/v1/department/organization/${orgId}`
      );

      if (res.statusText === "OK") {
        return res.data;
      } else {
        throw new Error("Can't find User");
      }
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${getDepts.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgot-password",
  async (email: string, thunkApi) => {
    try {
      const res = await axios.post<ResObject<null>>(
        `${ApiUrl}/api/v1/auth/forgot-password`,
        {email}
      );
      return res.data;
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${forgotPassword.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk("user/logout", async () => {
  Cookies.remove("authToken");
  return { logout: true };
});
