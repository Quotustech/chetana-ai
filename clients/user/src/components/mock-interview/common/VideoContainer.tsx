import React from "react";
import { FaDownload } from "react-icons/fa";

interface VideoDetails {
  videourl: string;
  isSubmitted?: boolean;
}
const VideoContainer: React.FC<VideoDetails> = ({ videourl,isSubmitted }) => {
  const handleDownload = () => {
    if (videourl) {
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.href = videourl;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(videourl);
    }
  };

  return (
    <div >
      <video controls className={`w-[100%] lg:w-[600px] max-w-[1080px] max-h-[720px]`}>
        <source src={videourl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button
        className="mt-5 mr-5 flex items-center rounded-full bg-customTextColor text-white p-2 pl-3 pr-3 text-sm"
        onClick={() => {
          handleDownload();
        }}
      >
       <FaDownload className="text-sm bg-customTextColor text-white mr-2" /> Download
      </button>
    </div>
  );
};

export default VideoContainer;
