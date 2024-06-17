"use client";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RootState, useDispatch, useSelector } from "@/redux/store";
import { getDepts, getOrgs, register } from "@/redux/slices/auth/authActions";
import { useCallback, useEffect, useState } from "react";
import { Organization } from "@/common/interfaces/organization.interface";
import { z } from "zod";
import { Department } from "@/common/interfaces/department.interface";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons"

const registerSchema = z.object({
  email: z.string().email("Invalid email address").regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "User name is required")
})


interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
}

type ActionResult = {
  payload: any;
  meta: {
    requestStatus: string;
  };
};

export default function Register() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { organizations , departments } = useSelector(
    (state: RootState) => state.authReducer
  );

  const [selectedOrg, setSelectedOrg] = useState<Organization>({} as Organization);
  const [selectedDept, setSelectedDept] = useState<Department>({} as Department);
  const initialState = { email: "", password: "" , name: ''};
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrgs = async () => {
      await dispatch(getOrgs());
    };
    fetchOrgs();
  }, []);

  useEffect(() => {
    if (selectedOrg._id) {
      fetchDepts();
    }
    fetchDepts();
  }, [selectedOrg._id]);

  const fetchDepts = useCallback(async()=> {
    await dispatch(getDepts(selectedOrg._id))
  } , [selectedOrg._id])

  const handleOrgChange = (value:string) => {
    const selectedOrgObject = organizations.find((org:Organization) => org.name === value) as Organization;
    setSelectedOrg(selectedOrgObject);
  };

  const handleDeptChange = (value:string) => {
    const selectedDeptObject = departments.find((dept:Department) => dept.name === value) as Department;
    setSelectedDept(selectedDeptObject);
  };

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
      const validatedData = registerSchema.parse(formData);
      // console.log("Validated Data:", validatedData);
      // console.log("Form data is valid:", formData);
      await dispatch(register({ 
        ...formData,
        organization: selectedOrg._id,
        department: selectedDept._id})).then((result)=>{
          if (register.fulfilled.match(result)) {
            const payload = result.payload; 
            if (payload.success) {
              toast.success(payload.message);
              router.push('/auth/login')
            }
          }else if(register.rejected.match(result)){
            const err = result.payload as { response: { data: any } };
            // console.log("+++++++++++", err.response.data);
            toast.error(err.response.data.message)
          }
        })
      
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
    }finally{
      setLoading(false)
    }
  };


  return (
    <>
      <div className="h-svh bg-white flex relative w-full">
        <div className="absolute hidden lg:block w-full h-full bg-white">
          <div className="h-[50%] bg-[#0e1525]"></div>
        </div>
        <div className="right lg:w-[50%] w-full z-10 bg-white flex justify-center items-center flex-col gap-3 xl:rounded-tr-[40%]">
          <form className="mx-auto flex w-11/12 flex-col justify-center space-y-6 xl:max-w-lg sm:max-w-md " onSubmit={handleSubmit}>
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Register</CardTitle>
                <CardDescription className="text-center">
                  Fill the form to Register
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">User Name</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder=""
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && (
                    <p className="text-tiny text-danger">{errors.name}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="orgs">Choose Organization</Label>
                  <Select onValueChange={(value)=> handleOrgChange(value)} value={selectedOrg.name} required>
                    <SelectTrigger id="orgs" className="w-full">
                      <SelectValue placeholder="Select an Organization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Organizations</SelectLabel>
                        {organizations.map((org) => {
                          return (
                            <SelectItem key={org._id} value={org.name}>
                              {org.name}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="orgs">Choose Department</Label>
                  <Select disabled={!selectedOrg.name || departments.length === 0} onValueChange={(value)=> handleDeptChange(value)} value={selectedDept.name} required>
                    <SelectTrigger id="orgs" className="w-full">
                      <SelectValue placeholder="Select a Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Departments</SelectLabel>
                        {departments.map((dept)=>{
                          return <SelectItem key={dept._id} value={dept.name}>{dept.name}</SelectItem>
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" name="email" placeholder="" value={formData.email}
                    onChange={handleInputChange}/>
                    {errors.email && (
                    <p className="text-tiny text-danger">{errors.email}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type={showPassword ? 'text' : 'password'} name="password" value={formData.password}
                    onChange={handleInputChange}/>
                    {errors.password && (
                    <p className="text-tiny text-danger">{errors.password}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2" onClick={()=> setShowPassword(!showPassword)}>
                  <Checkbox id="terms" />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Show Password
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button className="w-full" disabled={loading}>
                {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                  Register
                </Button>
                <p className="mt-2 text-xs text-center text-gray-700  dark:text-white">
                  Don&apos;t have an account?
                  <Link href="/auth/login">
                    <span className=" text-zinc-900 hover:underline dark:text-white">
                      Login
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
        <div className="left w-[50%] z-10 bg-[#0e1525] xl:rounded-bl-[40%] hidden lg:block"></div>
      </div>
    </>
  );
}
