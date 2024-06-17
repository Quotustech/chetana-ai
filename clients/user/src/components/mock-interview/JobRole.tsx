"use client"

import React, { useEffect } from 'react';
import { jobRole } from '../../utils/ConstantData';
import { useRouter } from 'next/navigation';
import { useSelector, RootState, useDispatch } from "@/redux/store";
import { getJobs } from '@/redux/slices/job/jobActions';
import { IJob } from '@/common/interfaces/job.interface';
import { toast } from "sonner";

type Props = {};

const BoxComponent = ({ name, role , jobId}: { name: string, role: string, jobId:string }) => {

    const router = useRouter();
    const interview = () => {
        router.push(`/app/mock-interview/${jobId}`)
    }


    return (
        <div className="border lg:w-[15rem] sm:w-[10rem] h-[5rem] rounded-lg cursor-pointer  hover:bg-slate-400 transition bg-[hsl(218,81%,95%)] shadow-md flex justify-center items-center">
            <h2 className="font-semibold text-black lg:text-lg  sm:text-sm md:text-md" onClick={interview}>{name}</h2>
        </div>
    );
};

const JobRole = (props: Props) => {

    const dispatch = useDispatch();
    const { isError, isLoading, jobs } = useSelector((state: RootState) => state.jobReducer);
    useEffect(() => {
        dispatch(getJobs())
    }, [dispatch]);
    
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        toast.error("Error in getting jobs");
    }

    return (
        <div className="bg-[#f9f9f9] text-black dark:bg-[#0E1525] dark:text-white p-1 md:p-4 flex flex-col items-center">
            <div>
                <h1 className="dark:text-[hsl(218,81%,95%)] mb-7 sm:text-lg md:text-xl lg:text-4xl  font-semibold p-5 pb-1 md:p-11 mt-3">
                    Utilise the most popular job roles to begin your
                    <span className='text-[hsl(218,81%,75%)] font-semibold'> Mock Interview</span>
                </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pb-5">
                {isLoading ?
                    <h1>Loading...</h1>
                    :
                    <>
                        {jobs.map((role: IJob) => (
                            <BoxComponent key={role._id} name={role.jobName} role={role.jobRole} jobId={role._id} />
                        ))}
                    </>
                }
            </div>
        </div>
    );
};

export default JobRole;
