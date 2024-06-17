import React, { ReactNode } from 'react'
interface IGeneralButton{
    children?: ReactNode;
    className?: string;
    onClick?: ()=> void;
    backgroundColor?: boolean;
}
const GeneralButton: React.FC<IGeneralButton> = ({children,className, onClick,backgroundColor}) => {
  return (
    <button onClick={onClick} className={`mr-5 mt-3 flex items-center rounded-full ${ (backgroundColor === null || backgroundColor === undefined || backgroundColor === true) ? 'bg-buttonbg': "bg-none border border-white"} p-2 pl-3 pr-3 ${className}`} >
      {children || "General Button"}
    </button>
  )
}

export default GeneralButton
