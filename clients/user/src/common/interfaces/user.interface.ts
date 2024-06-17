export interface User {
    orgName?: string;
    deptName?: string;
    _id: string;
    name: string;
    email: string;
    pasword: string;
    role: string;
    status: string;
    orgCode?: string;
    department?: string
    createdAt: Date;
    updatedAt: Date;
    __v: 0;
  }