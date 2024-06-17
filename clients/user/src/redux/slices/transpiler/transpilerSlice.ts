import { Draft, PayloadAction, createSlice } from "@reduxjs/toolkit";

type InitialState = {
    inputLang: string;
    outputLang: string;
    inputCode: string;
    outputCode: string;
    translating: boolean;
}

const initialState: InitialState = {
    inputLang: "",
    outputLang: "",
    inputCode: "",
    outputCode: "",
    translating: false
}

const transpilerSlice = createSlice({
    name: "transpilerSlice",
    initialState,
    reducers: {
        setInputLang(
            state: Draft<typeof initialState>,
            action: PayloadAction<(typeof initialState)["inputLang"]>
          ) {
            state.inputLang = action.payload;
        }, 
        setInputCode(
            state: Draft<typeof initialState>,
            action: PayloadAction<(typeof initialState)["inputCode"]>
          ) {
            state.inputCode = action.payload;
        }, 
        setOutputLang(
            state: Draft<typeof initialState>,
            action: PayloadAction<(typeof initialState)["outputLang"]>
          ) {
            state.outputLang = action.payload;
        },
        setOutputCode(
            state: Draft<typeof initialState>,
            action: PayloadAction<(typeof initialState)["outputCode"]>
          ) {
            state.outputCode = action.payload;
        },
        setTranslating(
            state: Draft<typeof initialState>,
            action: PayloadAction<(typeof initialState)["translating"]>
          ) {
            state.translating = action.payload;
        },
    }
})

export const {setInputLang , setInputCode , setOutputLang , setOutputCode , setTranslating} = transpilerSlice.actions;

export default transpilerSlice.reducer;