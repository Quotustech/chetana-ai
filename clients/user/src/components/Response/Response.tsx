import React, { useEffect, useState } from "react";
import { LiaUserSolid } from "react-icons/lia";
import CodeBlock from "../CodeBlock/CodeBlock";
import { Copy } from "lucide-react";
import { Chat } from "@/common/interfaces/chat.interface";
import { toast } from "sonner";
import { copyToClipboard } from "@/utils/copyToClipboard";
import CodeBlockModal from "../CodeBlockModal/CodeBlockModal";
import { RootState, useSelector } from "@/redux/store";
import TextToSpeech from "../ChatFeed/TextToSpeech";

interface ResponseProps {
  data: Chat;
}

const Response:React.FC<ResponseProps> =({data}) => {
  const { showModal } = useSelector(
    (state: RootState) => state.chatReducer
  );
  // const [showModal, setShowModal] = useState<boolean>(false);
  const lines = data.answer ? data.answer.split("```") : [];
  const { user } = useSelector((state: RootState) => state.authReducer);

  const getUserInitial = () => {
    return user?.name?.charAt(0).toUpperCase() || 'B';
  };

  return (
    <>
    {showModal && <CodeBlockModal/>}
      <div className="h-auto relative flex flex-col items-baseline 2xl:w-3/4 xl:w-4/5 w-full gap-4">
        <div className="question w-full flex gap-3 items-center px-4 py-2 rounded-lg relative lg:min-h-16 min-h-8">
          <div className="w-10 h-10 border border-black-600 lg:p-1 rounded-full bg-gray-200 dark:bg-[#0e1525] absolute top-2 flex justify-center items-center">
            {/* <LiaUserSolid className="text[1.5rem] lg:text-4xl " /> */}
            {/* T */}
            {getUserInitial()}
          </div>

          {/* <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-black mr-4 ">
            T
          </div> */}
          <div className="lg:text-lg text-sm lg:ml-16 ml-[2.1rem] ">
            {data.question}
          </div>

          {/* Container for speaker button */}
        {/* <div className="absolute top-2 right-2"> */}
        {/* <div className="flex items-center ml-4"> */}
        {/* top-[calc(100%_+_0.5rem)] */}
        {/* <div className="absolute  right-0  z-10"> */}
        <div className="ml-auto mr-7">
          <TextToSpeech text={data.answer?.replace(/\n+/g, ' ').trim()}  autoPlay={false}/> {/* Add the TextToSpeech component here */}
        </div>

        </div>
        
        <div className="answer w-full flex gap-2 items-baseline px-4 py-2 rounded-lg relative top-0 left-0 lg:min-h-16 min-h-8">
          {/* <div className="border border-black-600 lg:p-1 rounded-full bg-gray-200 dark:bg-[#0e1525] absolute top-2"> */}
          <div className="w-10 h-10 border border-black-600 lg:p-1 rounded-full bg-gray-200 dark:bg-[#0e1525] absolute top-2 flex justify-center items-center">

            {/* <LiaUserSolid className="text[1.5rem] lg:text-4xl " /> */}
            {/* {getUserInitial()} */}
            T
          </div>

          {/* <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-black mr-4">
            {getUserInitial()}
          </div> */}
          <div className="lg:text-lg text-sm lg:ml-16 ml-[2.1rem] mt-2 w-[94%] max-w-[94%]">
          
            {lines.map((line, index) => {
              if (index % 2 !== 0) {
                return (
                  <div
                    key={index}
                    className="relative"
                  >
                    <CodeBlock codeSnippet={line} language="bash" openInModal={false}/>
                    
                  </div>
                );
              } else {
                const parts = line.split("\n");
                return (
                  <div key={index} className="w-full">
                    {parts.map((part, partIndex) => (
                      <p
                        key={partIndex}
                        className="flex flex-start items-start mb-1"
                      >
                        {part}
                      </p>
                    ))}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Response;