import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosAuthInstance from "@/utils/apiAxiosAuthInstance";
import { AxiosResponse } from 'axios';
import { IJobQuestion } from "@/common/interfaces/question.interface";
import { IJob } from "@/common/interfaces/job.interface";

interface IResObject<T> {
    success: boolean;
    message: string;
    data: T;
}
interface IQuestions{
    questions: IJobQuestion[],
    jobDetails: IJob
}

export const getQuestions = createAsyncThunk(
    "jobs/get-questions",
    async (jobId : string, thunkAPI) => {
        try {
            const res: AxiosResponse = await axiosAuthInstance.get<IResObject<IQuestions>>(`/api/v1/interview/jobrole/question/getallquestion/${jobId}`);
            if (res.status === 200) { // Check if status is 200
                const {questions, jobDetails} = res.data.data
                return {questions, jobDetails}
            } else {
                throw new Error("error while getting jobs");
            }
        } catch (error: any) {
            // console.log("Error in getting job roles ", error);
            return thunkAPI.rejectWithValue({ errorMessage: error.message })
        }
    }
);
