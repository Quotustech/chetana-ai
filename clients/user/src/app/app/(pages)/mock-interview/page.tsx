import FeatureSection from "@/components/mock-interview/FeaturedSection";
import Hero from "@/components/mock-interview/Hero";
import JobRole from "@/components/mock-interview/JobRole";
import React from "react";

type Props = {};

export default function page({}: Props) {
  return (
    <div className="h-svh overflow-y-scroll dark:bg-[#0e1525] dark:text-white">
      <Hero /> 
      {/* <FeatureSection />  */}
      <JobRole />
    </div>
  );
}
