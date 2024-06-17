"use client";
import React, { useEffect } from "react";
import CardDataStats from "../CardDataStats";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector, RootState } from "@/src/Redux/store";
import JobModal from "../Modal/JobModal";
import {useGetAllJobs} from '@/src/utils/hooks/use-superadmin';
import { getJobs } from "@/src/Redux/actions/interviesAction";

type Props = {};

const Jobs = (props: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showJobModal , jobs } = useSelector(
    (state: RootState) => state.interviewReducer
  );
    useEffect(() => {
      dispatch(getJobs())
    }, [])
    

  return (
    <>
      {showJobModal && <JobModal />}
      {jobs.length === 0 && <div className="w-full text-center">No jobs available</div>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6  xl:grid-cols-4 2xl:gap-7.5 mt-4 relative">
        {jobs.map((job) => (
          <div
            className="cursor-pointer"
            onClick={() =>
              router.push(`/app/dashboard/interview/jobs/${job._id}`)
            }
            key={job._id}
          >
            <CardDataStats
              title={job.jobName}
              total={``}
            ></CardDataStats>
          </div>
        ))}
      </div>
    </>
  );
};

export default Jobs;
