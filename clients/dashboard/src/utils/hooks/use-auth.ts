'use client'
import { setUser } from "@/src/Redux/slices/authSlice";
import { Dispatch } from "redux";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { User } from "@/src/common/interfaces/user.interface";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

export interface ErrorRootObject {
  err: Err;
  message: string;
  stack: string;
  status: ResStatus;
}

export interface Err {
  isOperational: boolean;
  status: ResStatus;
  statusCode: number;
}

export interface ResponseRootObject {
  token: string;
  data: Data;
  success: boolean;
  message: string;
  status: ResStatus;
}

export interface Data {
  token: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export enum ResStatus {
  Success = "success",
  Fail = "fail",
}

export interface DecodedToken {
  // Add any other properties present in your decoded token
  role: string;
  email: string;
}


const apiurl = process.env.NEXT_PUBLIC_PRODUCTION_API;
export const useLogin = () => {
  const [response, setResponse] = useState<{
    error: ResStatus;
    message: string;
    data: Data | null;
  }>({
    error: ResStatus.Fail,
    message: "",
    data: null,
  });

  const login = async (body: LoginBody) => {
    try {
      const res = await axios.post<ResponseRootObject & ErrorRootObject>(
        `${apiurl}/api/v1/auth/login`,
        body
      );
      console.log('-)_)_)__)_)_)_-' , res)
      const decoded: DecodedToken = jwtDecode(res.data.data.token);
      if (decoded.role !== "user") {
        Cookies.set("auth", res.data.data.token, { expires: 1 });
      } else {
        console.log("you are a user can't signin");
      }


      return {
        success: res.data.success,
        message: res.data.message,
        data: {
          accessToken: res.data.data.token,
          role: decoded.role,
          user_email: decoded.email
        },
      };
    } catch (error) {
      console.log('))))' , error)
      if (axios.isAxiosError<ErrorRootObject, Record<string, unknown>>(error)) {
        console.log(error.response?.data.message);
        return {
          error: ResStatus.Fail,
          message: error.response?.data.message!,
          data: null,
        };
      }
    }
  };
  //   console.log(response);

  return { login, response };
};

export const Logout = (
  dispatch: Dispatch,
  router: AppRouterInstance | string[]
) => {
  router.push("/signin");
  console.log("called logout");
  toast.success("Successfully logged out");
  Cookies.remove("auth");
  dispatch(setUser({} as User));
};
