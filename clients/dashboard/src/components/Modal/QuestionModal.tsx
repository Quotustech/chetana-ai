// import React, { useState ,useEffect} from "react";
// import { Button, Input } from "@nextui-org/react";
// import {
//     Modal,
//     ModalContent,
//     ModalHeader,
//     ModalBody,
//     ModalFooter,
//     useDisclosure,
//   } from "@nextui-org/react";
//   import { useDispatch , useSelector , RootState } from "@/src/Redux/store";
// import {setShowQuestionModal } from "@/src/Redux/slices/interviewSlice";
// import { useParams } from "next/navigation";
// import toast from "react-hot-toast";
// import { createQuestion } from "@/src/Redux/actions/interviesAction";

// type Props = {}

// const QuestionModal = (props: Props) => {
//   const dispatch = useDispatch();
//   const params = useParams<{ jobId: string }>();
//   const { showQuestionModal } = useSelector((state: RootState) => state.interviewReducer);
//     const {isOpen, onOpen, onOpenChange , onClose} = useDisclosure();
//     const initialState = {
//       question: ''
//     }
//     const [inpData, setInpData] = useState(initialState);
//     useEffect(() => {
//       if(showQuestionModal){
//         onOpen();
//       }
//     }, [showQuestionModal])

//     const onChangeHandler = (e: { target: { name: string; value: string; }; })=>{
//       setInpData({...inpData , [e.target.name]: e.target.value})
//     }

//     const onSubmit = async(e: { preventDefault: () => void; })=>{
//       e.preventDefault();
//       if(!inpData.question){
//         return toast.error('Question required');
//       }
//       try{
//         dispatch(createQuestion({question: inpData.question , jobRoleId: params.jobId})).then((result) => {
//           if (createQuestion.fulfilled.match(result)) {
//             const payload = result.payload;
//             if (payload.success) {
//               toast.success(payload.message);
//             }
//           } else if (createQuestion.rejected.match(result)) {
//             const err = result.payload as { response: { data: any } };
//             // console.log("+++++++++++", err.response.data);
//             toast.error(err.response.data.message);
//           }
//         });

//        }catch(error:any){
//         // console.log(error);
//         // toast.error(error)
//        }
//     }
//   return (
//     <>
//       <Modal isOpen={isOpen} onOpenChange={()=>{
//         onOpenChange();
//         dispatch(setShowQuestionModal(false))
//         }}>
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalHeader className="flex flex-col gap-1">Add Question</ModalHeader>
//               <ModalBody>
//               <form className="w-full flex justify-between flex-col items-center h-[80%] gap-3" onSubmit={onSubmit}>
//                   <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
//                       <Input type="text"
//                       name="question" 
//                       label="Question" placeholder="Enter Question" isRequired value={inpData.question} onChange={onChangeHandler}/>  
//                   </div>
//               </form>
//               </ModalBody>
//               <ModalFooter>
//                 <Button color="primary" onClick={onSubmit}>
//                 Approve
//                 </Button>
//               </ModalFooter>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//     </>
//   )
// }

// export default QuestionModal

// import React, { useState, useEffect } from "react";
// import { Button, Input } from "@nextui-org/react";
// import {
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   useDisclosure,
// } from "@nextui-org/react";
// import { useDispatch, useSelector } from "@/src/Redux/store";
// import { setShowQuestionModal } from "@/src/Redux/slices/interviewSlice";
// import { useParams } from "next/navigation";
// import toast from "react-hot-toast";
// import { createQuestion } from "@/src/Redux/actions/interviesAction";
// import * as XLSX from "xlsx";
// import { RootState } from "@/src/Redux/store";

// type Props = {};

// const QuestionModal = (props: Props) => {
//   const dispatch = useDispatch();
//   const params = useParams<{ jobId: string }>();
//   const { showQuestionModal } = useSelector(
//     (state: RootState) => state.interviewReducer
//   );
//   const { isOpen, onOpen, onOpenChange } = useDisclosure();
//   const initialState = {
//     question: "",
//   };
//   const [inpData, setInpData] = useState(initialState);
//   const [questionsFromExcel, setQuestionsFromExcel] = useState<string[]>([]);

//   useEffect(() => {
//     if (showQuestionModal) {
//       onOpen();
//     }
//   }, [showQuestionModal]);

//   const onChangeHandler = (e: { target: { name: string; value: string } }) => {
//     setInpData({ ...inpData, [e.target.name]: e.target.value });
//   };

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const data = new Uint8Array(e.target?.result as ArrayBuffer);
//         processExcelFile(data);
//       };
//       reader.readAsArrayBuffer(file);
//     }
//   };

//   const processExcelFile = (data: Uint8Array) => {
//     const workbook = XLSX.read(data, { type: "array" });
//     const firstSheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[firstSheetName];
//     const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//     const extractedQuestions = jsonData
//       .map((row: any) => row[0])
//       .filter((cell: any) => cell);

//     setQuestionsFromExcel(extractedQuestions);
//   };

//   const onSubmit = async (e: { preventDefault: () => void }) => {
//     e.preventDefault();
//     if (!inpData.question) {
//       return toast.error("Question required");
//     }

//     try {
//       dispatch(createQuestion({ question: inpData.question, jobRoleId: params.jobId })).then(
//         (result) => {
//           if (createQuestion.fulfilled.match(result)) {
//             const payload = result.payload;
//             if (payload.success) {
//               toast.success(payload.message);
//             }
//           } else if (createQuestion.rejected.match(result)) {
//             const err = result.payload as { response: { data: any } };
//             toast.error(err.response.data.message);
//           }
//         }
//       );
//     } catch (error: any) {
//       // Handle error
//     }
//   };

//   return (
//     <>
//       <Modal
//         isOpen={isOpen}
//         onOpenChange={() => {
//           onOpenChange();
//           dispatch(setShowQuestionModal(false));
//         }}
//       >
//         <ModalContent>
//           {() => (
//             <>
//               <ModalHeader className="flex flex-col gap-1">Add Question</ModalHeader>
//               <ModalBody>
//                 <form
//                   className="w-full flex justify-between flex-col items-center h-[80%] gap-3"
//                   onSubmit={onSubmit}
//                 >
//                   <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
//                     <Input
//                       type="text"
//                       name="question"
//                       label="Question"
//                       placeholder="Enter Question"
//                       isRequired
//                       value={inpData.question}
//                       onChange={onChangeHandler}
//                     />
//                     <input
//                       type="file"
//                       accept=".xlsx, .xls"
//                       onChange={handleFileUpload}
//                     />
//                   </div>
//                 </form>
//                 <div>
//                   {questionsFromExcel.map((question, index) => (
//                     <div key={index}>{question}</div>
//                   ))}
//                 </div>
//               </ModalBody>
//               <ModalFooter>
//                 <Button color="primary" onClick={onSubmit}>
//                   Approve
//                 </Button>
//               </ModalFooter>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default QuestionModal;


import React, { useState, useEffect } from "react";
import { Button, Input } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useDispatch, useSelector } from "@/src/Redux/store";
import { setShowQuestionModal } from "@/src/Redux/slices/interviewSlice";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { createQuestion } from "@/src/Redux/actions/interviesAction";
import * as XLSX from "xlsx";
import { RootState } from "@/src/Redux/store";

type Props = {};

const QuestionModal = (props: Props) => {
  const dispatch = useDispatch();
  const params = useParams<{ jobId: string }>();
  const { showQuestionModal } = useSelector(
    (state: RootState) => state.interviewReducer
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const initialState = {
    question: "",
  };
  const [inpData, setInpData] = useState(initialState);
  const [questionsFromExcel, setQuestionsFromExcel] = useState<string[]>([]);

  useEffect(() => {
    if (showQuestionModal) {
      onOpen();
    }
  }, [showQuestionModal]);

  const onChangeHandler = (e: { target: { name: string; value: string } }) => {
    setInpData({ ...inpData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        processExcelFile(data);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const processExcelFile = (data: Uint8Array) => {
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const extractedQuestions = jsonData
      .map((row: any) => row[0])
      .filter((cell: any) => cell);

    setQuestionsFromExcel(extractedQuestions);
  };

  // const onSubmit = async (e: { preventDefault: () => void }) => {
  //   e.preventDefault();
  //   if (!inpData.question) {
  //     return toast.error("Question required");
  //   }

  //   try {
  //     dispatch(createQuestion({ question: inpData.question, jobRoleId: params.jobId })).then(
  //       (result) => {
  //         if (createQuestion.fulfilled.match(result)) {
  //           const payload = result.payload;
  //           if (payload.success) {
  //             toast.success(payload.message);
  //           }
  //         } else if (createQuestion.rejected.match(result)) {
  //           const err = result.payload as { response: { data: any } };
  //           toast.error(err.response.data.message);
  //         }
  //       }
  //     );
  //   } catch (error: any) {
  //     // Handle error
  //   }
  // };
  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
  
    if (!inpData.question && questionsFromExcel.length === 0) {
      return toast.error("Question required");
    }
  
    const submitQuestion = async (question: string) => {
      try {
        const result = await dispatch(createQuestion({ question, jobRoleId: params.jobId }));
        if (createQuestion.fulfilled.match(result)) {
          const payload = result.payload;
          if (payload.success) {
            toast.success(payload.message);
          }
        } else if (createQuestion.rejected.match(result)) {
          const err = result.payload as { response: { data: any } };
          toast.error(err.response.data.message);
        }
      } catch (error: any) {
        toast.error("An error occurred");
      }
    };
  
    if (inpData.question) {
      await submitQuestion(inpData.question);
    }
  
    for (const question of questionsFromExcel) {
      await submitQuestion(question);
    }
  
    // Reset input data after submission
    setInpData(initialState);
    setQuestionsFromExcel([]);
    dispatch(setShowQuestionModal(false));
  };
  

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          onOpenChange();
          dispatch(setShowQuestionModal(false));
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add Question</ModalHeader>
              <ModalBody>
                <form
                  className="w-full flex justify-between flex-col items-center h-[80%] gap-3"
                  onSubmit={onSubmit}
                >
                  <div className="w-full">
                    <Input
                      type="text"
                      name="question"
                      label="Question"
                      placeholder="Enter Question"
                      isRequired
                      value={inpData.question}
                      onChange={onChangeHandler}
                      fullWidth
                    />
                  </div>
                  <div className="w-full text-center mt-4 mb-4">or</div>
                  <div className="w-full">
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={handleFileUpload}
                      className="file-input"
                    />
                  </div>
                  <Button color="primary" onClick={onSubmit} className="mt-4">
                    Approve
                  </Button>
                </form>
                <div className="w-full mt-4">
                  {questionsFromExcel.length > 0 && (
                    <div>
                      <h4>Extracted Questions:</h4>
                      {questionsFromExcel.map((question, index) => (
                        <div key={index}>{question}</div>
                      ))}
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default QuestionModal;
