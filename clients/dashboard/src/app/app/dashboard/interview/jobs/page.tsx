import React from 'react'
import Jobs from '@/src/components/Jobs/Jobs'
import { Metadata } from "next";
import Breadcrumb from "@/src/components/Breadcrumbs/Breadcrumb";
import Checkrole from "@/src/components/Checkrole/Checkrole";

export const metadata: Metadata = {
  title: "Jobs",
  description: "This is Jobs Page for Techmate Dashboard",
  // other metadata
};

type Props = {}

const page = (props: Props) => {
  return (
    <>
    <Breadcrumb pageName="dashboard/jobs" />
    <Jobs/>
    </>
  )
}

export default page