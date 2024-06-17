import React from "react";
import { Metadata } from "next";
import SignIn from "@/src/components/Signin/Signin";

export const metadata: Metadata = {
  title: "Signin ",
  description: "Please sigin first to use admin dashboard",
  // other metadata
};

const SignInPage: React.FC = () => {
  return (
    <>
      <SignIn />
    </>
  );
};

export default SignInPage;
