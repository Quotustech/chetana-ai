import axios, { AxiosError } from "axios";
import { User } from "@/src/common/interfaces/user.interface";
import { ResStatus } from "./use-auth";
import { Chat } from "@/src/types/chat";
import Cookies from 'js-cookie';

export interface ErrRootObject {
  data: any;
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

export interface ResRootObject {
  data: any;
  success: boolean;
  message: string;
}


const apiurl = process.env.NEXT_PUBLIC_PRODUCTION_API;
const token = Cookies.get('auth');
console.log('|||||||||| token from useprofile:' , token)

const urlObject: Record<string, string> = {
  "superadmin": `${apiurl}/api/v1/techmate/user/me`,
  "deptadmin": `${apiurl}/api/v1/department/user/me`,
  "admin": `${apiurl}/api/v1/organization/user/me`
};


export const useGetProfile = () => {
  const getProfile = async (email:string , role:string , authToken: string): Promise<ResRootObject> => {
    try {
      
      const res = await axios.post<ResRootObject>(
        urlObject[role],
        { email },
        {
          headers: {
            Authorization: "Bearer " + authToken,
          }
        }
      );
      console.log('profile by email::::::::' , res);
      return {
        success: res.data.success,
        message: res.data.message,
        data: res.data.data

      };
    } catch (error) {
      if (axios.isAxiosError<ErrRootObject>(error)) {
        const axiosError = error as AxiosError<ErrRootObject>;
        // Handle error here, for example, throw the error again
        throw (
          axiosError.response?.data.message || "Error retrieving user profile"
        );
      } else {
        // Handle other types of errors if needed
        throw "Unexpected error";
      }
    }
  };

  return { getProfile };
};

export const useGetuserChats = () => {
  const getUserChats = async (userId: string): Promise<Chat[]> => {
    try {
      const res = await axios.get<ResRootObject & ErrRootObject>(
        `${apiurl}/api/v1/allChat/${userId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          }
        }
      );

      return res.data as unknown as Chat[];
    } catch (error) {
      if (axios.isAxiosError<ErrRootObject>(error)) {
        const axiosError = error as AxiosError<ErrRootObject>;
        // Handle error here, for example, throw the error again
        throw (
          axiosError.response?.data.message || "Error retrieving chats"
        );
      } else {
        // Handle other types of errors if needed
        throw "Unexpected error";
      }
    }
  };

  return { getUserChats };
};
