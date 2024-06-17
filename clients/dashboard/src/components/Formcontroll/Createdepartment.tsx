"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "@/src/Redux/store";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { RootState } from "@/src/Redux/store";
import { useSelector } from "react-redux";
import { createDept } from "@/src/Redux/actions/organizationAction";

interface DEPTFORMDATA {
  deptHeadName: string;
  email: string;
  password: string;
  description: string;
  name: string;
}

const CreateDepartmentForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.authReducer);
  const [errors, setErrors] = useState<Partial<DEPTFORMDATA>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const initialState = {
    deptHeadName: "",
    email: "",
    description: "",
    password: "",
    name: ""
  };
  const [deptFormData, setDeptFormData] = useState<DEPTFORMDATA>(initialState);

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setDeptFormData({ ...deptFormData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    const validationErrors: Partial<DEPTFORMDATA> = {};
    // setLoading(false);

    if (!deptFormData.deptHeadName.trim()) {
      validationErrors.deptHeadName = "Name is required";
    } else if (!/^[a-zA-Z\s]*$/.test(deptFormData.deptHeadName)) {
      validationErrors.deptHeadName = "Name should only contain letters and spaces";
    }

    if (!deptFormData.email.trim()) {
      validationErrors.email = "email is required";
    }else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(deptFormData.email)) {
      validationErrors.email = "Enter a valid email";
    }

    if (!deptFormData.password.trim()) {
      validationErrors.password = "password is required";
    }
    if (!deptFormData.description.trim()) {
      validationErrors.description = "description is required";
    }
    if (!deptFormData.name.trim()) {
      validationErrors.name = "Department name is required";
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form");
      setLoading(false);
      return;
    }
    try {
      dispatch(createDept({
        ...deptFormData,
        organization: user._id,
      })).then((result) => {
        if (createDept.fulfilled.match(result)) {
          const payload = result.payload;
          if (payload.success) {
            router.push("/app/dashboard/departments");
            toast.success(payload.message);
          }
        } else if (createDept.rejected.match(result)) {
          const err = result.payload as { response: { data: any } };
          // console.log("+++++++++++", err.response.data);
          toast.error(err.response.data.message);
        }
      });
      setDeptFormData(initialState);
      setErrors({});
      setLoading(false);
    } catch (error:any) {
      setLoading(false);
      toast.error(error);
    }
  };
  return (
    <>
      <div className="w-full flex  mt-5 flex-col justify-center items-center gap-9">
        <div className="w-5/6">
          {/* <!-- Create Organization Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form onSubmit={onSubmitHandler}>
              <div className="p-6.5">
                <div className="mb-4.5 flex gap-6 xl:flex-row w-full">
                  <div className="w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="deptHeadName"
                      onChange={onChangeHandler}
                      value={deptFormData.deptHeadName}
                      placeholder="Enter Dept Head Name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    {errors.deptHeadName && (
                      <p className="text-[#f14545] text-xs mt-1 ml-1 font-semibold">
                        {errors.deptHeadName}
                      </p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Department Email <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      onChange={onChangeHandler}
                      value={deptFormData.email}
                      placeholder="Enter Department email"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    {errors.email && (
                      <p className="text-[#f14545] text-xs mt-1 ml-1  font-semibold">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4.5 flex gap-6 xl:flex-row w-full">
                  <div className="w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Department Name
                      <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      onChange={onChangeHandler}
                      value={deptFormData.name}
                      placeholder="Enter Department Name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    {errors.name && (
                      <p className="text-[#f14545] text-xs mt-1 ml-1  font-semibold">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="w-1/2 ">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Password <span className="text-meta-1">*</span>
                      
                    </label>

                    <div className="w-full relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        onChange={onChangeHandler}
                        value={deptFormData.password}
                        placeholder="Enter Password"
                        className=" w-full rounded border-[1.5px] border-stroke bg-transparent pr-12 py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                     
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute bottom-4 right-4 outline-none"
                      >
                        {showPassword ? (
                           <Eye size={20} />
                          
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </button>
                    </div>
                    <span className="text-xs font-extralight text-[#535353]">
                        (Password should be 6 characters long & contain a mix of
                        characters.)
                      </span>
                    {errors.password && (
                      <p className="text-[#f14545] text-xs mt-1 ml-1  font-semibold">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-full ">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Description <span className="text-meta-1">*</span>
                  </label>
                  <div className="w-full relative">
                    <textarea
                      name="description"
                      onChange={onChangeHandler}
                      value={deptFormData.description}
                      placeholder="Enter Description"
                      className=" w-full rounded border-[1.5px] border-stroke bg-transparent pr-12 py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    ></textarea>
                  </div>
                  {errors.description && (
                    <p className="text-[#f14545] text-xs mt-1 ml-1  font-semibold">
                      {errors.description}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded bg-primary p-3 mt-2 font-medium text-gray"
                >
                  {loading ? (
                    <>
                      <Loader2 className="ml-4 w-6 h-6 animate-spin" />
                    </>
                  ) : (
                    <>Create Department</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateDepartmentForm;
