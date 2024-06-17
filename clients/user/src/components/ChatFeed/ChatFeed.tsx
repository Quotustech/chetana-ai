import React, { useEffect, useRef } from "react";
import Search from "../Search/Search";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { TfiWrite } from "react-icons/tfi";
import { Tooltip } from "@nextui-org/react";
import { BsCaretLeft } from "react-icons/bs";
import { useNavbarContext } from "@/contexts/NavbarContext";
import Response from "../Response/Response";
import { useSwipeable } from "react-swipeable";
import { useSelector, RootState, useDispatch } from "@/redux/store";
import { createNewGroup } from "@/redux/slices/chat/chatActions";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import * as clipboard from "clipboard-polyfill";
import { sampleQuestions } from "@/utils/ConstantData";
import { setInitialPrompt } from "@/redux/slices/chat/chatSlice";

const ApiUrl = process.env.NEXT_PUBLIC_API_URL;

const ChatFeed = () => {
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { collapse, isSmall } = useSidebarContext();
  const { expanded, setExpanded } = useNavbarContext();
  const { selectedGroup, recentlyGroupCreated } = useSelector(
    (state: RootState) => state.chatReducer,
  );
  const { user } = useSelector((state: RootState) => state.authReducer);

  useEffect(() => {
    const chatBox = chatBoxRef.current;
    const scrollWithDelay = () => {
      chatBox?.scrollTo({
        top: chatBox?.scrollHeight,
        behavior: "smooth",
      });
    };
    scrollWithDelay();
  }, [selectedGroup.chats, chatBoxRef]);

  const handlers = useSwipeable({
    swipeDuration: 100,
    onSwiped: (eventData) => {
      if (eventData.dir === "Left") {
        setExpanded(false);
      }
      if (eventData.dir === "Right") {
        setExpanded(true);
      }
    },
  });

  const handleShareLink = () => {
    // console.log("link");
    if (selectedGroup._id) {
      const shareLink = `http://localhost:3000/app/share/${selectedGroup._id}`;
      clipboard
        .writeText(shareLink)
        .then(() => {
          toast.info("Share Link Copied To Clipboard.");
        })
        .catch((err) => {
          toast.error("Error while copying...");
        });
    }
  };

  return (
    <div
      {...(isSmall && handlers)}
      id="chat-feed"
      className={`${!isSmall && (collapse ? "sidebar-collapsed " : "sidebar-expanded ")} ${expanded ? "navbar-expanded " : "navbar-collapsed "} relative right-0 z-[10] flex flex-col bg-white p-3 delay-100 duration-500 dark:bg-[#0e1525] dark:text-white
      `}
    >
      {collapse && !isSmall && (
        <>
          <Tooltip
            content="New Chat"
            placement="right"
            className="dark:bg-white dark:text-black"
          >
            <div
              className="absolute left-2 top-2 z-[1000] flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-[#e1e1e1] dark:text-black"
              onClick={() =>
                !recentlyGroupCreated && dispatch(createNewGroup(user?._id))
              }
            >
              <TfiWrite />
            </div>
          </Tooltip>
        </>
      )}
      {!selectedGroup.chats ||
        (selectedGroup.chats.length > 0 && (
          <Tooltip
            content="Share Chat Link"
            placement="left"
            className="dark:bg-white dark:text-black"
          >
            <div
              className="absolute right-2 top-2 z-[1000] flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-[#f1f1f1] dark:text-black"
              onClick={handleShareLink}
            >
              <ExternalLink />
            </div>
          </Tooltip>
        ))}

      {isSmall && collapse && (
        <div
          className={`absolute -left-2 top-2/4 z-[10000] flex h-8 w-8 items-center justify-center delay-200 duration-700 ${
            expanded ? "rotate-0" : "rotate-[540deg]"
          }`}
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          <BsCaretLeft />
        </div>
      )}

      <div
        className="relative mb-4 flex h-[88%] flex-col items-center gap-8 overflow-y-scroll"
        ref={chatBoxRef}
      >
        <header className=" flex justify-center text-4xl">ThechMate</header>

        {selectedGroup.chats?.length === 0 || !selectedGroup._id ? (
          <footer className="absolute bottom-0 flex justify-center gap-2 w-full max-w-3xl">
            <div className="flex-col gap-2 flex w-[80%] md:w-[45%]">
              {sampleQuestions.slice(0, 2).map((el, index) => (
                <div
                  key={index}
                  className="cursor-pointer rounded-lg border border-gray-300 p-1 hover:border-black"
                  onClick={()=> dispatch(setInitialPrompt(el.question + el.request))}
                >
                  <h4 className="text-sm font-bold text-black dark:text-gray-100">
                    {el.question}
                  </h4>
                  <p className="text-tiny text-gray-500 dark:text-gray-300">
                    {el.request}
                  </p>
                </div>
              ))}
            </div>
            <div className="hidden flex-col gap-2 md:flex w-[45%]">
              {sampleQuestions.slice(2, 4).map((el, index) => (
                <div
                  key={index}
                  className="cursor-pointer rounded-lg border border-gray-300 p-1 hover:border-black"
                  onClick={()=> dispatch(setInitialPrompt(el.question + el.request))}
                >
                  <h4 className="text-sm font-bold text-black dark:text-gray-100">
                    {el.question}
                  </h4>
                  <p className="text-tiny text-gray-500 dark:text-gray-300">
                    {el.request}
                  </p>
                </div>
              ))}
            </div>
          </footer>
        ) : (
          selectedGroup?.chats?.map((chat, index) => {
            return <Response key={chat._id || index} data={chat} />;
          })
        )}
      </div>
      <Search />
    </div>
  );
};

export default ChatFeed;
