import { Draft, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IJob } from "@/common/interfaces/job.interface";
import { getQuestions } from "./questionActions";
import { IJobQuestion } from "@/common/interfaces/question.interface";

type InitialState = {
    questions: IJobQuestion[];
    jobDetails : IJob | null;
    isLoading: boolean;
    isError: boolean
}

const initialState: InitialState = {
    questions: [],
    jobDetails : null,
    isLoading: true,
    isError: false
}

const questionSlice = createSlice({
    name: "questionSlice",
    initialState,
    reducers: {
        setQuestions(
            state: Draft<typeof initialState>,
            action: PayloadAction<(typeof initialState)>,
        ) {
            state.questions = action.payload.questions
            state.jobDetails = action.payload.jobDetails
            state.isLoading = false
            state.isError = false
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getQuestions.fulfilled, (state, { payload }) => {
                state.questions = payload.questions
                state.jobDetails = payload.jobDetails
                state.isLoading = false
                state.isError = false
            })
            .addCase(getQuestions.rejected, (state, { payload }) => {
                state.questions = []
                state.jobDetails =  null ;
                state.isLoading = false
                state.isError = true
            })
    }
})

export const {setQuestions} = questionSlice.actions;
export default questionSlice.reducer;