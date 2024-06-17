import { User } from "./user.interface";

export interface Chat {
    _id: string;
    user: User;
    question: string;
    answer: string;
    groupId: string;
    createdAt: Date;
    updatedAt: Date;
    __v: 0;
  }