
import { User } from "@/src/common/interfaces/user.interface";
import { Organization } from "@/src/common/interfaces/organization.interface";
import { Department} from '@/src/common/interfaces/department.interface'
import { Chat } from "@/src/common/interfaces/chat.interface";

type SuperAdminState = {
  organizations: Organization[],
  users: User[],
  approvedDepts: Department[],
  pendingDepts: Department[],
  chats: Chat[]
};

export const superAdminState: SuperAdminState = {
    organizations: [],
    users: [],
    approvedDepts: [],
    pendingDepts: [],
    chats: []
};
