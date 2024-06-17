import React, { useEffect, useState } from 'react';
import { IUserAttempts } from '../TechInterview';
import { ImCross } from 'react-icons/im';
import { FaRegCircleQuestion } from "react-icons/fa6";
import PDFViewer from './Pdfviewer';

interface IReportModal {
  toggleModal: () => void;
  modal: boolean;
  userAttemptsTrack: IUserAttempts;
}

const ReportModal: React.FC<IReportModal> = ({ modal, toggleModal, userAttemptsTrack }) => {
  const { totalQsns, attempts, role } = userAttemptsTrack;
  const [averageScores, setAverageScores] = useState<{ ansScore: number; comScore: number }>({
    ansScore: 0,
    comScore: 0
  });
  const [overallScore, setOverallScore] = useState<number>(0);
  const [reportView, setReportView] = useState<boolean>(false); // for showing / downloading PDF

  useEffect(() => {
    const calculateScore = () => {
      const totalAttempts = attempts.length;
      const comScore = attempts.reduce((acc, attempt) => acc + attempt.communicationScore, 0);
      const ansScore = attempts.reduce((acc, attempt) => acc + attempt.answerScore, 0);
      
      const avgComScore = totalAttempts > 0 ? comScore / totalAttempts : 0;
      const avgAnsScore = totalAttempts > 0 ? ansScore / totalAttempts : 0;
      
      setAverageScores({ ansScore: avgAnsScore, comScore: avgComScore });
      setOverallScore((avgAnsScore + avgComScore) / 2);
    };
    
    calculateScore();
  }, [attempts]);

  return (
    <div className={`fixed w-full h-screen transition ease-in-out duration-500 bg-black/60 top-0 ${modal ? "left-0" : " -left-[110%]"} z-10 flex justify-center items-center text-black`} >

      <div className="w-[90%] max-w-[1280px] h-[90%] bg-[#f9f9f9] text-black dark:bg-gray-600 dark:text-white rounded-lg relative overflow-scroll pl-[3%] pr-[3%]">
        <ImCross className="absolute top-3 right-3 md:top-5 md:right-5 cursor-pointer text-lg " onClick={toggleModal} />

        <div className="mt-7 pl-2 pr-2 shadow-md mb-4" >
          <div className='m-auto  flex justify-between pb-5' >
            <div className='' >
              <h1 className="pb-2 mb-1" >Interview Report</h1>
              <h1 className="text-xl md:text-2xl font-bold" >{role}</h1>
              <div className='mt-2' >
                <p className="flex items-center" ><FaRegCircleQuestion className='mr-1 text-customTextColor' />{attempts.length}/{totalQsns}</p>
              </div>
            </div>
            <div className='bg-gray-300/25 flex flex-col justify-center items-center rounded-lg w-24 h-24 lg:w-32 lg:h-32 mt-5 md:mr-[10%] p-2' >
              <h1><span className='text-customTextColor text-2xl lg:text-3xl font-bold' >{overallScore.toFixed(1)}</span>/10</h1>
              <h2 className='text-xs' >Overall Score</h2>
            </div>
          </div>
        </div>

        <div className='shadow-md p-2 rounded-lg' >
          <p className='text-customTextColor mb-3 font-bold' >Average Score</p>
          <p className="font-semibold mb-2" >Technical score : <span className="text-customTextColor mb-3 font-bold text-lg " >{averageScores.ansScore.toFixed(2)}</span>  </p>
          <p className="font-semibold" >Communication score : <span className="text-customTextColor mb-3 font-bold text-lg " >{averageScores.comScore.toFixed(2)}</span> </p>
        </div>

        {/* <div className="w-full p-2" >
          {attempts.length > 0 && <GeneralButton onClick={() => setReportView(!reportView)} className="text-white" ><FaDownload className="mr-2"  />Download report</GeneralButton>}
        </div> */}

        {reportView && 
        <div>
            <h1>PDF data will be shown here.</h1>
            <PDFViewer />
        </div>
        }
      </div>
    </div>
  );
};

export default ReportModal;
