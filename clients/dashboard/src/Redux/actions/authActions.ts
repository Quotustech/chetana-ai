import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { JwtPayload, jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { User } from "@/src/common/interfaces/user.interface";
import { Chat } from "@/src/common/interfaces/chat.interface";

interface ResObject<T> {
  success: boolean;
  message: string;
  data: T;
}

interface LoginData {
  email: string;
  password: string;
}

interface JwtTokenPayload extends JwtPayload {
  userId: string;
  role: string;
  email: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    email: string;
    role: string;
  };
}


const apiurl = process.env.NEXT_PUBLIC_PRODUCTION_API;

const urlObject: Record<string, string> = {
  "superadmin": `${apiurl}/api/v1/techmate/user/me`,
  "deptadmin": `${apiurl}/api/v1/department/user/me`,
  "admin": `${apiurl}/api/v1/organization/user/me`
};

export const login: AsyncThunk<LoginResponse, LoginData, {}> = createAsyncThunk(
  "auth/login",
  async (body: LoginData, thunkApi) => {
    try {
      const res = await axios.post<ResObject<string >>(
        `${apiurl}/api/v1/auth/login`,
        body
      );
      const decoded = jwtDecode<JwtTokenPayload>(res.data.data);
      if (decoded && decoded.role !== undefined) {
        Cookies.set("auth", res.data.data, { expires: 1 });
      } else {
        throw new Error("Unauthorized");
      }
      return {
        success: res.data.success,
        message: res.data.message,
        data: {
          token: res.data.data,
          email: decoded.email,
          role: decoded.role
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

export const getProfile = createAsyncThunk(
  'auth/get-profile' , async({email , role}: {email: string; role:string}, thunkApi)=>{
    const token = Cookies.get('auth');
    const res = await axios.post<ResObject<User>>(urlObject[role], 
    {email},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (res.statusText === "OK") {
      return res.data
    } else {
      throw new Error("Can't find User");
    }
  }
)

export const getProfileById = createAsyncThunk<
  ResObject<User>, // Return type of the async thunk action
  string
>(
  'auth/get-profile-by-id',
  async (id: string, thunkApi) => {
    try {
      const token = Cookies.get('auth');
      const res = await axios.get<ResObject<User>>(
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
      //   `🔥 Error from createAsyncThunk [${getProfileById.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);


export const getUserChats = createAsyncThunk<
  ResObject<Chat[]>, // Return type of the async thunk action
  string
>(
  'auth/get-user-chats',
  async (id: string, thunkApi) => {
    try {
      const token = Cookies.get('auth');
      const res = await axios.get<ResObject<Chat[]>>(
        `${apiurl}/api/v1/allChat/${id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      // console.error(
      //   `🔥 Error from createAsyncThunk [${getProfileById.pending.type}]: `,
      //   error
      // );
      return thunkApi.rejectWithValue(error);
    }
  }
);


export const logout = createAsyncThunk("user/logout", async () => {
  Cookies.remove("auth");
  return { logout: true };
});