import React, { useEffect, useState } from "react";
import interViewImage from "@/assets/bg_removed.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Description {
  handleInterviewPhase: () => void;
}
type DeviceTypeInfo = {
  cameraDevices: MediaDeviceInfo[],
  audioInputDevices: MediaDeviceInfo[]
}
const DescriptionPhase: React.FC<Description> = ({ handleInterviewPhase }) => {

  const [devices, setDevices] = useState<DeviceTypeInfo>({
    cameraDevices: [],
    audioInputDevices: []
  });
  const [isCheckingDevice, setIsCheckingDevice] = useState(true);
  const router = useRouter();

  const handleDevices = (mediaDevices: MediaDeviceInfo[]) => {
    const cameraDevices = mediaDevices.filter(({ kind }) => kind === "videoinput");
      const audioInputDevices = mediaDevices.filter(({ kind }) => kind === "audioinput");
      console.log("-------------------- ",{cameraDevices: cameraDevices , audioInputDevices: audioInputDevices});
      console.log("previous devices" , devices)
      setDevices(prevDevices => ({
        ...prevDevices,
        cameraDevices,
        audioInputDevices
      }));
      console.log('called handled devices')
    setIsCheckingDevice(false);
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [MediaDevices]);

  console.log("devices>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" , devices)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (devices && !isCheckingDevice && (devices.cameraDevices.length === 0 || devices.audioInputDevices.length === 0)) {
      // console.log("No camera found!");
      let message;
      if (devices.cameraDevices.length === 0 && devices.audioInputDevices.length === 0) {
        message = "Camera & Audio inputs are missing."
      } else if (devices.cameraDevices.length === 0 && devices.audioInputDevices.length !== 0) {
        message = "Camera device is missing."
      } else {
        message = "Audio input device is missing."
      }

      toast.error(message);

      if (!interval) {
        interval = setTimeout(() => {
          router.back();
        }, 2000)
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [devices, router , setDevices]);

  return (
    <div className="bg-[#f9f9f9] text-black dark:bg-[#0E1525] dark:text-white" >
      {isCheckingDevice ?
        <h1 className="text-black dark:text-white" >Checking camera device</h1>
        :
        <div className="w-full lg:flex">
          <div className="mb-5 pl-2 lg:mb-10 lg:w-[50%]">
            <p className="mb-5 mt-5 lg:mb-5">
              Welcome to our platform! Are you ready to take your interview skills to the next level? Dive into our mock interview program and gain invaluable experience, feedback, and confidence to excel in your next interview. Whether {"you're"} a seasoned pro or just starting out, our mock interviews are designed to help you shine. {"Don't"} miss out on this opportunity to prepare and succeed! Explore now and unlock your potential.
            </p>

            <div>
              <div className="mb-2 mt-2 lg:mb-5">
                <p> - 2:30 Minute/Question</p>
                <p>
                  {" "}
                  -{" "}
                  <span className="dark:text-white/50 ">
                    Record & Review your answer
                  </span>{" "}
                </p>
              </div>

              <button
                onClick={() => {
                  if (devices.audioInputDevices.length !== 0 && devices.audioInputDevices.length !== 0) {
                    navigator.mediaDevices.enumerateDevices().then(handleDevices);
                    handleInterviewPhase();
                  }
                }}
                className={`mt-5 rounded-full ${devices.audioInputDevices.length !== 0 && devices.audioInputDevices.length !== 0 ? "bg-buttonbg hover:bg-buttonbg-dark" : "bg-gray-400 text-gray-600 cursor-not-allowed"} p-3 pl-5 pr-5`}
              >
                Start Interview
              </button>
            </div>
          </div>

          <div className="right pl-2 lg:w-[50%]">
            <Image src={interViewImage} alt="Mock interview illustration" />
          </div>
        </div>
      }
    </div>
  );
};

export default DescriptionPhase;
