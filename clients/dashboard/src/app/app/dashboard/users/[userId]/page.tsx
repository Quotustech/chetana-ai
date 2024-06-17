import React from "react";
import { Metadata } from "next";
import Details from "@/src/components/UserDetails/Details";

export const metadata: Metadata = {
  title: " User Details Page",
  description: "This is  User Details Page for Techmate Dashboard",
  // other metadata
};

const Users = () => {
  return (
    <>
      <Details/>
    </>
  );
};

export default Users;
