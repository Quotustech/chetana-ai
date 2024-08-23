// "use client";
// import React, { useEffect } from "react";
// import {
//   Table,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
// } from "@nextui-org/react";
// import { Trash2 } from "lucide-react";
// import { useParams } from "next/navigation";
// import Breadcrumb from "../Breadcrumbs/Breadcrumb";
// import { useDispatch, useSelector, RootState } from "@/src/Redux/store";
// import QuestionModal from "../Modal/QuestionModal";
// import toast from "react-hot-toast";
// import { getQuestions, removeQuestion } from "@/src/Redux/actions/interviesAction";

// type Props = {};

// const JobDetails = (props: Props) => {
//   const dispatch = useDispatch();
//   const params = useParams<{ jobId: string }>();
//   const { showQuestionModal, questions } = useSelector(
//     (state: RootState) => state.interviewReducer
//   );
//   const onDelete = async(qId: string)=>{
//     try{
//       dispatch(removeQuestion(qId)).then((result) => {
//         if (removeQuestion.fulfilled.match(result)) {
//           const payload = result.payload;
//           if (payload.success) {
//             toast.success(payload.message);
//           }
//         } else if (removeQuestion.rejected.match(result)) {
//           const err = result.payload as { response: { data: any } };
//           // console.log("+++++++++++", err.response.data);
//           toast.error(err.response.data.message);
//         }
//       });
//     }catch(error: any){
//       // console.log(error);
//       // toast.error(error)
//     }
//   }

//   useEffect(() => {
//     dispatch(getQuestions(params.jobId))
//   }, []);

//   return (
//     <>
//       {showQuestionModal && <QuestionModal />}
//       <div className="w-full">
//         <Breadcrumb pageName={`dashboard/interview/jobs/${params.jobId}`} />
//       </div>
//       <Table
//         aria-label="Example static collection table"
//         className="max-w-[50vw] mt-2"
//       >
//         <TableHeader>
//           <TableColumn>Sl No</TableColumn>
//           <TableColumn>Question</TableColumn>
//           <TableColumn>Action</TableColumn>
//         </TableHeader>
//         {questions.length > 0 ? (
//           <TableBody>
//             {questions.map((ques, index) => (
//               <TableRow key={index}>
//                 <TableCell>{index + 1}</TableCell>
//                 <TableCell>{ques.question}</TableCell>
//                 <TableCell>
//                   <Trash2 className="text-danger cursor-pointer" onClick={()=> onDelete(ques._id)}/>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         ) : (
//           <TableBody emptyContent={"No Data to display."}>{[]}</TableBody>
//         )}
//       </Table>
//     </>
//   );
// };

// export default JobDetails;

"use client"
import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button
} from "@nextui-org/react";
import { Trash2, Edit } from "lucide-react";
import { useParams } from "next/navigation";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { useDispatch, useSelector, RootState } from "@/src/Redux/store";
import QuestionModal from "../Modal/QuestionModal";
import toast from "react-hot-toast";
import { getQuestions, removeQuestion, updateQuestion } from "@/src/Redux/actions/interviesAction";

const JobDetails = () => {
  const dispatch = useDispatch();
  const params = useParams<{ jobId: string }>();
  const { showQuestionModal, questions } = useSelector(
    (state: RootState) => state.interviewReducer
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<string>("");

  useEffect(() => {
    dispatch(getQuestions(params.jobId));
  }, [dispatch, params.jobId]);

  const onDelete = async (qId: string) => {
    try {
      dispatch(removeQuestion(qId)).then((result) => {
        if (removeQuestion.fulfilled.match(result)) {
          const payload = result.payload;
          if (payload.success) {
            toast.success(payload.message);
          }
        } else if (removeQuestion.rejected.match(result)) {
          const err = result.payload as { response: { data: any } };
          toast.error(err.response.data.message);
        }
      });
    } catch (error: any) {
      toast.error("An error occurred");
    }
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setEditedQuestion(questions[index].question);
  };

  const handleSaveEdit = async (qId: string) => {
    try {
      const result = await dispatch(updateQuestion({ qId: qId, questionText: editedQuestion }));
      if (updateQuestion.fulfilled.match(result)) {
        toast.success("Question updated successfully");
      } else if (updateQuestion.rejected.match(result)) {
        const err = result.payload as { response: { data: any } };
        toast.error(err.response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred");
    }
    setEditingIndex(null);
    setEditedQuestion("");
  };

  return (
    <>
      {showQuestionModal && <QuestionModal />}
      <div className="w-full">
        <Breadcrumb pageName={`dashboard/interview/jobs/${params.jobId}`} />
      </div>
      <Table
        aria-label="Example static collection table"
        className="max-w-[50vw] mt-2"
      >
        <TableHeader>
          <TableColumn>Sl No</TableColumn>
          <TableColumn>Question</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        {questions.length > 0 ? (
          <TableBody>
            {questions.map((ques, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={editedQuestion}
                      onChange={(e) => setEditedQuestion(e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    ques.question
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {editingIndex === index ? (
                      <Button size="sm" onClick={() => handleSaveEdit(ques._id)}>
                        Save
                      </Button>
                    ) : (
                      <Edit
                        className="cursor-pointer"
                        onClick={() => handleEditClick(index)}
                      />
                    )}
                    <Trash2
                      className="text-danger cursor-pointer"
                      onClick={() => onDelete(ques._id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody emptyContent={"No Data to display."}>{[]}</TableBody>
        )}
      </Table>
    </>
  );
};

export default JobDetails;
