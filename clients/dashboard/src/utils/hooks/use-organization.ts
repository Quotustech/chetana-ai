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
  department: Department;
}

interface Data {
  department: Department;
  message: string;
  success: string;
}



interface FORMDATA {
  deptHeadName: string;
  email: string;
  password: string;
  description: string;
  deptName: string;
  orgName:string;
  orgCode: string
}

const apiurl = process.env.NEXT_PUBLIC_PRODUCTION_API;
const token = Cookies.get('auth');

export const useGetUsers = () => {
  const getUsers = async (orgCode: string): Promise<User[]> => {
    try {
      const res = await axios.get<ResRootObject>(
        `${apiurl}/api/v1/users/organization/${orgCode}`,
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

  return { getUsers };
};

export const useGetOrgsDepts = () => {
  const getOrgsDepts = async (orgCode: string): Promise<Department[]> => {
    try {
      const res = await axios.get<ResRootObject>(
        `${apiurl}/api/v1/department/organization/${orgCode}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          }
        }
      );

      return res.data as unknown as Department[];
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

  return { getOrgsDepts };
};

export const useCreateDept = () => {
  const createDept = async (body: FORMDATA): Promise<Department> => {
    try {
      const res = await axios.post<ResRootObject>(
        `${apiurl}/api/v1/department`,
        body,
        {
          headers: {
            Authorization: "Bearer " + token,
          }
        }
      );

      return res.data.department as unknown as Department;
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

  return { createDept };
};

export const useGetOrgchats = () => {
  const getOrgChats = async (): Promise<Chat[]> => {
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

  return { getOrgChats };
};