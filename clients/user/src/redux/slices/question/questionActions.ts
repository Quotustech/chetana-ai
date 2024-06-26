import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosAuthInstance from "@/utils/apiAxiosAuthInstance";
import { AxiosResponse } from 'axios';
// import { IJobQuestion } from "@/common/interfaces/question.interface";
import { IJob } from "@/common/interfaces/job.interface";

interface IResObject<T> {
    success: boolean;
    message: string;
    data: T;
}


interface IJobQuestion {
    _id: string;
    job: string;
    question: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
interface IQuestions{
    questions: IJobQuestion[],
    jobDetails: IJob
}

export const getQuestions = createAsyncThunk(
    "jobs/get-questions",
    async (jobId : string, thunkAPI) => {
        try {
            // newone
            const res: AxiosResponse<IResObject<IJobQuestion[]>> = await axiosAuthInstance.get(`/api/v1/interview/jobrole/question/getallquestion/${jobId}`);

            // old one
            // const res: AxiosResponse = await axiosAuthInstance.get<IResObject<IQuestions>>(`/api/v1/interview/jobrole/question/getallquestion/${jobId}`);
            // console.log("Full API Response:", res);
            // console.log("Response Data:", res.data);

            if (res.status === 200 && res.data.success) { 
                // Check if status is 200 // added res success
                if(res.data.data){ //double check
                // const {questions, jobDetails} = res.data.data
                const questions = res.data.data;
                const jobDetails: IJob = {
                    jobRole: "Placeholder Role",
                    _id: "",
                    jobName: "",
                    description: "",
                    createdAt: "",
                    updatedAt: ""
                }; 
                console.log("questionthunk", questions)
                console.log("JobDetails:", jobDetails);
                return {questions, jobDetails}
                }
                else {
                    throw new Error("Data property is missing in the response");
                }
            } else {
                throw new Error("error while getting jobs");
            }
        } catch (error: any) {
            // console.log("Error in getting job roles ", error);
            return thunkAPI.rejectWithValue({ errorMessage: error.message })
        }
    }
);
