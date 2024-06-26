// import React, { useEffect, useState } from 'react';
// import { IUserAttempts } from '../TechInterview';
// import { ImCross } from 'react-icons/im';
// import { FaRegCircleQuestion } from "react-icons/fa6";
// import PDFViewer from './Pdfviewer';

// interface IReportModal {
//   toggleModal: () => void;
//   modal: boolean;
//   userAttemptsTrack: IUserAttempts;
// }

// const ReportModal: React.FC<IReportModal> = ({ modal, toggleModal, userAttemptsTrack }) => {
//   const { totalQsns, attempts, role } = userAttemptsTrack;
//   const [averageScores, setAverageScores] = useState<{ ansScore: number; comScore: number }>({
//     ansScore: 0,
//     comScore: 0
//   });
//   const [overallScore, setOverallScore] = useState<number>(0);
//   const [reportView, setReportView] = useState<boolean>(false); // for showing / downloading PDF

//   useEffect(() => {
//     const calculateScore = () => {
//       const totalAttempts = attempts.length;
//       const comScore = attempts.reduce((acc, attempt) => acc + attempt.communicationScore, 0);
//       const ansScore = attempts.reduce((acc, attempt) => acc + attempt.answerScore, 0);
      
//       const avgComScore = totalAttempts > 0 ? comScore / totalAttempts : 0;
//       const avgAnsScore = totalAttempts > 0 ? ansScore / totalAttempts : 0;
      
//       setAverageScores({ ansScore: avgAnsScore, comScore: avgComScore });
//       setOverallScore((avgAnsScore + avgComScore) / 2);
//     };
    
//     calculateScore();
//   }, [attempts]);

//   return (
//     <div className={`fixed w-full h-screen transition ease-in-out duration-500 bg-black/60 top-0 ${modal ? "left-0" : " -left-[110%]"} z-10 flex justify-center items-center text-black`} >

//       <div className="w-[90%] max-w-[1280px] h-[90%] bg-[#f9f9f9] text-black dark:bg-gray-600 dark:text-white rounded-lg relative overflow-scroll pl-[3%] pr-[3%]">
//         <ImCross className="absolute top-3 right-3 md:top-5 md:right-5 cursor-pointer text-lg " onClick={toggleModal} />

//         <div className="mt-7 pl-2 pr-2 shadow-md mb-4" >
//           <div className='m-auto  flex justify-between pb-5' >
//             <div className='' >
//               <h1 className="pb-2 mb-1" >Interview Report</h1>
//               <h1 className="text-xl md:text-2xl font-bold" >{role}</h1>
//               <div className='mt-2' >
//                 <p className="flex items-center" ><FaRegCircleQuestion className='mr-1 text-customTextColor' />{attempts.length}/{totalQsns}</p>
//               </div>
//             </div>
//             <div className='bg-gray-300/25 flex flex-col justify-center items-center rounded-lg w-24 h-24 lg:w-32 lg:h-32 mt-5 md:mr-[10%] p-2' >
//               <h1><span className='text-customTextColor text-2xl lg:text-3xl font-bold' >{overallScore.toFixed(1)}</span>/10</h1>
//               <h2 className='text-xs' >Overall Score</h2>
//             </div>
//           </div>
//         </div>

//         <div className='shadow-md p-2 rounded-lg' >
//           <p className='text-customTextColor mb-3 font-bold' >Average Score</p>
//           <p className="font-semibold mb-2" >Technical score : <span className="text-customTextColor mb-3 font-bold text-lg " >{averageScores.ansScore.toFixed(2)}</span>  </p>
//           <p className="font-semibold" >Communication score : <span className="text-customTextColor mb-3 font-bold text-lg " >{averageScores.comScore.toFixed(2)}</span> </p>
//         </div>

//         {/* <div className="w-full p-2" >
//           {attempts.length > 0 && <GeneralButton onClick={() => setReportView(!reportView)} className="text-white" ><FaDownload className="mr-2"  />Download report</GeneralButton>}
//         </div> */}

//         {reportView && 
//         <div>
//             <h1>PDF data will be shown here.</h1>
//             <PDFViewer />
//         </div>
//         }
//       </div>
//     </div>
//   );
// };

// export default ReportModal;


// new code 
//download icon not in pdf code 
import React, { useEffect, useState, useRef } from 'react';
import { IUserAttempts } from '../TechInterview';
import { ImCross } from 'react-icons/im';
import { FaRegCircleQuestion, FaDownload } from "react-icons/fa6";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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

  const reportCardRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadPDF = () => {
    const reportCard = reportCardRef.current;
    const downloadButton = document.querySelector('.download-button') as HTMLElement;

    if (reportCard && downloadButton) {
      // Hide the download button
      downloadButton.style.display = 'none';

      html2canvas(reportCard, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('report.pdf');

        // Show the download button again
        downloadButton.style.display = 'flex';
      });
    } else {
      console.error('reportCard ref is null');
    }
  };

  return (
    <div className={`fixed w-full h-screen transition ease-in-out duration-500 bg-black/60 top-0 ${modal ? "left-0" : " -left-[110%]"} z-10 flex justify-center items-center text-black`}>
      <div ref={reportCardRef} className="w-[90%] max-w-[1280px] h-[90%] bg-[#f9f9f9] text-black dark:bg-gray-600 dark:text-white rounded-lg relative overflow-scroll p-6">
        <ImCross className="absolute top-3 right-3 md:top-5 md:right-5 cursor-pointer text-lg" onClick={toggleModal} />

        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold">Interview Report</h1>
              <h2 className="text-xl text-gray-600 dark:text-gray-300">{role}</h2>
            </div>
            <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg text-center">
              <h3 className="text-4xl font-bold text-customTextColor">{overallScore.toFixed(1)}</h3>
              <p className="text-sm">Overall Score</p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold text-customTextColor">Details</h3>
            <p className="flex items-center mt-2"><FaRegCircleQuestion className="mr-2 text-customTextColor" />{attempts.length}/{totalQsns} Questions Attempted</p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-bold text-customTextColor mb-2">Average Scores</h3>
            <p className="mb-2">Technical Score: <span className="text-customTextColor font-bold text-xl">{averageScores.ansScore.toFixed(2)}</span></p>
            <p>Communication Score: <span className="text-customTextColor font-bold text-xl">{averageScores.comScore.toFixed(2)}</span></p>
          </div>

          <div className="w-full p-2 flex justify-end">
            {attempts.length > 0 && (
              <button onClick={handleDownloadPDF} className="text-white bg-blue-500 p-2 rounded flex items-center download-button">
                <FaDownload className="mr-2" />
                Download report
              </button>
            )}
          </div>
        </div>

        {reportView && (
          <div>
            <h1>PDF data will be shown here.</h1>
            <PDFViewer />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportModal;




