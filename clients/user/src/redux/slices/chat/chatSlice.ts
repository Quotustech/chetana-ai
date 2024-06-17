import { Draft, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Chat } from "@/common/interfaces/chat.interface";
import { ChatGroup } from "@/common/interfaces/chatGroup.interface";
import { createNewGroup, getChats, getGroups } from "./chatActions";

type InitialState = {
  chats: Chat[];
  groups: ChatGroup[];
  selectedGroup: ChatGroup;
  responding: boolean;
  showModal: boolean;
  modalContent: { codeSnippet: string, language: string }
  recentlyGroupCreated: boolean;
  initialPrompt: string
};

const initialState: InitialState = {
  chats: [] as Chat[],
  groups: [] as ChatGroup[],
  selectedGroup: {} as ChatGroup,
  responding: false,
  showModal: false,
  modalContent:{ codeSnippet: '', language: '' },
  recentlyGroupCreated: false,
  initialPrompt: ''
};

const chatSlice = createSlice({
  name: "chatSlice",
  initialState,
  reducers: {
    setGroups(
      state: Draft<typeof initialState>,
      action: PayloadAction<(typeof initialState)["groups"]>,
    ) {
      state.groups = action.payload;
    },
    updateGroups(
      state: Draft<typeof initialState>,
      action: PayloadAction<ChatGroup>,
    ) {
      state.groups.unshift(action.payload);
    },
    setSelcetedGroup(
      state: Draft<typeof initialState>,
      action: PayloadAction<(typeof initialState)["selectedGroup"]>,
    ) {
      state.selectedGroup = action.payload;
    },
    setResponding(
      state: Draft<typeof initialState>,
      action: PayloadAction<(typeof initialState)["responding"]>,
    ) {
      state.responding = action.payload;
    },
    setShowModal(
      state: Draft<typeof initialState>,
      action: PayloadAction<(typeof initialState)["showModal"]>,
    ) {
      state.showModal = action.payload;
    },
    setRecentlyGroupCreated(
      state: Draft<typeof initialState>,
      action: PayloadAction<(typeof initialState)["recentlyGroupCreated"]>,
    ) {
      state.recentlyGroupCreated = action.payload;
    },
    setModalContent(
      state: Draft<typeof initialState>,
      action: PayloadAction<(typeof initialState)["modalContent"]>,
    ) {
      state.modalContent = action.payload;
    },
    setInitialPrompt(
      state: Draft<typeof initialState>,
      action: PayloadAction<(typeof initialState)["initialPrompt"]>,
    ) {
      state.initialPrompt = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getGroups.fulfilled, (state, { payload }) => {
        // state.groups = payload;
      })
      .addCase(getChats.fulfilled, (state, { payload }) => {
        state.chats = payload.data;
      })
      .addCase(createNewGroup.fulfilled, (state, { payload }) => {
        const group = { ...payload.data, chats: [] };
        // console.log("group from addcase", group);
        // state.groups.unshift(group)
        // console.log("groups array from addcase", state.groups);
        state.selectedGroup = group;
        state.recentlyGroupCreated = true;
      });
  },
});

export const { setGroups, setSelcetedGroup, setResponding, updateGroups , setShowModal , setModalContent , setRecentlyGroupCreated , setInitialPrompt} =
  chatSlice.actions;

export default chatSlice.reducer;
