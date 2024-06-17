
import { Chat } from "@/src/common/interfaces/chat.interface";
import { Department } from "@/src/common/interfaces/department.interface";
import { User } from "@/src/common/interfaces/user.interface";

type OrganizationState = {
  allDepartments: Department[],
  orgUsers: User[];
  orgUserChats: Chat[]
};

export const organizationState: OrganizationState = {
  allDepartments: [],
  orgUsers: [],
  orgUserChats: [] as Chat[]
};
