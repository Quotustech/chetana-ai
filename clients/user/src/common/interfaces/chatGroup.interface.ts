import { Chat } from "./chat.interface";
import { User } from "./user.interface";

export interface ChatGroup {
    _id: string;
    user: User;
    chats?: Chat[];
    createdAt: Date;
    updatedAt: Date;
    __v: 0;
  }