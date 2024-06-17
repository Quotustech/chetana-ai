import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import InterViewTimer from "../common/InterViewTimer";
import LiveIcon from "../common/LiveIcon";


interface RecordingPhaseType {
  interviewPhase: number;
  handleInterviewPhase: () => void;
  setInterviewStarted: (value:boolean) => void;
  callBack?: (videoBlob: Blob[]) => void;
}

const RecordingPhases: React.FC<RecordingPhaseType> = ({
  interviewPhase,
  handleInterviewPhase,
  setInterviewStarted,
  callBack,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState<null | boolean>(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [interviewTime, setInterviewTime] = useState<number>(151); // to record 150 sec of video
  const timeRef = useRef<number | NodeJS.Timeout>(0);

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(
      webcamRef?.current?.stream as MediaStream,
    );
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable,
    );
    mediaRecorderRef.current.start(1000);
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleStopCaptureClick = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  useEffect(() => {
    // capturing stopped & some video recorded
    if (capturing === false && recordedChunks.length) {
      callBack && callBack(recordedChunks);
      handleInterviewPhase();
      clearInterval(timeRef.current);
    }

    // capturing stopped in less than a second
    if (capturing === false && interviewTime === 151) {
      clearInterval(timeRef.current);
      setRecordedChunks([]);
    }

    // capturing started
    if (capturing) {
      const intervalId = setInterval(() => {
        setInterviewTime((prev) => {
          return prev - 1;
        });
      }, 1000);
      timeRef.current = intervalId;
    }
  }, [capturing]);

  // automatic stop of recording after 2min 30 sec 
  useEffect(() => {
    if (capturing && interviewTime === 0) {
      clearInterval(timeRef.current);
      setCapturing(false)
    }
  }, [interviewTime])

  const handleDataAvailable = useCallback(
    ({ data }: { data: Blob }) => {
      if (data && data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks],
  );

  return (
    <div>
      <div className="min-h-[250px] lg:min-h-[450px] w-full relative sm:mb-1.5 md:mb-2 lg:mb-3 flex justify-center items-center" >
         <div className="relative w-[100%] lg:max-w-fit" >
            {capturing && <LiveIcon className="absolute w-3 h-3 right-1 top-5 lg:right-3 llg:top-3" />}
            <Webcam
              className="sm:w-full sm:h-fit lg:w-[1080px] lg:h-[600px] rounded-md object-cover "
              audio={true}
              ref={webcamRef}
            />
            <InterViewTimer className="absolute top-3 left-1 lg:top-5 lg:left-5" time={interviewTime - 1} isRecording={capturing} />
         </div>
      </div>

      {capturing ? (
        <div className="flex items-center justify-center" >
          <button
            className="rounded-full bg-red-300 text-red-800 p-2 pl-3 pr-3"
            onClick={() => {
              handleStopCaptureClick();
            }}
          >
            Stop Recording
          </button>
          {/* <InterViewTimer time={interviewTime - 1} isRecording={capturing} /> */}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <button
            className="flex items-center rounded-full bg-buttonbg p-2 pl-3 pr-3 text-white"
            onClick={()=>{
              handleStartCaptureClick()
              setInterviewStarted(true)
            }}
          >
            {" "}
            <LiveIcon /> Start Answering
          </button>
          <p className="text-white/70 mt-3">
            Recording will be stopped automatically after 2:30 min.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecordingPhases;
