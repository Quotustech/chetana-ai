import { User } from "./user.interface";

export interface Chat {
    text: any;
    _id: string;
    user: User;
    question: string;
    groupId: string;
    answer: string;
    createdAt: Date;
    updatedAt: Date;
    __v: 0;
  }