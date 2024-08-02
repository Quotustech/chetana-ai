// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axiosAuthInstance from "@/utils/apiAxiosAuthInstance";
// import { AxiosResponse } from 'axios';

// export const getJobs = createAsyncThunk(
//     "jobs/get-jobs",
//     async (_, thunkAPI) => {
//         try {
//             const res: AxiosResponse = await axiosAuthInstance.get("/api/v1/interview/jobroles");
//             if (res.status === 200) { // Check if status is 200
//                 return res.data;
//             } else {
//                 throw new Error("error while getting jobs");
//             }
//         } catch (error: any) {
//             // console.log("Error in getting job roles ", error);
//             return thunkAPI.rejectWithValue({ errorMessage: error.message })
//         }
//     }
// );



import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';
import { AxiosResponse } from 'axios';

export const getJobs = createAsyncThunk(
    "jobs/get-jobs",
    async (_, thunkAPI) => {
        const token = Cookies.get("authToken");
        if (!token) {
            return thunkAPI.rejectWithValue({ errorMessage: "Token not available" });
        }
        try {
            const res: AxiosResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/interview/jobroles`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (res.status === 200) {
                return res.data;
            } else {
                throw new Error("error while getting jobs");
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ errorMessage: error.message });
        }
    }
);
