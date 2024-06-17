import { Draft, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IJob } from "@/common/interfaces/job.interface";
import { getJobs } from "./jobActions";

type InitialState = {
    jobs: IJob[];
    isLoading: boolean;
    isError: boolean
}

const initialState: InitialState = {
    jobs: [],
    isLoading: true,
    isError: false
}

const jobSlice = createSlice({
    name: "jobSlice",
    initialState,
    reducers: {
        setJobs(
            state: Draft<typeof initialState>,
            action: PayloadAction<(typeof initialState)["jobs"]>,
        ) {
            state.jobs = action.payload
            state.isLoading = false
            state.isError = false
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getJobs.fulfilled, (state, { payload }) => {
                state.jobs = payload.data
                state.isLoading = false
                state.isError = false
            })
            .addCase(getJobs.rejected, (state, { payload }) => {
                state.jobs = []
                state.isLoading = false
                state.isError = true
            })
    }
})

export const {setJobs} = jobSlice.actions;
export default jobSlice.reducer;