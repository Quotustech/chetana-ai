
import { Chat } from "@/src/common/interfaces/chat.interface";
import { User } from "@/src/common/interfaces/user.interface";

type DepartmentState = {
  pendingUsers: User[];
  approvedUsers: User[];
  userChats: Chat[];
};

export const departmentState: DepartmentState = {
    pendingUsers: [],
    approvedUsers: [],
    userChats: []
};
