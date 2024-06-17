import React from "react";
import TableFive from "@/src/components/Tables/TableFive";
import { Metadata } from "next";
import Breadcrumb from "@/src/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
  title: " Users Page",
  description: "This is Users Page for Techmate Dashboard",
  // other metadata
};

const columns = [
  { name: "sl.no" },
  { name: "name" },
  { name: "email" },
  { name: "department" },
  { name: "organization" },
];

const Users = () => {
  return (
    <>
      <Breadcrumb pageName="dashboard/users" />
      <TableFive columns={columns} type="users" />
    </>
  );
};

export default Users;
