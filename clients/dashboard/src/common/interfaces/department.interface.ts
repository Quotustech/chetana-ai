import { Organization } from "./organization.interface";

export interface Department {
    _id: string;
    name: string;
    deptHeadName: string;
    email: string;
    password: string;
    apiKey: string;
    description: string;
    status: string;
    role: string;
    chatGptModel: string;
    organization: Organization
      __v: 0
  }