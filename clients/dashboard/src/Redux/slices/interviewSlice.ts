import { Draft, PayloadAction, createSlice } from "@reduxjs/toolkit";

import { authState } from "../states/authState";
import { interviewState } from "../states/interviewState";
import { Job } from "@/src/common/interfaces/job.interface";
import { Question } from "@/src/common/interfaces/question.interface";
import { createJob, createQuestion, getJobs, getQuestions, removeQuestion } from "../actions/interviesAction";

const InterviewSlice = createSlice({
  name: "interviewSlice",
  initialState: interviewState,
  reducers: {
    setShowJobModal(
      state: Draft<typeof interviewState>,
      action: PayloadAction<(typeof interviewState)["showJobModal"]>
    ) {
      state.showJobModal = action.payload;
    },
    setShowQuestionModal(
        state: Draft<typeof interviewState>,
        action: PayloadAction<(typeof interviewState)["showQuestionModal"]>
      ) {
        state.showQuestionModal = action.payload;
      }
    
  },
  extraReducers(builder) {
    builder.addCase(getJobs.fulfilled , (state , {payload})=>{
      state.jobs = payload.data;
    })
    .addCase(createJob.fulfilled , (state , {payload})=>{
      state.jobs.push(payload.data);
      state.showJobModal = false;
    })
    .addCase(createQuestion.fulfilled , (state , {payload})=>{
      state.questions.push(payload.data);
      state.showQuestionModal = false;
    })
    .addCase(removeQuestion.fulfilled , (state , {payload})=>{
      state.questions = state.questions.filter((que)=> que._id !== payload.data._id);
    })
    .addCase(getQuestions.fulfilled , (state , {payload})=>{
      state.questions = payload.data
    })
  },
});

export const { setShowJobModal, setShowQuestionModal} = InterviewSlice.actions;

export default InterviewSlice.reducer;
