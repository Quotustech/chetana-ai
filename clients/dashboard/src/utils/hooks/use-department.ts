import axios, { AxiosError } from "axios";
import Cookies from 'js-cookie';
import { ResStatus } from "./use-auth";
import { User } from "@/src/common/interfaces/user.interface";
import { Department } from "@/src/common/interfaces/department.interface";
import { Chat } from "@/src/common/interfaces/chat.interface";

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
  data: Data;
  status: ResStatus;
  updatedUser: User;
  deletedUser: User;
}

export interface Data {
  user: Department;
}



interface Approved {
  message: string;
  updatedUser: User;
}

interface Rejected {
  message: string;
  updatedUser : User
}

const apiurl = process.env.NEXT_PUBLIC_PRODUCTION_API;
const token = Cookies.get('auth');

export const useGetDeptUsers = () => {
  const getDeptUsers = async (): Promise<User[]> => {
    try {
      const res = await axios.get<ResRootObject>(
        `${apiurl}/api/v1/users`,
        {
          headers: {
            Authorization: "Bearer " + token,
          }
        }
      );

      return res.data as unknown as User[];
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

  return { getDeptUsers };
};

export const useDeptUserAction = () => {
  const approveDeptUser = async (
    userId: string,
    token: string
  ): Promise<Approved> => {
    console.log("userid", userId);
    console.log("token", token);
    try {
      const res = await axios.post<ResRootObject & ErrRootObject>(
        `${apiurl}/api/v1/department/userapprove`,
        { userId }, 
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log('response' , res)

      return {
        updatedUser: res.data.updatedUser,
        message: res.data.message,
      };
    } catch (error) {
      if (axios.isAxiosError<ErrRootObject>(error)) {
        const axiosError = error as AxiosError<ErrRootObject>;

        throw (
          axiosError.response?.data.message || "Error retrieving user profile"
        );
      } else {
        throw "Unexpected error";
      }
    }
  };

  const rejectDeptUser = async (userId: string): Promise<Rejected> => {
    try {
      const res = await axios.put<ResRootObject & ErrRootObject>(
        `${apiurl}/api/v1/updateuser/${userId}`,
        {status: 'rejected'},
        {
          headers: {
            Authorization: "Bearer " + token,
          }
        }
      );

      return {
        updatedUser: res.data.updatedUser,
        message: 'User Rejected Succesfully.'
      }
    } catch (error) {
      if (axios.isAxiosError<ErrRootObject>(error)) {
        const axiosError = error as AxiosError<ErrRootObject>;

        throw (
          axiosError.response?.data.message || "Error retrieving user profile"
        );
      } else {
        throw "Unexpected error";
      }
    }
  };

  return { approveDeptUser, rejectDeptUser };
};

export const useGetUserchats = () => {
  const getAllUserChats = async (): Promise<Chat[]> => {
    try {
      const res = await axios.get<ResRootObject & ErrRootObject>(
        `${apiurl}/api/v1/allChat`,
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

  return { getAllUserChats };
};

