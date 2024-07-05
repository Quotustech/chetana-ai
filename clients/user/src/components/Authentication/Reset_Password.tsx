"use client";
import React, { useState } from "react";
import { z } from "zod";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useAppDispatch } from "@/hooks/useAppDispatch"; // Adjust the import path according to your folder structure
import { resetPassword } from "@/redux/slices/auth/authActions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { SerializedError } from "@reduxjs/toolkit";
import { Checkbox } from "@radix-ui/react-checkbox";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

// import { useParams } from "react-router-dom";


const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
});

interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

interface ResetPasswordProps {
  token: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  // const { token } = useParams<{ token: string }>(); // Extract 'token' from URL path
  const params = useParams();
  const token = params.token as string;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      setLoading(true);
      const validatedData = resetPasswordSchema.parse(formData);

      if (validatedData.password !== validatedData.confirmPassword) {
        setErrors({ confirmPassword: "Passwords do not match" });
        return;
      }

      const result = await dispatch(
        resetPassword({ token , password: validatedData.password })
      );

      if (resetPassword.fulfilled.match(result)) {
        const payload = result.payload as { success: boolean };
        if (payload.success) {
          toast.success("Password has been reset successfully");
          router.push("/auth/login");
        }
      } else if (resetPassword.rejected.match(result)) {
        const err = result.payload as SerializedError;
        toast.error(err.message || "An error occurred");
      }
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

  return (
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
              <CardTitle className="text-center text-2xl">
                Reset Password
              </CardTitle>
              <CardDescription className="text-center">
                Enter your new password
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={handleInputChange}
                    value={formData.password}
                    className="pr-10" // Add padding to the right to make space for the button
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <AiFillEyeInvisible className="h-5 w-5 text-gray-500" />
                    ) : (
                      <AiFillEye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-tiny text-danger">{errors.password}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    onChange={handleInputChange}
                    value={formData.confirmPassword}
                    className="pr-10" // Add padding to the right to make space for the button
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 transform -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <AiFillEyeInvisible className="h-5 w-5 text-gray-500" />
                    ) : (
                      <AiFillEye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-tiny text-danger">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit" disabled={loading}>
                {loading && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Reset Password
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
