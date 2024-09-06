import { Draft, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Chat } from "@/common/interfaces/chat.interface";
import { ChatGroup } from "@/common/interfaces/chatGroup.interface";
import { createNewGroup, getChats, getGroups } from "./chatActions";
import { logout, login } from "../auth/authActions";
 

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
    setSelectedGroup(
      state: Draft<typeof initialState>,
      action: PayloadAction<(typeof initialState)["selectedGroup"]>,
    ) {
      state.selectedGroup = action.payload;
      state.recentlyGroupCreated = false
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
        console.log("group from addcase", group);
        // state.groups.unshift(group)
        // console.log("groups array from addcase", state.groups);
        state.selectedGroup = group;
        state.recentlyGroupCreated = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.recentlyGroupCreated = false;
      })
      .addCase(login.fulfilled, (state) => {
        state.recentlyGroupCreated = false;
      });
      // .addCase(createNewChatInGroup.fulfilled, (state, action) => {
      //   const updatedGroup = state.groups.find(
      //     (group) => group._id === action.meta.arg
      //   );
      //   if (updatedGroup) {
      //     updatedGroup.chats = updatedGroup.chats ?? []; 
      //     updatedGroup.chats.push(action.payload); // Add the new chat to the selected group
      //   }
      // });
  },
});

export const { setGroups, setSelectedGroup, setResponding, updateGroups , setShowModal , setModalContent , setRecentlyGroupCreated , setInitialPrompt} =
  chatSlice.actions;

export default chatSlice.reducer;
