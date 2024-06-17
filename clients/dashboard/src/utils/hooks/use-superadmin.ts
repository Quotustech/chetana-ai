import axios, { AxiosError } from "axios";
import { ResStatus } from "./use-auth";
import { User } from "@/src/common/interfaces/user.interface";
import { Organization } from "@/src/common/interfaces/organization.interface";
import { Department } from "@/src/common/interfaces/department.interface";
import { Chat } from "@/src/common/interfaces/chat.interface";
import Cookies from "js-cookie";
import { Job } from "@/src/common/interfaces/job.interface";
import { Question } from "@/src/common/interfaces/question.interface";

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
  organization: Organization;
  user: User;
  // status: ResStatus;
  updatedDepartment: Department;
  deletedDepartment: Department;
  deletedUser: User;
  success: string;
}

export interface OrgData {
  organization: Organization;
  message: string;
  success: string;
}

export interface UserData {
  user: User;
  message: string;
  success: string;
}

export interface JobData {
  data: Job;
  message: string;
  success: string;
}

export interface QuestionData {
  data: Question;
  message: string;
  success: string;
}

export interface FormBody {
  name: string;
  email: string;
  phoneNumber: number | string;
  password: string;
}

export interface UserFormBody {
  name: string;
  email: string;
  password: string;
  token: string;
  role: string;
}

interface JobBody{
  jobName: string,
  description : string,
}

interface QuestionBody{
  jobRoleId: string;
  question: string;
}

interface Modal {
  departmentId: string;
  apiKey: string;
  token: string;
  chatGptModel: string;
}

interface Approved {
  message: string;
  updatedDepartment: Department;
}

interface Deletion {
  message: string;
  data: User;
}

interface Rejected {
  message: string;
  deletedDepartment: Department;
}

const apiurl = process.env.NEXT_PUBLIC_PRODUCTION_API;
const token = Cookies.get("auth");

export const useCreateOrg = () => {
  const createOrg = async (body: FormBody): Promise<OrgData> => {
    try {
      const res = await axios.post<ResRootObject & ErrRootObject>(
        `${apiurl}/api/v1/organizations`,
        body,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      return {
        organization: res.data.organization,
        success: res.data.success,
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

  return { createOrg };
};

export const useGetOrgs = () => {
  const getOrgs = async (): Promise<Organization[]> => {
    try {
      const res = await axios.get<ResRootObject & ErrRootObject>(
        `${apiurl}/api/v1/organizations`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      return res.data as unknown as Organization[];
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

  return { getOrgs };
};

export const useGetDepts = () => {
  const getDepts = async (): Promise<Department[]> => {
    try {
      const res = await axios.get<ResRootObject>(
        `${apiurl}/api/v1/department`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
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

  return { getDepts };
};

export const useGetAllUsers = () => {
  const getAllUsers = async (): Promise<User[]> => {
    try {
      const res = await axios.get<ResRootObject & ErrRootObject>(
        `${apiurl}/api/v1/users`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
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

  return { getAllUsers };
};

export const useApproveDept = () => {
  const approveDept = async (body: Modal): Promise<Approved> => {
    const { departmentId, apiKey, chatGptModel, token } = body;
    try {
      const res = await axios.post<ResRootObject & ErrRootObject>(
        `${apiurl}/api/v1/deptapprove`,
        { departmentId, apiKey, chatGptModel }, // Request data should be passed as the second argument
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      return {
        updatedDepartment: res.data.updatedDepartment,
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

  return { approveDept };
};

export const useRejectDept = () => {
  const rejectDept = async (id: string): Promise<Approved> => {
    try {
      const res = await axios.patch<ResRootObject & ErrRootObject>(
        `${apiurl}/api/v1/department/${id}`,
        { status: "rejected" },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      return {
        updatedDepartment: res.data.updatedDepartment,
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

  return { rejectDept };
};

export const useGetAllChats = () => {
  const getAllChats = async (): Promise<Chat[]> => {
    try {
      const res = await axios.get<ResRootObject & ErrRootObject>(
        `${apiurl}/api/v1/allChat`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      return res.data as unknown as Chat[];
    } catch (error) {
      if (axios.isAxiosError<ErrRootObject>(error)) {
        const axiosError = error as AxiosError<ErrRootObject>;
        // Handle error here, for example, throw the error again
        throw axiosError.response?.data.message || "Error retrieving chats";
      } else {
        // Handle other types of errors if needed
        throw "Unexpected error";
      }
    }
  };

  return { getAllChats };
};

export const useDeleteUser = () => {
  const deleteUser = async (id: string): Promise<Deletion> => {
    try {
      const res = await axios.delete<ResRootObject & ErrRootObject>(
        `${apiurl}/api/v1/users/${id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      return {
        data: res.data.deletedUser,
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

  return { deleteUser };
};

export const useCreateUser = () => {
  const createUser = async (body: UserFormBody): Promise<UserData> => {
    const { email, name, password, role, token } = body;
    try {
      const res = await axios.post<ResRootObject & ErrRootObject>(
        `${apiurl}/api/v1/createuser`,
        { email, name, password, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response", {
        user: res.data.user,
        success: res.data.success,
        message: res.data.message,
      });
      return {
        user: res.data.user,
        success: res.data.success,
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

  return { createUser };
};

export const useGetAllJobs = () => {
  const getAllJobs = async (): Promise<Job[]> => {
    try {
      const res = await axios.get<ResRootObject & ErrRootObject>(
        `${apiurl}/api/v1/interview/jobroles`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      return res.data.data as unknown as Job[];
    } catch (error) {
      if (axios.isAxiosError<ErrRootObject>(error)) {
        const axiosError = error as AxiosError<ErrRootObject>;
        // Handle error here, for example, throw the error again
        throw axiosError.response?.data.message || "Error retrieving chats";
      } else {
        // Handle other types of errors if needed
        throw "Unexpected error";
      }
    }
  };
  return { getAllJobs };
};

export const useCreateJob = () => {
  const createJob = async (body: JobBody): Promise<JobData> => {
    const { jobName , description } = body;
    try {
      const res = await axios.post<ResRootObject & ErrRootObject>(
        `${apiurl}/api/v1/interview/createjobrole`,
        { jobName , description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return {
        data: res.data.data,
        success: res.data.success,
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

  return { createJob };
};

export const useGetAllQuestions = () => {
  const getAllQuestions = async (jobId: string): Promise<Question[]> => {
    try {
      const res = await axios.get<ResRootObject & ErrRootObject>(
        `${apiurl}/api/v1/interview/jobrole/question/getallquestion/${jobId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return res.data.data as unknown as Question[];
    } catch (error) {
      if (axios.isAxiosError<ErrRootObject>(error)) {
        const axiosError = error as AxiosError<ErrRootObject>;
        // Handle error here, for example, throw the error again
        throw axiosError.response?.data.message || "Error retrieving chats";
      } else {
        // Handle other types of errors if needed
        throw "Unexpected error";
      }
    }
  };
  return { getAllQuestions };
};

export const useCreateQuestion = () => {
  const createQuestion = async (body: QuestionBody): Promise<QuestionData> => {
    const { jobRoleId , question } = body;
    try {
      const res = await axios.post<ResRootObject & ErrRootObject>(
        `${apiurl}/api/v1/interview/jobrole/question/createquestion`,
        { jobRoleId , question },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return {
        data: res.data.data,
        success: res.data.success,
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

  return { createQuestion };
};

export const useDeleteQuestion = () => {
  const deleteQuestion = async (qId: string): Promise<QuestionData> => {
    try {
      const res = await axios.delete<ResRootObject & ErrRootObject>(
        `${apiurl}/api/v1/interview/jobrole/question/${qId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return {
        data: res.data.data,
        success: res.data.success,
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

  return { deleteQuestion };
};