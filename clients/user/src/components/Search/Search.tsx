// "use client";
// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { ArrowUp } from "lucide-react";
// import TextareaAutosize from "react-textarea-autosize";
// import { useSelector, RootState, useDispatch } from "@/redux/store";
// import { createNewGroup, sendToOpenAi } from "@/redux/slices/chat/chatActions";
// import { PayloadAction } from "@reduxjs/toolkit";
// import { ChatGroup } from "@/common/interfaces/chatGroup.interface";
// import { Chat } from "@/common/interfaces/chat.interface";
// import {
//   setGroups,
//   setResponding,
//   setSelcetedGroup,
//   setRecentlyGroupCreated,
//   setInitialPrompt,
// } from "@/redux/slices/chat/chatSlice";
// import { Bars } from "react-loader-spinner";
// import { toast } from "sonner";

// interface OpenAiData {
//   message: string;
//   userId: string;
//   groupId: string;
//   apiKeyName: string;
// }

// interface OpenAiRes {
//   payload: ReadableStream<Uint8Array> | null;
// }

// type ActionResult = {
//   payload: ChatGroup;
//   meta: {
//     requestStatus: string;
//   };
// };

// const Search = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state: RootState) => state.authReducer);
//   const {
//     groups,
//     selectedGroup,
//     responding,
//     recentlyGroupCreated,
//     initialPrompt,
//   } = useSelector((state: RootState) => state.chatReducer);
//   const [prompt, setPrompt] = useState<string>("");

//   useEffect(() => {
//     const handleKeyDown = async (e: {
//       ctrlKey: any;
//       key: string;
//       preventDefault: () => void;
//     }) => {
//       if (e.ctrlKey && e.key === "k") {
//         e.preventDefault();
//         if (!recentlyGroupCreated) {
//           await dispatch(createNewGroup(user?._id));
//         }
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, []);

//   const processDataChunk = async (
//     streamData: OpenAiRes,
//     group: ChatGroup,
//     localGroups: ChatGroup[],
//   ) => {
//     if (!streamData || !streamData.payload) return;

//     let streamedChat: string = "";
//     let updatedGroup = {} as ChatGroup;
//     const reader = streamData.payload.getReader();
//     const decoder = new TextDecoder();

//     while (true) {
//       const readerResult = await reader.read();
//       if (!readerResult) {
//         // console.log("Reader result is undefined.");
//         break;
//       }
//       const { done, value } = readerResult;
//       if (done) {
//         // console.log("Stream ended");
//         const updatedGroups = localGroups.map((group) =>
//           group._id === updatedGroup._id ? updatedGroup : group,
//         );
//         dispatch(setGroups(updatedGroups));
//         dispatch(setRecentlyGroupCreated(false));
//         break;
//       }

//       // Process the chunk of data
//       const decodedChunk = decoder.decode(value);
//       streamedChat += decodedChunk;
//       const updatedStreamedData = {
//         question: prompt || initialPrompt,
//         answer: streamedChat,
//       } as Chat;
//       updatedGroup = {
//         ...group,
//         chats: group.chats && [...group.chats, updatedStreamedData],
//       };
//       dispatch(setSelcetedGroup(updatedGroup));
//     }
//   };

//   const submitHandler = async (e: { preventDefault: () => void }) => {
//     try {
//       e.preventDefault();
//       dispatch(setResponding(true));
//       let dataObj: OpenAiData = {} as OpenAiData;
//       let group = {} as ChatGroup;
//       let localGroups = [...groups] as ChatGroup[];
//       if (!selectedGroup._id) {
//         await dispatch(createNewGroup(user?._id)).then((result: any) => {
//           // console.log("^^^^^^^^^", result);
//           dataObj = {
//             message: prompt || initialPrompt,
//             userId: user._id,
//             groupId: result.payload.data._id,
//             apiKeyName: "CHAT_KEY",
//           };
//           group = { ...result.payload.data, chats: [] as Chat[] };
//           // dispatch(updateGroups(group));
//           localGroups.unshift(group);
//           // console.log("selectedGroup", selectedGroup);
//         });
//         // console.log('groups search' , groups);
//       } else {
//         dataObj = {
//           message: prompt || initialPrompt,
//           userId: user._id,
//           groupId: selectedGroup._id,
//           apiKeyName: "CHAT_KEY",
//         };
//         group = selectedGroup;
//       }
//       await dispatch(sendToOpenAi(dataObj)).then((result) => {
//         if (!result) return;
//         if (sendToOpenAi.fulfilled.match(result)) {
//           if (result) {
//             processDataChunk(
//               result as OpenAiRes,
//               group as ChatGroup,
//               localGroups as ChatGroup[],
//             );

//             setPrompt("");
//           }
//         } else if (sendToOpenAi.rejected.match(result)) {
//           const err: any = result.payload;
//           toast.error(err.message);
//         }
//       });
//     } catch (error) {
//       // console.log("error while getting chat response ::" , error)
//     } finally {
//       dispatch(setResponding(false));
//     }
//   };

//   const handleKeyDown = (e: {
//     key: string;
//     shiftKey: any;
//     preventDefault: () => void;
//   }) => {
//     if (e.key === "Enter" && !e.shiftKey && !responding) {
//       e.preventDefault(); // Prevent default behavior (e.g., form submission)
//       setPrompt("");
//       submitHandler(e);
//     } else if (e.key === "Enter" && e.shiftKey) {
//       setPrompt((prev) => prev + "\n"); // Add a newline character to the value
//     }
//   };

//   useEffect(() => {
//     if (initialPrompt) {
//       (async () => {
//         await submitHandler({ preventDefault: () => {} });
//         dispatch(setInitialPrompt(""));
//       })();
//     }
//   }, [initialPrompt]);

//   return (
//     <div className="flex flex-col items-center justify-center gap-5">
//       <form
//         className="relative flex w-full max-w-3xl items-center space-x-2 rounded-md border border-gray-300 bg-transparent outline-none dark:bg-[#2b3245]"
//         onSubmit={submitHandler}
//       >
//         <TextareaAutosize
//           minRows={1}
//           maxRows={15}
//           id="voice-search"
//           style={{ resize: "none" }}
//           className="text-smblock w-full rounded-md border border-none border-blue-600 p-[.6rem] text-black outline-none focus:border-none dark:bg-[#2b3245] dark:text-gray-300"
//           placeholder="Ask Your Query..."
//           required
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//           onKeyDown={handleKeyDown}
//           autoFocus={true}
//         />
//         <Button
//           disabled={responding}
//           type="submit"
//           className="absolute bottom-[1.5px] right-[3px] bg-white p-1 text-black hover:text-white dark:bg-[#2b3245] dark:text-white dark:hover:bg-gray-500 dark:hover:text-black"
//         >
//           {responding ? (
//             <Bars
//               height="30"
//               width="30"
//               color="black"
//               ariaLabel="bars-loading"
//               wrapperStyle={{}}
//               wrapperClass=""
//               visible={true}
//             />
//           ) : (
//             <ArrowUp className="w-8" />
//           )}
//         </Button>
//       </form>
//       <footer className="hidden md:block">
//         <div className="relative text-sm text-gray-400 sm:hidden   lg:flex lg:justify-center ">
//           ctrl + k to create new chat
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Search;

"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, Mic } from "lucide-react"; // Import Mic icon
import { FaTelegramPlane } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import { useSelector, RootState, useDispatch } from "@/redux/store";
import { createNewGroup, sendToOpenAi } from "@/redux/slices/chat/chatActions";
import { PayloadAction } from "@reduxjs/toolkit";
import { ChatGroup } from "@/common/interfaces/chatGroup.interface";
import { Chat } from "@/common/interfaces/chat.interface";
import {
  setGroups,
  setResponding,
  setSelectedGroup,
  // setSelcetedGroup,
  setRecentlyGroupCreated,
  setInitialPrompt,
} from "@/redux/slices/chat/chatSlice";
import { Bars } from "react-loader-spinner";
import { toast } from "sonner";

interface OpenAiData {
  message: string;
  userId: string;
  groupId: string;
  apiKeyName: string;
}

interface OpenAiRes {
  payload: ReadableStream<Uint8Array> | null;
}

type ActionResult = {
  payload: ChatGroup;
  meta: {
    requestStatus: string;
  };
};

const Search = () => {
  const dispatch = useDispatch();
  // const { user } = useSelector((state: RootState) => state.authReducer);
  const { user } = useSelector((state: RootState) => state.authReducer);

  const {
    groups,
    selectedGroup,
    responding,
    recentlyGroupCreated,
    initialPrompt,
  } = useSelector((state: RootState) => state.chatReducer);
  const [prompt, setPrompt] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcribedText, setTranscribedText] = useState<string>("");

  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  // recognition.interimResults = false;
  recognition.interimResults = true;

  // if (!recognition) {
  //   toast.error("SpeechRecognition is not supported in this browser.");
  //   return <div>Your browser does not support speech recognition.</div>;
  // }

  useEffect(() => {
    const handleKeyDown = async (e: {
      ctrlKey: any;
      key: string;
      preventDefault: () => void;
    }) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        await dispatch(createNewGroup(user?._id));
        // if (!recentlyGroupCreated) {
        //   console.log("recent",recentlyGroupCreated)
        //   console.log("Group  not created")
        //   await dispatch(createNewGroup(user?._id));
        // }
        // else{
        //   console.log("Group already created")
        // }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const processDataChunk = async (
    streamData: OpenAiRes,
    group: ChatGroup,
    localGroups: ChatGroup[]
  ) => {
    if (!streamData || !streamData.payload) return;

    let streamedChat: string = "";
    let updatedGroup = {} as ChatGroup;
    const reader = streamData.payload.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const readerResult = await reader.read();
      if (!readerResult) {
        break;
      }
      const { done, value } = readerResult;
      if (done) {
        const updatedGroups = localGroups.map((group) =>
          group._id === updatedGroup._id ? updatedGroup : group
        );
        dispatch(setGroups(updatedGroups));
        dispatch(setRecentlyGroupCreated(false));
        break;
      }

      const decodedChunk = decoder.decode(value);
      streamedChat += decodedChunk;
      const updatedStreamedData = {
        question: prompt || initialPrompt,
        answer: streamedChat,
      } as Chat;
      updatedGroup = {
        ...group,
        chats: group.chats && [...group.chats, updatedStreamedData],
      };
      dispatch(setSelectedGroup(updatedGroup));
    }
  };

  const submitHandler = async (e: { preventDefault: () => void }) => {
    try {
      e.preventDefault();
      dispatch(setResponding(true));
      let dataObj: OpenAiData = {} as OpenAiData;
      let group = {} as ChatGroup;
      let localGroups = [...groups] as ChatGroup[];
      if (!selectedGroup._id) {
        await dispatch(createNewGroup(user?._id)).then((result: any) => {
          dataObj = {
            message: prompt || initialPrompt,
            userId: user._id,
            groupId: result.payload.data._id,
            apiKeyName: "CHAT_KEY",
          };
          group = { ...result.payload.data, chats: [] as Chat[] };
          localGroups.unshift(group);
        });
      } else {
        dataObj = {
          message: prompt || initialPrompt,
          userId: user._id,
          groupId: selectedGroup._id,
          apiKeyName: "CHAT_KEY",
        };
        group = selectedGroup;
      }
      await dispatch(sendToOpenAi(dataObj)).then((result) => {
        if (!result) return;
        if (sendToOpenAi.fulfilled.match(result)) {
          if (result) {
            processDataChunk(
              result as OpenAiRes,
              group as ChatGroup,
              localGroups as ChatGroup[]
            );

            setPrompt("");
          }
        } else if (sendToOpenAi.rejected.match(result)) {
          const err: any = result.payload;
          toast.error(err.message);
        }
      });
    } catch (error) {
    } finally {
      dispatch(setResponding(false));
    }
  };

  const handleKeyDown = (e: {
    key: string;
    shiftKey: any;
    preventDefault: () => void;
  }) => {
    if (e.key === "Enter" && !e.shiftKey && !responding) {
      e.preventDefault();
      setPrompt("");
      submitHandler(e);
    } else if (e.key === "Enter" && e.shiftKey) {
      setPrompt((prev) => prev + "\n");
    }
  };

  useEffect(() => {
    if (initialPrompt) {
      (async () => {
        await submitHandler({ preventDefault: () => {} });
        dispatch(setInitialPrompt(""));
      })();
    }
  }, [initialPrompt]);

  // Start listening for voice input
  const startListening = () => {
    setIsListening(true);
    recognition.start();
  };

  // Stop listening for voice input
  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  // Handle speech recognition result
  recognition.onresult = (event) => {
    const interimTranscript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join("");
    setTranscribedText(interimTranscript);

    if (event.results[0].isFinal) {
      setPrompt(interimTranscript);
      stopListening();
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    toast.error("Error occurred in speech recognition: " + event.error);
    stopListening();
  };
  //   const speechResult = event.results[0][0].transcript;
  //   setPrompt(speechResult);
  //   stopListening();
  // };

  // recognition.onerror = (event) => {
  //   console.error("Speech recognition error:", event.error);
  //   toast.error("Error occurred in speech recognition: " + event.error);
  //   stopListening();
  // };

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <form
        //   className="relative flex w-full max-w-3xl items-center space-x-2 rounded-md border border-gray-300 bg-transparent outline-none dark:bg-[#2b3245]"
        //   onSubmit={submitHandler}
        // >
        className="relative flex flex-col w-full max-w-3xl rounded-md border border-gray-300 bg-white dark:bg-[#2b3245] dark:text-gray-300 shadow-sm"
        onSubmit={submitHandler}
      >
        <div className="flex-1 overflow-hidden relative">
        {/* <div className="absolute inset-0 p-2.5 flex items-end"> */}
          <TextareaAutosize
            minRows={1}
            // maxRows={15}
            maxRows={15}
            id="voice-search"
            // style={{
            //   resize: "none",
            //   // : "200px",
            //   // overflowY: "auto",
            // }}
            className="text-smblock w-full rounded-md border border-none border-blue-600 p-[.6rem] text-black outline-none focus:border-none dark:bg-[#2b3245] dark:text-gray-300 max-h-20 overflow-y-auto resize-none pr-24"
            placeholder="Ask Your Query..."
            required
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus={true}
          />
          {/* </div> */}
          <Button
            type="button"
            
            onClick={isListening ? stopListening : startListening}
            //   className="absolute bottom-[1.5px] right-[50px] bg-white p-1 text-black hover:text-white dark:bg-[#2b3245] dark:text-white dark:hover:bg-gray-500 dark:hover:text-black"
            // >
            className="absolute bottom-2 right-16 bg-white p-1 rounded-md text-black hover:text-white dark:bg-[#2b3245] dark:text-white dark:hover:bg-gray-500 dark:hover:text-black"
            >
            <Mic className={`w-8 ${isListening ? "text-red-500" : ""}`} />
          </Button>
          <Button
            disabled={responding}
            type="submit"
            //   className="absolute bottom-[1.5px] right-[3px] bg-white p-1 text-black hover:text-white dark:bg-[#2b3245] dark:text-white dark:hover:bg-gray-500 dark:hover:text-black"
            // >
            className="absolute bottom-2 right-3 bg-white p-2 rounded-md text-black hover:text-white dark:bg-[#2b3245] dark:text-white dark:hover:bg-gray-500 dark:hover:text-black"
    >

            {responding ? (
              <Bars
                height="30"
                width="30"
                color="black"
                ariaLabel="bars-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            ) : (
              // <ArrowUp className="w-8" />
              // <FaTelegramPlane className="w-8" />
              <FaTelegramPlane size={22} />
            )}
          </Button>
        </div>
      </form>
      {isListening && (
        <div className="fixed bottom-10 right-10 z-50 w-80 p-4 bg-white border border-gray-300 shadow-lg dark:bg-[#2b3245] dark:text-white">
          <p className="text-center">I'm listening, say something...</p>
          <p className="mt-2 p-2 border border-dashed border-gray-400 rounded-md">
            {transcribedText}
          </p>
        </div>
      )}
      <footer className="hidden md:block">
        <div className="relative text-sm text-gray-400 sm:hidden lg:flex lg:justify-center">
          Press Ctrl + k to create new chat
        </div>
      </footer>
    </div>
  );
};

export default Search;
