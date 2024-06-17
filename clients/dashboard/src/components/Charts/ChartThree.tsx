"use client";
import { ApexOptions } from "apexcharts";
import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { RootState, useSelector, useDispatch } from "@/src/Redux/store";
import {
  getAllDepts,
  getAllOrgs,
  getAllUsers,
} from "@/src/Redux/actions/superAdminAction";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const optionscolumnchart: ApexOptions = {
  chart: {
    type: "donut",
    fontFamily: "'Plus Jakarta Sans', sans-serif;",
    foreColor: "#adb0bb",
    toolbar: {
      show: false,
    },
    height: 170,
  },
  colors: ["#10B981", "#375E83", "#259AE6", "#FFA70B"],
  plotOptions: {
    pie: {
      startAngle: 0,
      endAngle: 360,
      donut: {
        size: "75%",
        background: "transparent",
      },
    },
  },
  stroke: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  responsive: [
    {
      breakpoint: 991,
      options: {
        chart: {
          width: 120,
        },
      },
    },
  ],
};

const ChartThree: React.FC = () => {
  const dispatch = useDispatch();
  const { users, organizations, approvedDepts } = useSelector(
    (state: RootState) => state.superAdminReducer
  );

  useEffect(() => {
    dispatch(getAllOrgs());
    dispatch(getAllUsers());
    dispatch(getAllDepts());
  }, []);

  const seriescolumnchart: any = [
    users.length,
    organizations.length,
    approvedDepts.length,
  ];
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5 flex flex-col items-center justify-center gap-8">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Users Analytics
          </h5>
        </div>
        <div></div>
      </div>

      <div className="mb-2">
        <div
          id="chartThree"
          className="mx-auto flex justify-center items-center"
        >
          <ReactApexChart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="donut"
            width={"100%"}
            height="150px"
          />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        <div className="w-full px-8 sm:w-1/2">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#10B981]"></span>
            <p className="flex w-full gap-3 text-sm font-medium text-black dark:text-white">
              <span> User </span>
              <span> {users.length} </span>
            </p>
          </div>
        </div>
        <div className="w-full px-8 sm:w-1/2">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#375E83]"></span>
            <p className="flex w-full gap-3 text-sm font-medium text-black dark:text-white">
              <span> Organizations </span>
              <span> {organizations.length} </span>
            </p>
          </div>
        </div>
        <div className="w-full px-8 sm:w-1/2">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#259AE6]"></span>
            <p className="flex w-full gap-3 text-sm font-medium text-black dark:text-white">
              <span> Departments </span>
              <span> {approvedDepts.length} </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
