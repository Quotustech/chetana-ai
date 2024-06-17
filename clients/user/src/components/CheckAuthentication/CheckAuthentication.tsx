'use client'
import React, { useEffect, useCallback, useState } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "@/redux/store";
import { jwtDecode } from "jwt-decode";
import { getProfile } from "@/redux/slices/auth/authActions";
import { useRouter } from "next/navigation";
import { Triangle } from 'react-loader-spinner'
import { usePathname } from "next/navigation";

type ActionResult = {
  meta: {
    requestStatus: string;
  };
};

type Token = string;
interface JwtPayload {
  userId: string;
}

const CheckAuthentication = ({
  children , loading , setLoading
}: {
  children: React.ReactNode;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: Boolean
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const param = usePathname();

  const token: Token | undefined = Cookies.get("authToken");

  const retrieveUser = useCallback(async () => {
    try {
      setLoading(true);
      const decoded: JwtPayload = jwtDecode(token as string);
      await dispatch(getProfile(decoded.userId)).then((result: ActionResult) => {
        if (result.meta.requestStatus === "fulfilled") {
          router.push(param); 
        } else {
          // console.log("error while retrieving the user");
          router.push("/auth/login");
        }
      });
    } catch (error) {
      // console.log("error while fetching the user", error);
      router.push("/auth/login");
    }finally{
      setLoading(false);
    }
  }, [dispatch, router, token]);

  useEffect(() => {
      if (!token) {
        router.push("/auth/login");
      } else {
        retrieveUser();
      }
  }, [router, retrieveUser, token]);

  if(loading){
    return <div className="h-[100svh] w-[100svw] flex justify-center items-center">
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
  }

  return <>{children}</>;
};

export default CheckAuthentication;
