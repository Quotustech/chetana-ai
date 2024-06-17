"use client"

import React, { useLayoutEffect, useState } from "react";
import { BsRobot, BsPersonWorkspace } from "react-icons/bs";
import { FaLaptopCode } from "react-icons/fa";
import Link from "next/link";
import { Tooltip, Switch, VisuallyHidden, useSwitch } from "@nextui-org/react";
import { ChevronRight, ChevronLeft, SunMedium, Moon } from "lucide-react";
import { BiMenu } from "react-icons/bi";
import { CgMenuMotion } from "react-icons/cg";
import { CgProfile } from "react-icons/cg";
import { BsSend } from "react-icons/bs";
import { AiOutlineLogout } from "react-icons/ai";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { useNavbarContext } from "@/contexts/NavbarContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useSelector } from "react-redux";
import { RootState, useDispatch } from "@/redux/store";
import { usePathname, useRouter } from "next/navigation";

import { TfiWrite } from "react-icons/tfi";
import { logout } from "@/redux/slices/auth/authActions";
import { createNewGroup } from "@/redux/slices/chat/chatActions";

const Navigation = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch();

  const { colorMode, setColorMode } = useThemeContext();
  const path = usePathname();
  const isMockInterview = path.includes('/mock-interview');

  const { setCollapse, isSmall, collapse, sidebarBtnRef } = useSidebarContext();
  const { expanded } = useNavbarContext();
  const [openMenu, setOpenMenu] = useState(false);

  const { user } = useSelector((state: RootState) => state.authReducer);
  const { recentlyGroupCreated } = useSelector((state: RootState) => state.chatReducer);

  return (
    <>
        <div className={`h-full relative delay-100 duration-500 ${expanded ? 'w-16' : 'w-0'}`}>
          <div className={`w-16 p-1 h-full flex items-center flex-col bg-white dark:bg-[#0e1525] relative left-0 border border-r-1 ${collapse ? 'border border-r-1' : ''}`}>
            {path === "/app" && (
              <div className={`mb-2 z-[11] cursor-pointer`}>
                <Tooltip
                  content="Toggle Sidebar"
                  placement="right"
                  className="dark:bg-white dark:text-black"
                >
                <div
                  className="bg-[#f9f9f9] dark:bg-[#1c2333] hover:bg-gray-200 rounded-md p-1"
                  onClick={() => setCollapse(!collapse)}
                  ref={sidebarBtnRef}
                >
                  {collapse ? (isSmall ? (<BiMenu />) : (<ChevronRight />)) : (isSmall ? (<CgMenuMotion />) : (<ChevronLeft />))}
                </div>
              </Tooltip>
            </div>
          )}
          <ul className="w-full flex gap-4 flex-col">
            <Tooltip
              content="Chat Bot"
              placement="right"
              className="dark:bg-white dark:text-black"
            >
              <li>
                <Link href="/" className="bg-[#f9f9f9] dark:bg-[#1c2333] hover:bg-gray-200 h-11 flex flex-col justify-center items-center rounded-md mb-1 text-center">
                  <BsRobot className="text-[1.8rem]" />
                </Link>
                <p className="text-tiny text-center">Chat Bot</p>
              </li>
            </Tooltip>
            <Tooltip
              content="Code Transpiler"
              placement="right"
              className="dark:bg-white dark:text-black"
            >
              <li>
                <Link href="/app/transpiler" className="bg-[#f9f9f9] dark:bg-[#1c2333] hover:bg-gray-200 h-11 flex justify-center items-center rounded-md mb-1 text-center">
                  <FaLaptopCode className="text-[1.8rem]" />
                </Link>
                <p className="text-tiny text-center">Transpiler</p>
              </li>
            </Tooltip>
            <Tooltip
              content="Mock Interview"
              placement="right"
              className="dark:bg-white dark:text-black"
            >
              <li>
                <Link href="/app/mock-interview" className="bg-[#f9f9f9] dark:bg-[#1c2333] hover:bg-gray-200 h-11 flex justify-center items-center rounded-md mb-1 text-center">
                  <BsPersonWorkspace className="text-[1.8rem]" />
                </Link>
                <p className="text-tiny text-center">Mock Interview</p>
              </li>
            </Tooltip>
          </ul>

            <div className="absolute bottom-2 flex items-center flex-col w-full gap-3 ">
              {isSmall && (
                 <Tooltip
                 content="New Chat"
                 placement="right"
                 className="dark:bg-white dark:text-black"
               >
                <div className="w-8 h-8 rounded-md flex justify-center items-center bg-[#e1e1e1] dark:text-white cursor-pointer dark:bg-[#1c2333]" onClick={()=> !recentlyGroupCreated && dispatch(createNewGroup(user?._id))}>
                  <TfiWrite />
                </div>
              </Tooltip>
            )}
            <div className="w-full flex justify-center items-center pl-2">
              <Switch
                size="sm"
                color="default"
                defaultSelected={colorMode === 'dark'}
                startContent={<SunMedium />}
                endContent={<Moon />}
                onValueChange={(isSelected) => {
                  if (typeof setColorMode === "function") {
                    setColorMode(isSelected ? "dark" : "light");
                  }
                }}
              />
            </div>
            <div
              className="w-11 h-11 rounded-full border border-gray-400 flex justify-center items-center cursor-pointer"
              onClick={() => setOpenMenu(!openMenu)}
            >
              {openMenu && (
                <div className="absolute bottom-12 left-8 w-[10rem] border border-gray-600 bg-white rounded-md z-[10000] dark:bg-[#0e1525] dark:text-white">
                  <Listbox
                    aria-label="Listbox Variants"
                    color="default"
                    variant="solid"
                  >
                    <ListboxItem key="profile" className="dark:hover:bg-[#2b3245]" startContent={<CgProfile />}>
                      Profile
                    </ListboxItem>
                    <ListboxItem key="feedback" className="dark:hover:bg-[#2b3245]" startContent={<BsSend />}>
                      Feedback
                    </ListboxItem>
                    <ListboxItem
                      key="logout"
                      className="text-danger flex"
                      color="danger"
                      startContent={<AiOutlineLogout />}
                      onClick={() => dispatch(logout()).then(() => router.push('/auth/login'))}
                    >
                      Logout
                    </ListboxItem>
                  </Listbox>
                </div>
              )}
              {user?.name?.charAt(0).toUpperCase() || 'B'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
