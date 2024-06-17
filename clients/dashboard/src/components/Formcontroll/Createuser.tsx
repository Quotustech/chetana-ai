"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "@/src/Redux/store";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { RootState } from "@/src/Redux/store";
import { useSelector } from "react-redux";
import { createUser } from "@/src/Redux/actions/superAdminAction";

interface USERFORMDATA {
  name: string;
  email: string;
  password: string;
}

const CreateUserForm = () => {
  const { accessToken } = useSelector((state: RootState) => state.authReducer);
  const router = useRouter();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<Partial<USERFORMDATA>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const initialState = {
    name: "",
    email: "",
    password: "",
  };
  const [orgFormData, setOrgFormData] = useState<USERFORMDATA>(initialState);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setOrgFormData({ ...orgFormData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // console.log('clicked')
    setLoading(true);
    const validationErrors: Partial<USERFORMDATA> = {};
    // setLoading(false);

    if (!orgFormData.name.trim()) {
      validationErrors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]*$/.test(orgFormData.name)) {
      validationErrors.name = "Name should only contain letters and spaces";
    }

    if (!orgFormData.email.trim()) {
      validationErrors.email = "email is required";
    }

    if (!orgFormData.password.trim()) {
      validationErrors.password = "password is required";
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form");
      setLoading(false);
      return;
    }
    try {
      dispatch(createUser({
        ...orgFormData,
        role: "user",
      })).then((result) => {
        if (createUser.fulfilled.match(result)) {
          const payload = result.payload;
          if (payload.success) {
            router.push("/app/dashboard/users");
            toast.success(payload.message);
          }
        } else if (createUser.rejected.match(result)) {
          const err = result.payload as { response: { data: any } };
          // console.log("+++++++++++", err.response.data);
          toast.error(err.response.data.message);
        }
      });

      setOrgFormData(initialState);
      setErrors({});
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error);
    }
  };
  return (
    <>
      <div className="w-full flex  mt-5 flex-col justify-center items-center gap-9">
        <div className="md:w-5/6 w-full">
          {/* <!-- Create Organization Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form onSubmit={onSubmitHandler}>
              <div className="p-6.5 flex justify-center flex-col items-center gap-7">
                <div className="flex gap-7 flex-col justify-center items-center w-5/6 ">
                  <div className="md:w-1/2 w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      onChange={onChangeHandler}
                      value={orgFormData.name}
                      placeholder="Enter user Name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    {errors.name && (
                      <p className="text-meta-1 text-sm font-semibold">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="md:w-1/2 w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Email <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      onChange={onChangeHandler}
                      value={orgFormData.email}
                      placeholder="Enter user email"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    {errors.email && (
                      <p className="text-meta-1 text-sm font-semibold">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="md:w-1/2 w-full ">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Password <span className="text-meta-1">*</span>
                    </label>
                    <div className="w-full relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        onChange={onChangeHandler}
                        value={orgFormData.password}
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
                    {errors.password && (
                      <p className="text-meta-1 text-sm font-semibold">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-5/12 justify-center rounded bg-primary p-3 font-medium text-gray"
                >
                  {loading ? (
                    <>
                      <Loader2 className="ml-4 w-6 h-6 animate-spin" />
                    </>
                  ) : (
                    <>Create User</>
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

export default CreateUserForm;
