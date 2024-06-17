import React from "react";
import TableFive from "@/src/components/Tables/TableFive";
import { Metadata } from "next";
import Breadcrumb from "@/src/components/Breadcrumbs/Breadcrumb";
import Checkrole from "@/src/components/Checkrole/Checkrole";

export const metadata: Metadata = {
  title: " Departments  ",
  description: "This is Departments Page for Techmate Dashboard",
  // other metadata
};


const columns = [
  { name: "sl.no" },
  { name: "deptHeadName" },
  { name: "email" },
  { name: "name" },
  { name: "organization" },
  { name: "status" },
];

const Departments = () => {
  return (
    <>
      <Breadcrumb pageName="dashboard/departments" />
      <TableFive columns={columns} type="departments" />
    </>
  );
};

export default Checkrole(Departments , ['superadmin' , 'admin']);
