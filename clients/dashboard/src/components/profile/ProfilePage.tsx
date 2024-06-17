"use client";
import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { RootState } from "@/src/Redux/store";
import { useSelector } from "react-redux";
import { Pencil, SaveAll } from "lucide-react";
import { Save } from "lucide-react";

const ProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.authReducer);
  const initialState = {
    name: "",
    email: "",
  };
  const [formData, setformData] = useState(user || initialState);
  const [edit, setEdit] = useState(false);

  const changeHandler = (e: { target: { name: string; value: string } }) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="h-[160px] rounded-md w-full bg-primary flex justify-center items-center relative">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2  shadow-2xl rounded-2xl bg-white dark:bg-[#24303F] h-fit w-[90%] sm:w-[70%] lg:w-[60%] p-4 flex justify-around flex-col items-center gap-8">
        <div className="text-2xl flex justify-center items-center w-full relative">
          <span className="h-12 w-12 text-[2.5rem] border rounded-full flex justify-center items-center absolute left-0">
            {user.name?.charAt(0)}
          </span>
          About You
        </div>
        <form className="flex flex-col gap-2">
          <div className="">
            <label htmlFor="_id" className="text-tiny md:text-sm">ID : </label>
            <input
              type="text"
              placeholder="Email"
              name="_id"
              id="_id"
              className={`w-[14rem] md:w-[21rem] h-8 outline-none text-tiny md:text-sm p-2 rounded-md `}
              value={user._id}
              onChange={changeHandler}
              disabled
            />
          </div>
          <div className="">
            <label htmlFor="name" className="text-tiny md:text-sm">Name : </label>
            <input
              type="name"
              placeholder="Name"
              id="name"
              name="name"
              className={`w-[14rem] md:w-[21rem] h-8 text-tiny md:text-sm p-2 rounded-md ${
                !edit ? "bg-transparent outline-none" : "bg-[#e7e7e7]"
              }`}
              value={edit ? formData.name : user.name}
              onChange={changeHandler}
              disabled={!edit}
            />
          </div>
          <div className="">
            <label htmlFor="email" className="text-tiny md:text-sm">Email : </label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              id="email"
              className={`w-[14rem] md:w-[21rem] h-8 text-tiny md:text-sm p-2 rounded-md ${
                !edit ? "bg-transparent outline-none" : "bg-[#e7e7e7]"
              }`}
              value={edit ? formData.email : user.email}
              onChange={changeHandler}
              disabled={!edit}
            />
          </div>

          <div className="flex justify-end mt-4 ">
            <Button color="primary" onClick={() => setEdit(!edit)}>
              {edit ? (
                <>
                  <Save className="w-4" /> Save
                </>
              ) : (
                <>
                  <Pencil className="w-4" /> Edit
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
