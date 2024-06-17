import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const ApiUrl = process.env.NEXT_PUBLIC_API_URL;
interface OpenAiData {
    message: string;
  }

export const sendToOpenAi = createAsyncThunk(
    "transpiler/send-to-open-ai",
    async (data: OpenAiData, thunkAPI) => {
      const token = Cookies.get("authToken");
      try {
        const res = await fetch(`${ApiUrl}/api/v1/chat`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.statusText === "OK") {
          return res.body;
        } else {
          throw new Error("Internal server error!!");
        }
      } catch (error: any) {
        // console.error(
        //   `Error from createAsyncThunk [${sendToOpenAi.pending.type}]:`,
        //   error
        // );
        return thunkAPI.rejectWithValue(error);
      }
    }
  );