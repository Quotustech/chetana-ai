"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { useSelector, RootState, useDispatch } from "@/redux/store";
import {
  createNewGroup,
  getChats,
  getGroups,
} from "@/redux/slices/chat/chatActions";
import { setGroups, setSelcetedGroup } from "@/redux/slices/chat/chatSlice";
import { ChatGroup } from "@/common/interfaces/chatGroup.interface";
import { Chat } from "@/common/interfaces/chat.interface";
import { ThreeCircles } from "react-loader-spinner";
import { useThemeContext } from "@/contexts/ThemeContext";

type ActionResult = {
  payload: any;
  meta: {
    requestStatus: string;
  };
};

const Sidebar = () => {
  const dispatch = useDispatch();
  // const sidebarRef = useRef<HTMLDivElement>(null);
  const { colorMode, setColorMode } = useThemeContext();
  const { collapse, isSmall, setCollapse, sidebarRef , sidebarBtnRef} = useSidebarContext();
  const { user } = useSelector((state: RootState) => state.authReducer);
  const { chats, groups, selectedGroup , recentlyGroupCreated } = useSelector(
    (state: RootState) => state.chatReducer,
  );
  const [loading, setLoading] = useState(true);
  const [localGroups, setLocalGroups] = useState<ChatGroup[]>([]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        sidebarBtnRef.current &&
        isSmall &&
        !sidebarRef.current.contains(event.target as Node) &&
        !sidebarBtnRef.current.contains(event.target as Node)
      ) {
        setCollapse(true);
      }
    },
    [isSmall]
  );
  

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    const fetchData = async (id: string) => {
      await dispatch(getGroups(id)).then((result: ActionResult) => {
        // console.log('groups ____>>>>' , result.payload.data)
        setLocalGroups(result.payload.data);
      });
      await dispatch(getChats(id));
      setLoading(false);
    };

    if (user?._id && groups.length === 0) {
      fetchData(user._id);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (localGroups.length !== 0 && chats && groups.length === 0) {
      let modifiedGroups = localGroups?.map((group) => {
        const updatedGroup = { ...group, chats: [] as Chat[] };
        chats.forEach((chat: Chat) => {
          if (chat.groupId === group._id) {
            updatedGroup.chats.push(chat);
          }
        });
        return updatedGroup;
      });
      dispatch(setGroups(modifiedGroups));
    }
  }, [chats]);

  if (loading && !isSmall) {
    return (
      <div className="flex h-full w-[16rem] items-center justify-center bg-[#f9f9f9] dark:bg-[#1c2333]">
        <ThreeCircles
          visible={true}
          height="50"
          width="50"
          color={colorMode === "dark" ? "#f9f9f9" : "#282D4D"}
          ariaLabel="three-circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  return (
    <div
      ref={sidebarRef}
      id="sidebar"
      className={` absolute  h-svh  delay-100 duration-500 lg:relative
    ${
      collapse
        ? "invisible hidden lg:flex lg:w-0"
        : `visible ${isSmall ? 'z-[100]' : 'z-[10]'} w-[16rem]`
    }`}
    >
      <div className="z-[10] flex h-full w-[16rem] flex-col items-center border-x-1 bg-[#f9f9f9] p-1 dark:border-gray-700 dark:bg-[#1c2333] lg:absolute">
        <div
          className="flex h-[3.5rem] w-full cursor-pointer items-center justify-center gap-3 rounded-md border bg-[#fbfbfb] hover:bg-gray-200 dark:border-gray-400 dark:bg-[#0e1525] dark:hover:bg-[#2b3245]"
          onClick={() => !recentlyGroupCreated && dispatch(createNewGroup(user?._id))}
        >
          <Plus /> New Chat
        </div>
        <ul className="flex h-full w-full flex-col gap-1 overflow-y-scroll pt-8 lg:gap-2">
          {groups?.map((group) => {
            if (!group?.chats || group.chats.length === 0) {
              return null;
            } else {
              return (
                <li
                  key={group._id}
                  className={`h-9 w-full cursor-pointer rounded-md hover:bg-white dark:hover:bg-[#2b3245] ${group._id === selectedGroup._id ? "bg-white dark:bg-white dark:text-black dark:hover:text-white" : ""}`}
                  onClick={() => {
                    console.log('--------' , group)
                    dispatch(setSelcetedGroup(group));
                    if (isSmall) {
                      setCollapse(true);
                    }
                  }}
                >
                  <div className="flex h-full items-center gap-2 px-2 py-1 text-sm lg:text-lg">
                    <MessageCircle className="w-4 lg:w-5" />{" "}
                    {group?.chats[0]?.question?.substr(0, 17) + " . . ."}
                  </div>
                </li>
              );
            }
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
