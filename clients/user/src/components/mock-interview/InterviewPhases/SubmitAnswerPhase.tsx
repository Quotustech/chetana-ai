import React, { useEffect, useRef, useState } from "react";
import VideoContainer from "../common/VideoContainer";
import axiosAuthInstance from "@/utils/apiAxiosAuthInstance";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { v4 as uuid } from "uuid";
import Cookies from "js-cookie";
import { Progress } from "@/components/ui/Progress";
import { FaCloudUploadAlt } from "react-icons/fa";
import { GrNext } from "react-icons/gr";
import { TbReport } from "react-icons/tb";
import GeneralButton from "../common/GeneralButton";
import extractFeedbackInfo from "@/utils/extractFromFeedback";
import { IUserAttempts } from "../TechInterview";
import { useRouter } from 'next/navigation';

const ApiUrl = process.env.NEXT_PUBLIC_API_URL;

interface ISubmitAnswer {
  videoBlobChunks: Blob[] | null;
  handleInterviewPhase: (num?: number) => void;
  currentQsn: string;
  userAttemptsTrack: IUserAttempts;
  handleCurrentQsn: () => void;
  updateAttemptedQsn: (userAnswer: string, feedback: string) => void;
  resetAttemptedQsn: () => void;
  toggleModal: () => void;
  setInterviewStarted: (value:boolean) => void;
}

// interface {
//   apiKey :
// }
interface IQsnAns {
  message: string;
  apiKeyName: string;
  instruction: string;
}

const ffmpeg = createFFmpeg({
  // corePath: `http://localhost:3000/ffmpeg/dist/ffmpeg-core.js`,
  // I've included a default import above (and files in the public directory), but you can also use a CDN like this:
  corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
  log: true,
});

const SubmitAnswerPhase: React.FC<ISubmitAnswer> = ({
  videoBlobChunks,
  handleInterviewPhase,
  currentQsn,
  handleCurrentQsn,
  updateAttemptedQsn,
  resetAttemptedQsn,
  userAttemptsTrack,
  toggleModal,
  setInterviewStarted
}) => {
  const [subTitle, setSubTitle] = useState<string>("");
  const [expandAnswer, setExpandAnswer] = useState<boolean>(false);
  const [isSubmitted, setSubmitted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>(""); // all things regarding user tech skill, communication skill, feedback on both ans & communication
  const [userFeedback, setUserFeedback] = useState({
    isTobeShown: false,
    feedbackOnAnswer: "",
    feedbackOnCommunication: ""
  }) // through this we will only show ans & communication feedback
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVideoProcessed, setVideoProcessed] = useState<boolean>(false);
  const [scrollToFeedback, setScrollToFeedback] = useState<boolean>(false);
  const router = useRouter();

  const feedbackRef = useRef<HTMLDivElement>(null);


  const handleExpandAnswer = () => {
    setExpandAnswer((prev) => {
      return !prev;
    });
  };

  // console.log(userAttemptsTrack);

  const handleSubmit = async () => {
    setIsLoading(true)
    const blobVideoData = new Blob(videoBlobChunks as Blob[], {
      type: "video/webm",
    });
    const unique_id = uuid();
    const videoFile = new File([blobVideoData], `${unique_id}.webm`, { type: 'video/webm' });
    const formData = new FormData();
    formData.append('recordedVideo', videoFile);
    setSubTitle("")
    axiosAuthInstance.post("/api/v1/interview", formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Important to set the correct content type for FormData
      }
    })
      .then((response) => {
        if (response.status === 200) {
          const { text } = response.data;
          if (text === "") {
            setIsLoading(false)
            window.alert("Empty text");
          } else {
            setCount((prev) => prev + 1);
            setVideoProcessed(true);
            setSubTitle(text);
            setSubmitted(true);
          }
        } else {
          // console.log("Some error occurred");
          window.alert("Some error occurred");
        }
      })
      .catch(error => {
        // console.log("--Error in submitting video ---", error);
        setIsLoading(false);
      })
  };

  const scrollToTargetDiv = () => {
    if (feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      // feedbackRef.current.scrollTo({
      //   top: feedbackRef.current.scrollHeight,
      //   behavior: "smooth",
      // });
    }
  };


  const getFeedback = async () => {
    // const prompt = `Please give feedback on the following interview question: ${currentQsn} given the following candidates answer: ${subTitle}. \n Please also give feedback on the candidate's communication skills. Make sure their response is structured (perhaps using the STAR or PAR frameworks). \n\n\n\ Feedback on the candidate's response:`
    const prompt = `Please give feedback on the following interview question: ${currentQsn} given the following candidates answer: ${subTitle}.`
    const instruction = `\n You have to give 4 things regarding the answer & these are no.1 Feedback on candidates answer, no2. Feedback on candidates communication skill, no3. score for answer out of 10 & no4. score for communication skill. These 4 things should start with # symbol & after : your feedback & make sure these four things separated by this characters _$$_ . So your final response should look something like below \n\n
    #FeedbackOnAnswer:<YOUR_FEEDBACK_ON_ANSWER> _$$_
    #FeedbackOnCommunication:<YOUR_FEEDBACK_ON_ANSWER> _$$_
    #Score=<NUMBER_OUT_OF_10> _$$_
    #CommunicationSCore=<NUMBER_OUT_OF_10>
    \n\n`

    const data: IQsnAns = {
      message: prompt,
      apiKeyName: "MOCK_INTERVIEW_KEY",
      instruction
    }
    const token = Cookies.get("authToken");
    try {
      const res = await fetch(`${ApiUrl}/api/v1/chat`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.statusText === "OK") {
        const processDataChunk = async (streamData: any) => {

          setCount((prev) => prev + 1);
          setIsLoading(false);
          setScrollToFeedback(true);

          if (!streamData) return;
          let streamedChat: string = "";
          const reader = streamData.getReader();
          const decoder = new TextDecoder();
          while (true) {
            const readerResult = await reader.read();
            if (!readerResult) {
              // console.log("Reader result is undefined.");
              break;
            }
            const { done, value } = readerResult;
            if (done) {
              // console.log("Stream ended");
              updateAttemptedQsn(subTitle, streamedChat);
              const { feedbackOnAnswer, feedbackOnCommunication } = extractFeedbackInfo(streamedChat);
              setUserFeedback((prev) => {
                return { ...prev, isTobeShown: true, feedbackOnAnswer, feedbackOnCommunication }
              });
              setInterviewStarted(false); // Feedback completed now set interview state to false to show home button
              break;
            }
            // Process the chunk of data
            const decodedChunk = decoder.decode(value);
            streamedChat += decodedChunk;
            setFeedback(streamedChat)
          }
        };
        processDataChunk(res.body)
      } else {
        setIsLoading(false);
        throw new Error("error while getting response from openai");
      }
    } catch (error) {
      // console.log("--- Error in getting feedback ---", error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isVideoProcessed) {
      // call API for feedback
      getFeedback()
    }
  }, [isVideoProcessed, subTitle])

  const handleRetry = () => {
    // set interview state to 1
    handleInterviewPhase(1);
  };

  useEffect(() => {
    if (scrollToFeedback) {
      scrollToTargetDiv()
    }
  }, [scrollToFeedback, feedback])

  return (
    <div ref={feedbackRef} className="overflow-y-scroll" >
      {isLoading &&
        <div className="fixed z-20 top-0 left-0 backdrop-blur-md bg-black/40 w-full h-screen" >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" >
            <div className="mb-2" >
              {count === 0 && <p className="text-sm" >Uploading video</p>}
              {count === 1 && <p className="text-sm" >Processing your answer</p>}
              {count === 2 && <p className="text-sm" >Preparing feedback</p>}
            </div>
            <Progress className="text-customTextColor border-2 border-white" value={count === 0 && 33 || count === 1 && 66 || count === 2 && 100 || 0} />
          </div>
        </div>
      }
      {videoBlobChunks ? (
        <>
          <VideoContainer
            videourl={URL.createObjectURL(
              new Blob(videoBlobChunks as Blob[], {
                type: "video/webm",
              }),
            )}
            isSubmitted={isSubmitted}
          />

          {!isSubmitted && (
            <div className="mb-3 mt-3 flex">
              <GeneralButton
                className="text-sm bg-customTextColor text-white"
                onClick={handleSubmit}
              >
                <FaCloudUploadAlt className="mr-2" /> Submit Answer
              </GeneralButton>

              <GeneralButton className="text-sm bg-customTextColor text-white" onClick={()=>{
                handleRetry()
                setInterviewStarted(false)
              }} backgroundColor={false} >
                Try again
              </GeneralButton>
            </div>
          )}
        </>
      ) : (
        <h1>Loading video</h1>
      )}
      <div>
        {isSubmitted && feedback && (
          <>
            <h1 className="m-1 ml-0 mt-3 text-2xl font-bold text-[#8CB1F3] md:text-4xl">
              Feedback
            </h1>
            <div>
              {userFeedback.isTobeShown ?
                <>
                  <h2 className="text-customTextColor font-bold  mt-3 mb-1" >Technical</h2>
                  <p className="text-sm" >
                    {userFeedback.feedbackOnAnswer || "No proper answers provided by user."}
                  </p>
                  <h2 className="text-customTextColor font-bold mt-3 mb-1" >Communication</h2>
                  <p className="text-sm" >
                    {userFeedback.feedbackOnCommunication || "No feedback available."}
                  </p>
                </>
                :
                <p>Making feedback for you!</p>
              }
            </div>
            <div className={`mt-2`} >
              {userAttemptsTrack.totalQsns === userAttemptsTrack.attempts.length ?
                <>
                  <div>
                    <p>🎉 Congrats! You have completed all questions.</p>
                    <div className="flex" >
                      <GeneralButton className="text-sm bg-customTextColor text-white" onClick={()=> router.push('/app/mock-interview') } >
                        Give Other interview
                      </GeneralButton>

                      <GeneralButton className="text-sm bg-customTextColor text-white" onClick={() => { toggleModal() }} >
                        See Report  <TbReport className="ml-2" />
                      </GeneralButton>
                    </div>
                  </div>
                </>
                :
                <div className="flex" >
                  <GeneralButton className="text-sm bg-customTextColor text-white mr-2" onClick={handleCurrentQsn} >
                    Proceed next <GrNext className="ml-2" />
                  </GeneralButton>
                  <GeneralButton className="text-sm bg-customTextColor text-white" onClick={() => { toggleModal() }} >
                    See Report  <TbReport className="ml-2" />
                  </GeneralButton>
                </div>
              }
              {/* -- If we put try again here then we have to edit that attempted question when clicked -- */}
              {/* <GeneralButton onClick={handleRetry} backgroundColor={false} >
                Try again
              </GeneralButton> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubmitAnswerPhase;
