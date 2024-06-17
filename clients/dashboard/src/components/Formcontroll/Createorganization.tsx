"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "@/src/Redux/store";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createOrg } from "@/src/Redux/actions/superAdminAction";

interface ORGFORMDATA {
  name: string;
  email: string;
  phoneNumber: number | string;
  password: string;
}

const CreateOrganizationForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<Partial<ORGFORMDATA>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const initialState = {
    name: "",
    email: "",
    phoneNumber: 0,
    password: "",
  };
  const [orgFormData, setOrgFormData] = useState<ORGFORMDATA>(initialState);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setOrgFormData({ ...orgFormData, [e.target.name]: e.target.value });
  };

  const onPhoneNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setOrgFormData({ ...orgFormData, phoneNumber: numericValue });
  };

  const onSubmitHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    const validationErrors: Partial<ORGFORMDATA> = {};
    // setLoading(false);

    if (!orgFormData.name.trim()) {
      validationErrors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]*$/.test(orgFormData.name)) {
      validationErrors.name = "Name should only contain letters and spaces";
    }

    if (!orgFormData.email.trim()) {
      validationErrors.email = "email is required";
    }

    if (
      !orgFormData.phoneNumber ||
      orgFormData.phoneNumber.toString().length < 10
    ) {
      validationErrors.phoneNumber =
        "phone number should be at least 10 digits";
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
      dispatch(createOrg(orgFormData)).then((result) => {
        if (createOrg.fulfilled.match(result)) {
          const payload = result.payload;
          if (payload.success) {
            router.push("/app/dashboard/organizations");
            toast.success(payload.message);
          }
        } else if (createOrg.rejected.match(result)) {
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
              <div className="p-6.5">
                <div className="mb-4.5 flex gap-6 md:flex-row w-full flex-col">
                  <div className="md:w-1/2 w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Organization Name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      onChange={onChangeHandler}
                      value={orgFormData.name}
                      placeholder="Enter Organization Name"
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
                      Organization Email <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      onChange={onChangeHandler}
                      value={orgFormData.email}
                      placeholder="Enter Organization email"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    {errors.email && (
                      <p className="text-meta-1 text-sm font-semibold">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4.5 flex gap-6 md:flex-row w-full flex-col">
                  <div className="md:w-1/2 w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Organization phone number{" "}
                      <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      onChange={onPhoneNumberChange}
                      value={
                        orgFormData.phoneNumber === 0
                          ? ""
                          : orgFormData.phoneNumber
                      }
                      placeholder="Enter Organization Phone Number"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    {errors.phoneNumber && (
                      <p className="text-meta-1 text-sm  font-semibold">
                        {errors.phoneNumber}
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
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
                >
                  {loading ? (
                    <>
                      <Loader2 className="ml-4 w-6 h-6 animate-spin" />
                    </>
                  ) : (
                    <>Create Organization</>
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

export default CreateOrganizationForm;
