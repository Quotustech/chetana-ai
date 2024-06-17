import React from "react";
import { Metadata } from "next";
import Breadcrumb from "@/src/components/Breadcrumbs/Breadcrumb";
import ChartThree from "@/src/components/Charts/ChartThree";
import BarChart from "@/src/components/Charts/BarChart";
import Checkrole from "@/src/components/Checkrole/Checkrole";

export const metadata: Metadata = {
  title: " Usage Page ",
  description: "This is Usage Page for Techmate Dashboard",
  // other metadata
};

const Usage = () => {
  return (
    <>
      <Breadcrumb pageName="dashboard/usage" />
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-full">

        {/* <ChartOne /> */}
        </div>
        <ChartThree />
         <BarChart/>
        <div className="col-span-12 xl:col-span-8">
        </div>
      </div>
    </>
  );
};

export default Checkrole(Usage , ['superadmin']);
