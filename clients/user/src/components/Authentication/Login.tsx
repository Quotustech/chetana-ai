"use client";
import React, { useState } from "react";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch } from "@/redux/store";
import { forgotPassword, login } from "@/redux/slices/auth/authActions";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { useSelector, RootState } from "@/redux/store";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

interface FormErrors {
  email?: string;
  password?: string;
  resetPassEmail?: string;
}

type ActionResult = {
  payload: any;
  meta: {
    requestStatus: string;
  };
};

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const initialState = { email: "", password: "" };
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showForgotpass, setShowForgotpass] = useState<boolean>(false);
  const [resetPassEmail, setResetPassEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.authReducer);

  const token = Cookies.get("authToken");

  if (token && user.name) {
    router.push("/app");
  }

  // Function to handle input changes
  const handleInputChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle form submission
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      setLoading(true);
      const validatedData = loginSchema.parse(formData);
      await dispatch(login(validatedData)).then((result) => {
        if (login.fulfilled.match(result)) {
          const payload = result.payload;
          if (payload.success) {
            toast.success(payload.message);
            router.push("/app");
          }
        } else if (login.rejected.match(result)) {
          const err = result.payload as { response: { data: any } };
          // console.log("+++++++++++", err.response.data);
          toast.error(err.response.data.message);
        }
      });
    } catch (error: any) {
      console.error("Validation Error:", error);
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const fieldName = (err.path[0] as string) || "unknown";
          fieldErrors[fieldName] = err.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPass = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setSendingEmail(true);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(resetPassEmail)) {
        // console.log("Invalid email address");
        const newErrors = {
          ...errors,
          resetPassEmail: "Invalid email address",
        };
        setErrors(newErrors);
        return;
      }
      await dispatch(forgotPassword(resetPassEmail)).then((result) => {
        if (forgotPassword.fulfilled.match(result)) {
          const payload = result.payload;
          if (payload.success) {
            toast.success(payload.message);
            setResetPassEmail("");
            setShowForgotpass(false);
          }
        } else if (forgotPassword.rejected.match(result)) {
          const err = result.payload as { response: { data: any } };
          // console.log("+++++++++++", err.response.data);
          toast.error(err.response.data.message);
        }
      });
    } catch (error) {
      // console.log("error while sending the email: ", error);
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <>
      <div className="relative flex h-svh w-full bg-white">
        <div className="absolute hidden h-full w-full bg-white lg:block">
          <div className="h-[50%] bg-[#0e1525]"></div>
        </div>
        <div className="left z-10 hidden w-[50%] bg-[#0e1525] lg:block xl:rounded-br-[40%]"></div>
        <div className="right z-10 flex w-full flex-col items-center justify-center gap-3 bg-white lg:w-[50%] xl:rounded-tl-[40%]">
          <form
            className="mx-auto flex w-11/12 flex-col justify-center space-y-6 sm:max-w-md xl:max-w-lg "
            onSubmit={handleSubmit}
          >
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-center text-2xl">Login</CardTitle>
                <CardDescription className="text-center">
                  Enter your email and password to login
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder=""
                    onChange={handleInputChange}
                    value={formData.email}
                  />
                  {errors.email && (
                    <p className="text-tiny text-danger">{errors.email}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={handleInputChange}
                    value={formData.password}
                  />
                  {errors.password && (
                    <p className="text-tiny text-danger">{errors.password}</p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPassword((prev) => !prev);
                      }}
                    />
                    <span className="text-sm font-medium cursor-default">Show Password</span>
                  </div>
                  <div>
                    <p
                      className="cursor-pointer self-end text-tiny"
                      onClick={() => setShowForgotpass(!showForgotpass)}
                    >
                      Forgot password?
                    </p>
                  </div>
                </div>
                {showForgotpass && (
                  <div className="grid gap-2">
                    <Label htmlFor="resetemail">Enter Email</Label>
                    <Input
                      id="resetemail"
                      type="text"
                      name="resetemail"
                      onChange={(e) => setResetPassEmail(e.target.value)}
                      value={resetPassEmail}
                    />
                    {errors.resetPassEmail && (
                      <p className="text-tiny text-danger">
                        {errors.resetPassEmail}
                      </p>
                    )}
                    <Button
                      className="w-full"
                      disabled={sendingEmail}
                      onClick={handleForgotPass}
                    >
                      {sendingEmail && (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Send Reset Email
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button
                  className="w-full"
                  type="submit"
                  disabled={loading || showForgotpass}
                >
                  {loading && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Login
                </Button>
                <p className="mt-2 text-center text-xs text-gray-700  dark:text-white">
                  Don&apos;t have an account?
                  <Link href="/auth/register">
                    <span className=" text-zinc-900 hover:underline dark:text-white">
                      Register
                    </span>
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>
            and
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
