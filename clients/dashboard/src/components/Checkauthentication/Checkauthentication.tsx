"use client";
import { useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { RootState, useDispatch } from "@/src/Redux/store";
import { setAccessToken, setUser } from "@/src/Redux/slices/authSlice";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { getProfile } from "@/src/Redux/actions/authActions";

type Token = string;
interface JwtPayload {
  email: string;
  role: string;
}

const Checkauthentication = ({
  children,
  setLoading
}: {
  children: React.ReactNode;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: Boolean;
}) => {
  const router = useRouter();
  const path = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.authReducer);

  const token: Token | undefined = Cookies.get("auth");

  const retrieveUser = useCallback(async () => {
    try {
      if (!token || !user) {
        router.push("/signin");
        // setLoading(false);
      } else {
        const { email, role }: JwtPayload = jwtDecode(token);
        // console.log("user decoded data", { email, role });
        dispatch(getProfile({ email, role })).then((result) => {
          if (getProfile.fulfilled.match(result)) {
            const payload = result.payload;
            if (payload.success) {
              dispatch(setAccessToken(token));
              dispatch(setUser({...payload.data , role}));
            }
          } else if (getProfile.rejected.match(result)) {
            const err = result.payload as { response: { data: any } };
            // console.log("+++++++++++", err.response.data);
          }
        });
        // console.log("successfully added");
      }
    } catch (error) {
      // console.log("error while fetching the user", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, getProfile, router, user]);

  useEffect(() => {
    retrieveUser();
  }, []);

  return <>{children}</>;
};

export default Checkauthentication;
