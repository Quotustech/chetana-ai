import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { ChatGroup } from "@/common/interfaces/chatGroup.interface";
import { Chat } from "@/common/interfaces/chat.interface";
import { setGroups, updateGroups } from "./chatSlice";
import { Store } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

const ApiUrl = process.env.NEXT_PUBLIC_API_URL;

interface ResObject<T> {
  success: boolean;
  message: string;
  data: T;
}

interface Id {
  userId: string;
}

interface OpenAiData {
  message: string;
  userId: string;
  groupId: string;
}

export const getGroups = createAsyncThunk(
  "chat/get-groups",
  async (userId: string, thunkAPI) => {
    try {
      const token = Cookies.get("authToken");
      const res = await axios.get<ResObject<ChatGroup[]>>(
        `${ApiUrl}/api/v1/chatGroup/${userId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (res.statusText === "OK") {
        return res.data;
      } else {
        throw new Error("error while getting groups");
      }
    } catch (error: any) {
      // console.error(
      //   `Error from createAsyncThunk [${getGroups.pending.type}]:`,
      //   error
      // );
      return thunkAPI.rejectWithValue({ errorMessage: error.message });
    }
  }
);

export const getChats = createAsyncThunk(
  "chat/get-chats",
  async (userId: string, thunkAPI) => {
    try {
      const token = Cookies.get("authToken");
      const res = await axios.get<ResObject<Chat[]>>(
        `${ApiUrl}/api/v1/allChat/${userId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (res.statusText === "OK") {
        return res.data;
      } else {
        throw new Error("error while getting chats");
      }
    } catch (error: any) {
      // console.error(
      //   `Error from createAsyncThunk [${getChats.pending.type}]:`,
      //   error
      // );
      return thunkAPI.rejectWithValue({ errorMessage: error.message });
    }
  }
);

export const createNewGroup = createAsyncThunk(
  "chat/create-new-group",
  async (userId: string, thunkAPI) => {
    try {
      const state:RootState = thunkAPI.getState() as RootState;
      if(state.chatReducer.recentlyGroupCreated){
        throw new Error("Group creation recently completed.");
      }
      const token = Cookies.get("authToken");
      const res = await axios.post<ResObject<ChatGroup>>(
        `${ApiUrl}/api/v1/chatGroup/${userId}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (res.data.success) {
        const group: ChatGroup = { ...res.data.data, chats: [] } as ChatGroup
        thunkAPI.dispatch(updateGroups(group))
        return res.data;
      } else {
        throw new Error("error while getting chats");
      }

    } catch (error: any) {
      // console.error(
      //   `Error from createAsyncThunk [${createNewGroup.pending.type}]:`,
      //   error
      // );
      return thunkAPI.rejectWithValue({ errorMessage: error.message });
    }
  }
);

export const getAllChatByGroupId = createAsyncThunk(
  "chat/get-all-chat-by-group-id",
  async (groupId: string, thunkAPI) => {
    try {
      const token = Cookies.get("authToken");
      const res = await axios.get<ResObject<Chat[]>>(
        `${ApiUrl}/api/v1/share/${groupId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (res.statusText === "OK") {
        return res.data;
        // console.log(')_)_)_)_)_)_)_)_)_)_)' , res.data)
      } else {
        throw new Error("error while getting chats");
      }

    } catch (error: any) {
      // console.error(
      //   `Error from createAsyncThunk [${getAllChatByGroupId.pending.type}]:`,
      //   error
      // );
      return thunkAPI.rejectWithValue({ errorMessage: error.message });
    }
  }
);

export const sendToOpenAi = createAsyncThunk(
  "chat/send-to-open-ai",
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

      // console.log('---=-=-=-=-', res);
      if (res.statusText === "OK") {
        return res.body;
      } else {
        throw new Error("Internal Server Error!!");
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
