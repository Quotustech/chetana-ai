'use client'
import 'regenerator-runtime/runtime';
import { Inter } from "next/font/google";
import Navigation from "@/components/Navigation/Navigation";
import CheckAuthentication from "@/components/CheckAuthentication/CheckAuthentication";
import { Toaster } from 'sonner';
import { useState } from "react";
import { Triangle } from "react-loader-spinner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);

  if(loading){
    return (
      <CheckAuthentication
        setLoading={setLoading}
        loading={loading}
        >
        <div className="h-[100svh] w-[100svw] flex justify-center items-center">
        <Triangle
          visible={true}
          height="100"
          width="100"
          color="#282D4D"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
          />
        </div>
      </CheckAuthentication>
    )
  }


  return (
    <CheckAuthentication 
    setLoading={setLoading}
    loading={loading}>
      {/* <Toaster /> */}
      <div className="flex h-svh relative w-svw">
        <Navigation />
        <div className="w-full">
          {children}
        </div>
      </div>
    </CheckAuthentication>
  );
}
