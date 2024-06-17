import React from 'react'
interface ILiveIcon{
  className?: string
}
const LiveIcon:React.FC<ILiveIcon> = ({className}) => {
  return (
    <span className={`flex justify-center items-center w-6 h-6 rounded-full border-2 border-white/70 mr-2 ml-1 ${className}`} >
       <span className='block w-3.5 h-3.5 bg-red-600 rounded-full' >
         
       </span>
    </span>
  )
}

export default LiveIcon