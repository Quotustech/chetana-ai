import React from "react";
import TableFive from "@/src/components/Tables/TableFive";
import { Metadata } from "next";
import Breadcrumb from "@/src/components/Breadcrumbs/Breadcrumb";
import Checkrole from "@/src/components/Checkrole/Checkrole";

export const metadata: Metadata = {
  title: " Organizations  ",
  description: "This is Organizations Page for Techmate Dashboard",
  // other metadata
};

const columns = [
  { name: "sl.no" },
  { name: "name" },
  { name: "email" },
  { name: "phoneNumber" }
];

const Organizations = () => {
  return (
    <>
      <Breadcrumb pageName="dashboard/organizations" />
      <TableFive columns={columns} type="organizations" />
    </>
  );
};

export default Checkrole(Organizations , ['superadmin']);