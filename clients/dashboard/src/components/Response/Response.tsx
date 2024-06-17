import React, { useState } from "react";
import {Copy} from "lucide-react";
import CodeBlock from "../CodeBlock/CodeBlock";
import { CircleUser } from "lucide-react";
import image from "../assets/user2.png";
import { Chat } from "@/src/common/interfaces/chat.interface";


interface ResponseProps{
  data: Chat
}

const Response: React.FC<ResponseProps> = ({data }) => {
  const [copiedStates, setCopiedStates] = useState([]);
  if (!data) {
    return null;
  }

  const lines = data.answer ? data.answer.split("\n") : [];

  let inCodeBlock = false;
  let codeSnippet: any[] = [];

  return (
    <div className="flex  overflow-y-scroll">
      <div className="text-gray-800 h-[23rem] sm:px-2  rounded-lg ">
        <div className=" overflow-y-hidden overflow-x-hidden">
          <div className="bg-[#F3F4F6] dark:bg-black dark:text-[#B9BFBC]   rounded-lg py-4 px-3 mb-2 flex relative">
            <h2 className="text-xl font-semibold items-start sm:text-base ">
              <span className="text-gray-500">Question : </span>
              {data.question}
            </h2>
          </div>
          <div className="rounded-lg mb-2  bg-[#F3F4F6] dark:bg-black  dark:text-[#B9BFBC]  max-h-[600px] max-w-[1200px] overflow-y-auto flex relative">
            <div id="output" className="pl-3">
            <span className="text-gray-500 text-xl font-semibold items-start sm:text-base">Ans : </span>
              {lines.map((line, index) => {
                if (line.startsWith("```") && !inCodeBlock) {
                  // Start of a code block
                  inCodeBlock = true;
                  codeSnippet = [];
                } else if (line.startsWith("```") && inCodeBlock) {
                  // End of a code block
                  inCodeBlock = false;
                  const codeContent = codeSnippet.join("\n");

                  return (
                    
                    <div key={index} className="relative ">
                      <CodeBlock codeSnippet={codeContent} language="bash" />
                      <button
                        className="absolute top-0 right-0 m-2 p-2 bg-gray-800 text-white rounded"
                        // onClick={() => handleCopyClick(codeContent, index)}
                        disabled={copiedStates[index]}
                      >
                        {copiedStates[index] ? "Copied" : <Copy />}
                      </button>
                    </div>
                  );
                } else if (inCodeBlock) {
                  // Inside a code block
                  codeSnippet.push(line);
                } else {
                  // Outside a code block
                  return (
                    <p
                      key={index}
                      className="flex flex-start items-start font-semibold lg:py-2 sm:py-1 sm:text-base"
                    >
                      {line}
                    </p>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Response;
