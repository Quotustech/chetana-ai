import React from "react";
import LiveIcon from "./LiveIcon";
interface Time {
  time: number;
  isRecording : boolean | null;
  className?: String
}
const InterViewTimer: React.FC<Time> = ({ time, isRecording, className  }) => {
  
  return (
    <div className={`${className} backdrop-blur-md bg-black/40 flex flex-col items-center justify-center rounded-lg p-3 w-24 md:w-48`} >
      <h3 className="md:mb-1 md:mt-1 text-sm font-bold text-white/50  md:text-lg">
       {isRecording ? "Time left" : "Total time"} 
      </h3>
      <h2 className="text-lg xl:text-3xl font-bold text-white">
        {" "}
        {String(Math.floor(time / 60)).padStart(2, "0")}:
        {String(time % 60).padStart(2, "0")}
      </h2>
    </div>
  );
};

export default InterViewTimer;
