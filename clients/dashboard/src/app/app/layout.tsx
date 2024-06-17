"use client";
// import "./globals.css";
import "./data-tables-css.css";
import "./satoshi.css";
import React, { useState, useEffect, Children } from "react";
import { usePathname } from "next/navigation";

import Sidebar from "@/src/components/Sidebar";
import Header from "@/src/components/Header";
import Checkauthentication from "@/src/components/Checkauthentication/Checkauthentication";
import { Triangle } from "react-loader-spinner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState<boolean>(true);

  if(loading){
    return (
      <Checkauthentication
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
      </Checkauthentication>
    )
  }

  return (
    <Checkauthentication
    setLoading={setLoading}
    loading={loading}
    >

      {!loading && <div className="dark:bg-boxdark-2 dark:text-bodydark">
        <div className="flex h-screen overflow-hidden">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main>
              <div className="mx-auto max-w-screen-2xl p-2 2xl:p-10">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>}
      

    </Checkauthentication>
  );
}
