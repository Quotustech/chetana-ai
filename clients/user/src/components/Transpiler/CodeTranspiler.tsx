// // "use client";
// // import React, { useState } from "react";
// // import { useSidebarContext } from "@/contexts/SidebarContext";
// // import { useNavbarContext } from "@/contexts/NavbarContext";
// // import { Tooltip } from "@nextui-org/react";
// // import { TfiWrite } from "react-icons/tfi";
// // import { BsCaretLeft } from "react-icons/bs";
// // import CodeMirror from "@uiw/react-codemirror";
// // import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
// // import { javascript } from "@codemirror/lang-javascript";
// // import { bbedit } from "@uiw/codemirror-theme-bbedit";
// // import useColorMode from "@/hooks/useColorMode";
// // import { ReloadIcon } from "@radix-ui/react-icons";
// // // import { Select, SelectItem, Avatar } from "@nextui-org/react";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectGroup,
// //   SelectItem,
// //   SelectLabel,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Button } from "@/components/ui/button";
// // import { languageData } from "@/utils/ConstantData";
// // import { ProgressBar } from "react-loader-spinner";
// // import { useThemeContext } from "@/contexts/ThemeContext";
// // import { useSwipeable } from "react-swipeable";
// // import { useSelector, RootState, useDispatch } from "@/redux/store";
// // import {
// //   setInputCode,
// //   setInputLang,
// //   setOutputCode,
// //   setOutputLang,
// //   setTranslating,
// // } from "@/redux/slices/transpiler/transpilerSlice";
// // import { sendToOpenAi } from "@/redux/slices/transpiler/transpilerActions";
// // import { toast } from "sonner";
// // import { MdContentCopy } from "react-icons/md";
// // import { copyToClipboard } from "@/utils/copyToClipboard";

// // interface OpenAiData {
// //   message: string;
// //   apiKeyName: string;
// //   instruction : string;
// // }
// // interface OpenAiRes {
// //   payload: ReadableStream<Uint8Array> | null;
// // }

// // const CodeTranspiler = () => {
// //   const dispatch = useDispatch();
// //   const { collapse, isSmall } = useSidebarContext();
// //   const { expanded, setExpanded } = useNavbarContext();
// //   const { colorMode } = useThemeContext();
// //   const handlers = useSwipeable({
// //     swipeDuration: 100,
// //     onSwiped: (eventData: { dir: string; }) => {
// //       if (eventData.dir === "Left") {
// //         setExpanded(false);
// //       }
// //       if (eventData.dir === "Right") {
// //         setExpanded(true);
// //       }
// //     },
// //   });
// //   const { inputLang, inputCode, outputCode, outputLang, translating } =
// //     useSelector((state: RootState) => state.transpilerReducer);
// //     const {groups} =
// //     useSelector((state: RootState) => state.chatReducer);
// //   const [value, setValue] = useState([]);

// //   const processDataChunk = async (streamData: OpenAiRes) => {
// //     if (!streamData || !streamData.payload) return;
// //     let streamedChat: string = "";
// //     const reader = streamData.payload.getReader();
// //     const decoder = new TextDecoder();

// //     while (true) {
// //       const readerResult = await reader.read();
// //       if (!readerResult) {
// //         // console.log("Reader result is undefined.");
// //         break;
// //       }
// //       const { done, value } = readerResult;
// //       if (done) {
// //         // console.log("Stream ended");

// //         break;
// //       }

// //       // Process the chunk of data
// //       const decodedChunk = decoder.decode(value);
// //       streamedChat += decodedChunk;
// //       dispatch(setOutputCode(streamedChat.split("```")[1] ? streamedChat.split("```")[1] : ""));
// //       console.log("----====", streamedChat);
// //     }
// //   };

// //   const showInfoToast = (field:string) => {
// //     dispatch(setTranslating(false));
// //     toast.info(field);
// //     return;
// //   };

// //   const handleSubmit = async ({optimise}: {optimise: boolean}) => {
// //     dispatch(setTranslating(true));
// //     // console.log("called");

// //     // console.log({ inputLang, inputCode, outputCode, outputLang, translating });
// //     if (!inputLang) {
// //       showInfoToast("Please fill the input language field.");
// //     } else if (!inputCode) {
// //       showInfoToast("Please fill the input code field.");
// //     } else if (!outputLang) {
// //       showInfoToast("Please fill the output language field.");
// //     }else if(inputLang === outputLang){
// //       showInfoToast(`Code already in ${inputLang}`);
// //     }

// //     const instruction = "Techmate is a friendly chatbot that specializes in computer science topics and kindly declines non-technical questions.\n\nTechmate helps in transpiling code from one programming language to another. If you need to transpile code, make sure you only provide the desired transpiled code within code blocks or fences, suitable for Markdown parsers."
// //     const instructionToOptimise = "Techmate, a friendly chatbot specializing in computer science, exclusively addresses technical inquiries. It excels in transpiling code across different programming languages. When requesting code transpilation, make sure you only provide the desired transpiled code within code blocks or fences, suitable for Markdown parsers. Additionally, if the provided code can be optimized, you should provide the optimized version of that code in desired output code laguage."

// //     const data: OpenAiData = {
// //       message: `${inputCode}\nThis code is written in ${inputLang}\nConvert this in ${outputLang}`,
// //       apiKeyName: "TRANSPILER_KEY",
// //       instruction : optimise ? instructionToOptimise : instruction 
// //     };
// //     // console.log("------", data , optimise);
// //     await dispatch(sendToOpenAi(data)).then((result) => {
// //       if (!result) return;
// //       console.log('results of trans' , result)
// //       if (sendToOpenAi.fulfilled.match(result)) {
// //         if (result) {
// //           processDataChunk(result as OpenAiRes);
// //           dispatch(setTranslating(false));
// //         }
// //       } else if (sendToOpenAi.rejected.match(result)) {
// //         const err: any = result.payload;
// //         toast.error(err.message);
// //         dispatch(setTranslating(false));
// //       }
// //     });
// //   };

// //   const code = "var message = 'Monaco Editor!' \nconsole.log(message);";
// //   return (
// //     <div
// //       {...(isSmall && handlers)}
// //       id="transpiler"
// //       className={`${expanded ? 'navbar-expanded' : 'navbar-collapsed'} h-svh p-2 flex relative flex-col overflow-y-scroll bg-white dark:bg-[#0e1525] z-[100] gap-8`}
// //     >
// //       {isSmall && collapse && (
// //         <div
// //           className={`fixed top-2/4 delay-200 duration-700 ${
// //             expanded ? "left-16 rotate-0" : "left-1 rotate-[540deg]"
// //           } h-8 w-8 z-[10000] flex justify-center items-center`}
// //           onClick={() => {
// //             setExpanded(!expanded);
// //           }}
// //         >
// //           <BsCaretLeft />
// //         </div>
// //       )}

// //       <header className=" w-full h-[6rem] flex justify-center items-center flex-col gap-5">
// //         <h1 className="text-2xl">AI Code Transpiler</h1>

// //         <div className="flex justify-center items-center flex-col gap-2">
// //           <p className="text-tiny">Enter some code and click Translate</p>
// //         </div>
// //       </header>

// //       <section className="flex lg:flex-row justify-between gap-2 items-center flex-col">
// //         <div className={`w-full mt-7 md:mt-0 relative group ${isSmall ? "h-[50vh]" : "h-[75vh]"}`}>
// //           <Select
// //             onValueChange={(value) => dispatch(setInputLang(value))}
// //             required
// //           >
// //             <SelectTrigger id="inp-lang" className="w-full mb-3">
// //               <SelectValue placeholder="Select an input Language" />
// //             </SelectTrigger>
// //             <SelectContent className="z-[99999]">
// //               <SelectGroup>
// //                 {languageData.map((lang) => {
// //                   return (
// //                     <SelectItem key={lang.id} value={lang.name}>
// //                       {lang.name}
// //                     </SelectItem>
// //                   );
// //                 })}
// //               </SelectGroup>
// //             </SelectContent>
// //           </Select>
// //           {isSmall && (
// //             <>
// //               <Select
// //                 onValueChange={(value) => dispatch(setOutputLang(value))}
// //                 required
// //               >
// //                 <SelectTrigger id="inp-lang" className="w-full mb-3">
// //                   <SelectValue placeholder="Select an output Language" />
// //                 </SelectTrigger>
// //                 <SelectContent className="z-[99999]">
// //                   <SelectGroup>
// //                     {languageData.map((lang) => {
// //                       return (
// //                         <SelectItem key={lang.id} value={lang.name}>
// //                           {lang.name}
// //                         </SelectItem>
// //                       );
// //                     })}
// //                   </SelectGroup>
// //                 </SelectContent>
// //               </Select>
// //               <div className="w-full text-center mb-5 flex flex-col gap-3">
// //                 <Button
// //                   className="bg-[#f9f9f9] dark:bg-[#1c2333] text-black mx-auto dark:text-white hover:text-white relative"
// //                   onClick={()=> handleSubmit({optimise: false})}
// //                   disabled={translating}
// //                 >
// //                   {translating ? (
// //                     <ProgressBar
// //                       visible={true}
// //                       height="80"
// //                       width="62"
// //                       borderColor="#ffffff"
// //                       barColor="#4fa94d"
// //                       ariaLabel="progress-bar-loading"
// //                       wrapperStyle={{}}
// //                       wrapperClass=""
// //                     />
// //                   ) : (
// //                     "Translate"
// //                   )}
// //                 </Button>
// //                 <Button
// //                   className="bg-[#f9f9f9] dark:bg-[#1c2333] text-black mx-auto dark:text-white hover:text-white relative"
// //                   onClick={()=> handleSubmit({optimise: true})}
// //                   disabled={translating}
// //                 >
// //                   Optimise & Translate
// //                 </Button>
// //               </div>
// //             </>
// //           )}
// //           <CodeMirror
// //             className="absolute rounded-md max-w-full overflow-x-scroll"
// //             value={"//Input\n" + code}
// //             height={isSmall ? "50vh" : "70vh"}
// //             theme={colorMode === "dark" ? tokyoNight : bbedit}
// //             extensions={[javascript({ jsx: true })]}
// //             onChange={(value, viewUpdate) => {
// //               dispatch(setInputCode(value));
// //             }}
// //           />
// //           <MdContentCopy className="absolute bottom-2 right-2 text-2xl hidden group-hover:block cursor-pointer opacity-50" onClick={()=> copyToClipboard(inputCode)}/>
// //         </div>

// //         {!isSmall && (
// //           <div className="flex flex-col gap-3" >
// //           <Button
// //             className="bg-[#f9f9f9] dark:bg-[#1c2333] text-black dark:text-white hover:text-white relative"
// //             onClick={()=> handleSubmit({optimise: false})}
// //             disabled={translating}
// //           >
// //             {translating ? (
// //               <ProgressBar
// //                 visible={true}
// //                 height="80"
// //                 width="62"
// //                 borderColor="#ffffff"
// //                 barColor="#4fa94d"
// //                 ariaLabel="progress-bar-loading"
// //                 wrapperStyle={{}}
// //                 wrapperClass=""
// //               />
// //             ) : (
// //               "Translate"
// //             )}
// //           </Button>
// //            <Button
// //            className="bg-[#f9f9f9] dark:bg-[#1c2333] text-black mx-auto dark:text-white hover:text-white relative"
// //            onClick={()=> handleSubmit({optimise: true})}
// //            disabled={translating}
// //          >
// //            Optimise & Translate
// //          </Button>
// //          </div>
// //         )}

// //         <div className={`w-full mt-7 md:mt-0 relative group ${isSmall ? "h-[50vh]" : "h-[75vh]"}`}>
// //           {!isSmall && (
// //             <Select
// //               onValueChange={(value) => dispatch(setOutputLang(value))}
// //               required
// //             >
// //               <SelectTrigger id="inp-lang" className="w-full mb-3">
// //                 <SelectValue placeholder="Select an output Language" />
// //               </SelectTrigger>
// //               <SelectContent className="z-[99999]">
// //                 <SelectGroup>
// //                   {languageData.map((lang) => {
// //                     return (
// //                       <SelectItem key={lang.id} value={lang.name}>
// //                         {lang.name}
// //                       </SelectItem>
// //                     );
// //                   })}
// //                 </SelectGroup>
// //               </SelectContent>
// //             </Select>
// //           )}
// //           <CodeMirror
// //             className="absolute rounded-md max-w-full overflow-x-scroll"
// //             value={"//Output\n" + outputCode?.replace(/^\w+\s*/, "")}
// //             height={isSmall ? "50vh" : "70vh"}
// //             theme={colorMode === "dark" ? tokyoNight : bbedit}
// //             extensions={[javascript({ jsx: true })]}
// //             onChange={(value, viewUpdate) => {
// //               dispatch(setOutputCode(value));
// //             }}
// //           />
// //           <MdContentCopy className="absolute bottom-2 right-2 text-2xl hidden group-hover:block cursor-pointer opacity-50" onClick={()=> copyToClipboard(outputCode)}/>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // };

// // export default CodeTranspiler;




//new ui code

"use client";
import React, { useState } from "react";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { useNavbarContext } from "@/contexts/NavbarContext";
import { Tooltip } from "@nextui-org/react";
import { TfiWrite } from "react-icons/tfi";
import { BsCaretLeft } from "react-icons/bs";
import CodeMirror from "@uiw/react-codemirror";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { javascript } from "@codemirror/lang-javascript";
import { bbedit } from "@uiw/codemirror-theme-bbedit";
import useColorMode from "@/hooks/useColorMode";
import { ReloadIcon } from "@radix-ui/react-icons";
// import { Select, SelectItem, Avatar } from "@nextui-org/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { languageData } from "@/utils/ConstantData";
import { ProgressBar } from "react-loader-spinner";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useSwipeable } from "react-swipeable";
import { useSelector, RootState, useDispatch } from "@/redux/store";
import {
  setInputCode,
  setInputLang,
  setOutputCode,
  setOutputLang,
  setTranslating,
} from "@/redux/slices/transpiler/transpilerSlice";
import { sendToOpenAi } from "@/redux/slices/transpiler/transpilerActions";
import { toast } from "sonner";
import { MdContentCopy } from "react-icons/md";
import { copyToClipboard } from "@/utils/copyToClipboard";
import Head from "next/head";

interface OpenAiData {
  message: string;
  apiKeyName: string;
  instruction : string;
}
interface OpenAiRes {
  payload: ReadableStream<Uint8Array> | null;
}

const CodeTranspiler = () => {
  const dispatch = useDispatch();
  const { collapse, isSmall } = useSidebarContext();
  const { expanded, setExpanded } = useNavbarContext();
  const { colorMode } = useThemeContext();
  const handlers = useSwipeable({
    swipeDuration: 100,
    onSwiped: (eventData: { dir: string; }) => {
      if (eventData.dir === "Left") {
        setExpanded(false);
      }
      if (eventData.dir === "Right") {
        setExpanded(true);
      }
    },
  });
  const { inputLang, inputCode, outputCode, outputLang, translating } =
    useSelector((state: RootState) => state.transpilerReducer);
    const {groups} =
    useSelector((state: RootState) => state.chatReducer);
  const [value, setValue] = useState([]);

  const processDataChunk = async (streamData: OpenAiRes) => {
    if (!streamData || !streamData.payload) return;
    let streamedChat: string = "";
    const reader = streamData.payload.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const readerResult = await reader.read();
      if (!readerResult) {
        break;
      }
      const { done, value } = readerResult;
      if (done) {
        break;
      }


      //process data chunk
      const decodedChunk = decoder.decode(value);
      streamedChat += decodedChunk;
      dispatch(setOutputCode(streamedChat.split("```")[1] ? streamedChat.split("```")[1] : ""));
      console.log("----====", streamedChat);
    }
  };

  const showInfoToast = (field:string) => {
    dispatch(setTranslating(false));
    toast.info(field);
    return;
  };

  const handleSubmit = async ({optimise}: {optimise: boolean}) => {
    dispatch(setTranslating(true));

    // if (!inputLang) {
    //   showInfoToast("Please fill the input language field.");
    //   return
    // } else 
    if (!inputCode) {
      showInfoToast("Please fill the input code field.");
      return
    } else if (!outputLang) {
      showInfoToast("Please fill the output language field.");
      return
    }else if(inputLang === outputLang){
      showInfoToast(`Code already in ${inputLang}`);
      return
    }

    const instruction = "Techmate is a friendly chatbot that specializes in computer science topics and kindly declines non-technical questions.\n\nTechmate helps in transpiling code from one programming language to another. If you need to transpile code, make sure you only provide the desired transpiled code within code blocks or fences, suitable for Markdown parsers."
    const instructionToOptimise = "Techmate, a friendly chatbot specializing in computer science, exclusively addresses technical inquiries. It excels in transpiling code across different programming languages. When requesting code transpilation, make sure you only provide the desired transpiled code within code blocks or fences, suitable for Markdown parsers. Additionally, if the provided code can be optimized, you should provide the optimized version of that code in desired output code language."

    const data: OpenAiData = {
      message: `${inputCode}\nThis code is written in ${inputLang}\nConvert this in ${outputLang}`,
      apiKeyName: "TRANSPILER_KEY",
      instruction : optimise ? instructionToOptimise : instruction 
    };

    await dispatch(sendToOpenAi(data)).then((result) => {
      if (!result) return;
      console.log('results of trans' , result)
      if (sendToOpenAi.fulfilled.match(result)) {
        if (result) {
          processDataChunk(result as OpenAiRes);
          dispatch(setTranslating(false));
        }
      } else if (sendToOpenAi.rejected.match(result)) {
        const err: any = result.payload;
        toast.error(err.message);
        dispatch(setTranslating(false));
      }
    });
  };

  const code = "var message = 'Monaco Editor!' \nconsole.log(message);";
  return (

    <>
    {/* <Head>
      <title>TechMate-Login</title>
    </Head> */}
    <div
      {...(isSmall && handlers)}
      id="transpiler"
      className={`${expanded ? 'navbar-expanded' : 'navbar-collapsed'} h-svh p-2 flex relative flex-col overflow-y-scroll bg-white dark:bg-[#0e1525] z-[100] gap-8`}
    >
        {isSmall && collapse && (
          <div
            className={`fixed top-2/4 delay-200 duration-700 ${expanded ? "left-16 rotate-0" : "left-1 rotate-[540deg]"} h-8 w-8 z-[10000] flex justify-center items-center`}
            onClick={() => {
              setExpanded(!expanded);
            } }
          >
            <BsCaretLeft />
          </div>
        )}

        <header className=" w-full h-[6rem] flex justify-center items-center flex-col gap-5">
          <h1 className="text-2xl">AI Code Transpiler</h1>

          <div className="flex justify-center items-center flex-col gap-2">
            <p className="text-tiny">Enter some code and click Translate</p>
          </div>
        </header>

        <section className="flex lg:flex-row justify-between gap-2 items-center flex-col">
          <div className={`w-full mt-7 md:mt-0 relative group ${isSmall ? "h-[50vh]" : "h-[75vh]"} code-mirror-container`}>
            <Select
              // onValueChange={(value) => dispatch(setInputLang(value))}
              // required
            >
              <SelectTrigger id="inp-lang" className="w-full mb-3">
                <SelectValue placeholder="Enter your input code" />
              </SelectTrigger>
              {/* <SelectContent className="z-[99999]">
                <SelectGroup>
                  {languageData.map((lang) => {
                    return (
                      <SelectItem key={lang.id} value={lang.name}>
                        {lang.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>*/}
            </Select> 
            {/* <p className="w-full mb- outline">Enter your input code</p> */}
            {isSmall && (
              <>
                <div className="flex w-full mb-3">
                  <Tooltip content="Submit">
                    <Button
                      className="bg-[#0072F5] text-white w-full"
                      onClick={() => handleSubmit({ optimise: false })}
                    >
                      <TfiWrite className="mr-1.5 h-4 w-4" />
                      Translate
                    </Button>
                  </Tooltip>
                  {/* <Tooltip content="Optimise">
                    <Button
                      className="bg-[#0072F5] text-white w-full"
                      onClick={() => handleSubmit({ optimise: true })}
                    >
                      <ReloadIcon className="mr-1.5 h-4 w-4" />
                      Optimise
                    </Button>
                  </Tooltip> */}
                </div>
              </>
            )}

            <CodeMirror
              className="code-mirror"
              value={inputCode}
              // height="100%"
              height={isSmall ? "40vh" : "70vh"}
              theme={colorMode === "dark" ? tokyoNight : bbedit}
              extensions={[javascript({ jsx: true })]}
              onChange={(value, viewUpdate) => {
                // Remove the //Input prefix before updating the state
                const cleanValue = value.replace(/\/\/Input/g, "").trim();
                dispatch(setInputCode(cleanValue));
              } } />
            <MdContentCopy
              className="absolute bottom-2 right-2 text-2xl hidden group-hover:block cursor-pointer opacity-50"
              onClick={() => copyToClipboard(inputCode)} />
          </div>

          <div className={`w-full mt-7 md:mt-0 relative group ${isSmall ? "h-[50vh]" : "h-[75vh]"} code-mirror-container`}>
            <Select
              onValueChange={(value) => dispatch(setOutputLang(value))}
              required
            >
              <SelectTrigger id="out-lang" className="w-full mb-3">
                <SelectValue placeholder="Select an output Language" />
              </SelectTrigger>
              <SelectContent className="z-[99999]">
                <SelectGroup>
                  {languageData.map((lang) => {
                    return (
                      <SelectItem key={lang.id} value={lang.name}>
                        {lang.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>

            <CodeMirror
              className="code-mirror"
              value={outputCode}
              // height="100%"
              height={isSmall ? "40vh" : "70vh"}
              theme={colorMode === "dark" ? tokyoNight : bbedit}
              extensions={[javascript({ jsx: true })]}
              onChange={(value, viewUpdate) => {
                dispatch(setOutputCode(value));
              } } />
            <MdContentCopy
              className="absolute bottom-2 right-2 text-2xl hidden group-hover:block cursor-pointer opacity-50"
              onClick={() => copyToClipboard(outputCode)} />
          </div>
        </section>

        {!isSmall && (
          <>
            <div className="flex  w-full   gap-3 justify-center items-center ">
              <Tooltip content="Submit">
                <Button
                  className="bg-[#0072F5] text-white w-1/6"
                  onClick={() => handleSubmit({ optimise: false })}
                >
                  <TfiWrite className="mr-1.5 h-4 w-4" />
                  Translate
                </Button>
              </Tooltip>
              {/* <Tooltip content="Optimise">
                <Button
                  className="bg-[#0072F5] text-white w-1/6"
                  onClick={() => handleSubmit({ optimise: true })}
                >
                  <ReloadIcon className="mr-1.5 h-4 w-4" />
                  Optimise
                </Button>
              </Tooltip> */}
            </div>
          </>
        )}
        {translating && (
          <div className="fixed top-0 bottom-0 left-0 right-0 backdrop-blur-[2px] bg-white/30 dark:bg-[#0e1525]/30 z-[9999] w-full h-full flex justify-center items-center flex-col">
            <ProgressBar
              height="100"
              width="100"
              borderColor="#0072F5"
              barColor="#0072F5" />
            <span className="text-black dark:text-white text-lg mt-5">
              Translating...
            </span>
          </div>
        )}
      </div></>
  );
};

export default CodeTranspiler;
