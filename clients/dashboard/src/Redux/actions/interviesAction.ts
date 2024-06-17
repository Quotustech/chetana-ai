import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import { Job } from "@/src/common/interfaces/job.interface";
import { Question } from "@/src/common/interfaces/question.interface";

interface ResObject<T> {
    success: boolean;
    message: string;
    data: T;
}

interface JobData{
    jobName: string;
    description: string;
}

interface QuestionData{

}

const apiurl = process.env.NEXT_PUBLIC_PRODUCTION_API;

export const getJobs = createAsyncThunk(
    "interview/get-jobs" , async(_ , thunkApi)=>{
        try {
            const token = Cookies.get("auth");
            const res = await axios.get<ResObject<Job[]>>(
              `${apiurl}/api/v1/interview/jobroles`,
              {
                headers: {
                  Authorization: "Bearer " + token,
                },
              }
            );
            return res.data;
          } catch (error: any) {
            // console.error(
            //   `🔥 Error from createAsyncThunk [${getJobs.pending.type}]: `,
            //   error
            // );
            return thunkApi.rejectWithValue(error);
          }
    }
)

export const getQuestions = createAsyncThunk(
    "interview/get-questions" , async(jobId:string , thunkApi)=>{
        try {
            const token = Cookies.get("auth");
            const res = await axios.get<ResObject<Question[]>>(
              `${apiurl}/api/v1/interview/jobrole/question/getallquestion/${jobId}`,
              {
                headers: {
                  Authorization: "Bearer " + token,
                },
              }
            );
            return res.data;
          } catch (error: any) {
            // console.error(
            //   `🔥 Error from createAsyncThunk [${getQuestions.pending.type}]: `,
            //   error
            // );
            return thunkApi.rejectWithValue(error);
          }
    }
)

export const createJob = createAsyncThunk(
    "interview/create-job" , async(jobData:JobData , thunkApi)=>{
        try {
            const token = Cookies.get("auth");
            const res = await axios.post<ResObject<Job>>(
              `${apiurl}/api/v1/interview/createjobrole`,
              {...jobData},
              {
                headers: {
                  Authorization: "Bearer " + token,
                },
              }
            );
            return res.data;
          } catch (error: any) {
            // console.error(
            //   `🔥 Error from createAsyncThunk [${createJob.pending.type}]: `,
            //   error
            // );
            return thunkApi.rejectWithValue(error);
          }
    }
)


export const createQuestion = createAsyncThunk(
    "interview/create-question" , async(questionData:QuestionData , thunkApi)=>{
        try {
            const token = Cookies.get("auth");
            const res = await axios.post<ResObject<Question>>(
              `${apiurl}/api/v1/interview/jobrole/question/createquestion`,
              {...questionData},
              {
                headers: {
                  Authorization: "Bearer " + token,
                },
              }
            );
            return res.data;
          } catch (error: any) {
            // console.error(
            //   `🔥 Error from createAsyncThunk [${createQuestion.pending.type}]: `,
            //   error
            // );
            return thunkApi.rejectWithValue(error);
          }
    }
)


export const removeQuestion = createAsyncThunk(
    "interview/remove-question" , async(qId:string , thunkApi)=>{
        try {
            const token = Cookies.get("auth");
            const res = await axios.delete<ResObject<Question>>(
              `${apiurl}/api/v1/interview/jobrole/question/${qId}`,
              {
                headers: {
                  Authorization: "Bearer " + token,
                },
              }
            );
            return res.data;
          } catch (error: any) {
            // console.error(
            //   `🔥 Error from createAsyncThunk [${removeQuestion.pending.type}]: `,
            //   error
            // );
            return thunkApi.rejectWithValue(error);
          }
    }
)