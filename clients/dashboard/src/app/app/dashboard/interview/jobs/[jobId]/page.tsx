import React from "react";
import { Metadata } from "next";
import JobDetails from "@/src/components/Jobs/JobDetails";

export const metadata: Metadata = {
  title: "Job Details Page",
  description: "This is Job Detail Page for Techmate Dashboard",
  // other metadata
};

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex items-center flex-col">
      <JobDetails />
    </div>
  );
};

export default page;
