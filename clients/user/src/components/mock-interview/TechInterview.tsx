"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { interviewQuestions } from "@/utils/ConstantData";
import NoQuestionsFound from "./NoQuestionsFound";

import DescriptionPhase from "./InterviewPhases/DescriptionPhase";
import RecordingPhases from "./InterviewPhases/RecordingPhases";
import SubmitAnswerPhase from "./InterviewPhases/SubmitAnswerPhase";
import SpeechRecognitionComponent from "./SpeechRecognitionComponent";
import { ImCross } from "react-icons/im";
import GeneralButton from "./common/GeneralButton";
import { FaDownload } from "react-icons/fa";
import ReportModal from "./report/ReportModal";
import { TbReport } from "react-icons/tb";
import extractFeedbackInfo from "@/utils/extractFromFeedback";
import { constantReportData } from "@/utils/constantReportData";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import { useSelector, RootState, useDispatch } from "@/redux/store";
import { getQuestions } from "@/redux/slices/question/questionActions";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

type Props = {};

export interface IUserAttempts {
  role: string; // web developer
  totalQsns?: number | null;
  attempts: IQuestionTrack[]
}
export interface IQuestionTrack {
  actualQsn: String;
  qsnId: string | number;
  isAttempted: boolean;
  userAnswer: string;
  feedbackOnAnswer: string;
  feedbackOnCommunication: string;
  answerScore: number;
  communicationScore: number;
}

const TechInterview = (props: Props) => {

  const { isError, isLoading, questions, jobDetails } = useSelector((state: RootState) => state.questionReducer);
  // const [jobname, setJobName] = useState<string>("");
  // const [currentRole, setCurrentRole] = useState<string>("");
  // const {jobRole, jobName, description} = jobDetails;

  const router = useRouter();

  const params = useParams<{ jobid: string }>();
  const [interviewPhase, setInterviewPhase] = useState<number>(0);
  const [currentQsn, setCurrentQsn] = useState<number>(0);
  const [video, setVideo] = useState<null | Blob[]>(null);
  const [isInterviewStarted, setInterviewStarted] = useState<boolean>(false);
  // const currentRoleKey = currentRole as keyof typeof interviewQuestions;
  let totalQsns: number = questions.length;

  const dispatch = useDispatch();

  // console.log("--- Error ---", isError);
  // console.log("--- Loading ---", isLoading);
  // console.log("--- questions ---", questions);
  // console.log("--- jobDetails ---", jobDetails);

  useEffect(() => {
    dispatch(getQuestions(params.jobid))
  }, [dispatch]);
  // console.log("getQuestions", getQuestions);

  const [userAttemptsTrack, setUserAttemptsTrack] = useState<IUserAttempts>({
    role: "",
    attempts: [],
    totalQsns: null
  });


  const [modal, setModal] = useState<boolean>(false);
  const toggleModal = () => {
    setModal(!modal);
  }
  // console.log("currentRole",  params.jobid.split("%20")[0].split("%26").join("/")+ " " + params.jobid.split("%20")[1]);
  // console.log("key__", currentRoleKey);

  // Reset Attempted Question :: When user tries again to answer an already attempted question which has been submitted
  const resetAttemptedQsn = () => {
    // loop through that number & reset it

  }

  const updateAttemptedQsn = (userAnswer: string, feedback: string) => {
    const { feedbackOnAnswer, feedbackOnCommunication, score, communicationScore } = extractFeedbackInfo(feedback);
    const attempted: IQuestionTrack = {
      actualQsn: questions[currentQsn].question,
      qsnId: questions[currentQsn]._id,
      isAttempted: true,
      userAnswer: userAnswer,
      feedbackOnAnswer,
      feedbackOnCommunication,
      answerScore: score,
      communicationScore
    }
    setUserAttemptsTrack((prev) => {
      return { ...prev, attempts: [...prev.attempts, attempted] }
    })
  }
  // Update Attempted Question :: When user successfully submits answer(recorded video & gets feed back)

  useEffect(() => {
    if (jobDetails) {
      setUserAttemptsTrack((prev) => {
        return { ...prev, role: jobDetails.jobRole }
      }); // ex Web Developer
    }
  }, [jobDetails]);


  useEffect(()=>{
    let interval: NodeJS.Timeout | null = null;
    if (!isLoading && questions.length === 0) {
      toast.error(`No questions! for ${jobDetails?.jobName}`);
      if (!interval) {
        interval = setTimeout(()=>{
          router.back();
        },2000)
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  },[isLoading])


  const handleInterviewPhase = (numState?: number) => {
    if (!numState) {
      if (interviewPhase === 2) {
        return setInterviewPhase(1);
      }
      setInterviewPhase((prev) => {
        return prev + 1;
      });
    } else {
      switch (numState) {
        case 0:
          setInterviewPhase(0);
          break;
        case 1:
          setInterviewPhase(1);
          break;
        case 2:
          setInterviewPhase(2);
          break;
        default:
          setInterviewPhase(0);
          break;
      }
    }
  };

  const handleVideo = (blob: Blob[]) => {
    setVideo(blob);
  };

  const handleCurrentQsn = () => {
    if (currentQsn < totalQsns - 1) {
      setCurrentQsn((prev) => {
        return prev + 1;
      });
    } else {
      setCurrentQsn(0);
    }
    handleInterviewPhase(1);
  };

  return (
    <section className="bg-[#f9f9f9] text-black dark:bg-[#0E1525] dark:text-white flex h-screen overflow-y-scroll justify-center pb-5 pr-3 pt-3 lg:pb-10">
      {isLoading ? <h1>Fetching questions</h1> :
        <>
          {
            questions.length > 0 ?
              <div className="w-[90%] md:ml-5 md:mt-2 md:w-[95%] relative">
                <div className="mt-2 lg:mb-2 lg:mt-10">
                  {interviewPhase === 0 && (
                    <h1 className="m-1 ml-0 text-2xl font-bold text-[#8CB1F3] md:text-4xl">
                      Questions ({`${questions.length}`})
                    </h1>
                  )}
                </div>
                {/* --- This component will be shown based on modal state */}
                <ReportModal toggleModal={toggleModal} userAttemptsTrack={userAttemptsTrack} modal={modal} />

                {/* ----- Zeroth Interview state :: Description section -----  */}
                {interviewPhase === 0 && (
                  <DescriptionPhase handleInterviewPhase={handleInterviewPhase} />
                )}

                {/* --- Common for all interview state --- */}
                {interviewPhase > 0 && (
                  <div className="mb-6 lg:mb-[50px]">
                    <h1 className="mb-2 text-sm md:text-xl font-bold">
                      {" "}
                      {jobDetails?.jobName} Mock Interview
                    </h1>
                    <h1 className="m-1 mt-0 text-2xl font-bold text-[#8CB1F3] md:text-4xl">
                      Question {currentQsn + 1}
                    </h1>
                    <p className="pl-1">
                      {questions[currentQsn].question}
                    </p>
                  </div>
                )}

                {/* ----- First Interview state :: Recording section -----  */}
                {interviewPhase === 1 && (
                  <RecordingPhases
                    interviewPhase={interviewPhase}
                    handleInterviewPhase={handleInterviewPhase}
                    setInterviewStarted={(value) => { setInterviewStarted(value) }}
                    callBack={(videoBlob) => {
                      handleVideo(videoBlob);
                    }}
                  />
                )}

                {/* ----- Second Interview state :: Submit section -----  */}
                {interviewPhase === 2 && (
                  <>
                    <SubmitAnswerPhase
                      videoBlobChunks={video as Blob[]}
                      handleInterviewPhase={handleInterviewPhase}
                      currentQsn={questions[currentQsn].question}
                      handleCurrentQsn={handleCurrentQsn}
                      updateAttemptedQsn={updateAttemptedQsn}
                      resetAttemptedQsn={resetAttemptedQsn}
                      userAttemptsTrack={userAttemptsTrack}
                      toggleModal={toggleModal}
                      setInterviewStarted={(value) => { setInterviewStarted(value) }}
                    />
                  </>
                )}
              </div>
              :
               <div className="pt-5" >
                 <h1 className="text-center" >No questions found for <span className="text-customTextColor" >{jobDetails?.jobName}</span> Job!</h1>
               </div>
          }
        </>
      }
    </section>
  );
};

export default TechInterview;
