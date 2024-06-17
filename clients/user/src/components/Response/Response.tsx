import React, { useEffect, useState } from "react";
import { LiaUserSolid } from "react-icons/lia";
import CodeBlock from "../CodeBlock/CodeBlock";
import { Copy } from "lucide-react";
import { Chat } from "@/common/interfaces/chat.interface";
import { toast } from "sonner";
import { copyToClipboard } from "@/utils/copyToClipboard";
import CodeBlockModal from "../CodeBlockModal/CodeBlockModal";
import { RootState, useSelector } from "@/redux/store";

interface ResponseProps {
  data: Chat;
}

const Response:React.FC<ResponseProps> =({data}) => {
  const { showModal } = useSelector(
    (state: RootState) => state.chatReducer
  );
  // const [showModal, setShowModal] = useState<boolean>(false);
  const lines = data.answer ? data.answer.split("```") : [];
  

  return (
    <>
    {showModal && <CodeBlockModal/>}
      <div className="h-auto relative flex flex-col items-baseline 2xl:w-3/4 xl:w-4/5 w-full gap-4">
        <div className="quetion w-full flex gap-3 items-center px-2 rounded-lg relative lg:min-h-16 min-h-8">
          <div className="border border-black-600 lg:p-1 rounded-full bg-gray-200 dark:bg-[#0e1525] absolute top-2">
            <LiaUserSolid className="text[1.5rem] lg:text-4xl " />
          </div>
          <div className="lg:text-lg text-sm lg:ml-16 ml-[2.1rem] ">
            {data.question}
          </div>
        </div>
        <div className="answer w-full flex gap-2 items-baseline px-2 rounded-lg relative top-0 left-0 lg:min-h-16 min-h-8">
          <div className="border border-black-600 lg:p-1 rounded-full bg-gray-200 dark:bg-[#0e1525] absolute top-2">
            <LiaUserSolid className="text[1.5rem] lg:text-4xl " />
          </div>
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