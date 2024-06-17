import { Department } from "./department.interface";
import { Organization } from "./organization.interface";

export interface User {
    _id: string;
    name: string;
    email: string;
    pasword: string;
    role: string;
    status: string;
    organization: Organization | string;
    department: Department | string
    createdAt: Date;
    updatedAt: Date;
    __v: 0;
  }