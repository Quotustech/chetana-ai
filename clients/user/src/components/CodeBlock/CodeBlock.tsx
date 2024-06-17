import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useSelector, RootState , useDispatch } from "@/redux/store";
import { copyToClipboard } from "@/utils/copyToClipboard";
import { Copy } from "lucide-react";
import { Maximize } from "lucide-react";
import { Minimize } from 'lucide-react';
import { setModalContent, setShowModal } from "@/redux/slices/chat/chatSlice";

type Props = {
  codeSnippet: string;
  language: string;
  openInModal: boolean;
};

const CodeBlock = ({ codeSnippet, language , openInModal}: Props) => {
  const dispatch = useDispatch();
  const { responding , showModal } = useSelector((state: RootState) => state.chatReducer);
  const [copied, setCopied] = useState(false);
  return (
    <>
    <div className="relative mb-3 w-[94%] max-w-[94%] max-h-[80svh] overflow-x-scroll rounded-md bg-gray-800 p-2">
      <button
        className="absolute right-0 top-0 m-2 flex gap-3 rounded bg-gray-800 p-2 text-white"
      >
        {
          openInModal ? (
            <Minimize onClick={()=> {
              // console.log('clicked')
              dispatch(setShowModal(!showModal));
              dispatch(setModalContent({ codeSnippet, language }))
            }}/>
          ) : (
            <Maximize onClick={()=> {
              // console.log('clicked')
              dispatch(setShowModal(!showModal));
              dispatch(setModalContent({ codeSnippet, language }))
            }}/>
          )
        }
       
        {copied ? (
          "Copied"
        ) : (
          <Copy
            onClick={() =>
              copyToClipboard(codeSnippet.replace(/^\w+\s*/, ""), setCopied)
            }
          />
        )}
      </button>

      <div className="mb-1 pl-1 text-sm font-bold tracking-widest text-white">
        {codeSnippet.split("\n")[0]}
      </div>
      <SyntaxHighlighter language={language} style={coldarkDark}>
        {codeSnippet.replace(/^\w+\s*/, "")}
      </SyntaxHighlighter>
    </div>
    </>
  );
};

export default CodeBlock;
