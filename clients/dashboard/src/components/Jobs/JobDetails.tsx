"use client";
import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { useDispatch, useSelector, RootState } from "@/src/Redux/store";
import QuestionModal from "../Modal/QuestionModal";
import toast from "react-hot-toast";
import { getQuestions, removeQuestion } from "@/src/Redux/actions/interviesAction";

type Props = {};

const JobDetails = (props: Props) => {
  const dispatch = useDispatch();
  const params = useParams<{ jobId: string }>();
  const { showQuestionModal, questions } = useSelector(
    (state: RootState) => state.interviewReducer
  );
  const onDelete = async(qId: string)=>{
    try{
      dispatch(removeQuestion(qId)).then((result) => {
        if (removeQuestion.fulfilled.match(result)) {
          const payload = result.payload;
          if (payload.success) {
            toast.success(payload.message);
          }
        } else if (removeQuestion.rejected.match(result)) {
          const err = result.payload as { response: { data: any } };
          // console.log("+++++++++++", err.response.data);
          toast.error(err.response.data.message);
        }
      });
    }catch(error: any){
      // console.log(error);
      // toast.error(error)
    }
  }

  useEffect(() => {
    dispatch(getQuestions(params.jobId))
  }, []);

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
                <TableCell>{ques.question}</TableCell>
                <TableCell>
                  <Trash2 className="text-danger cursor-pointer" onClick={()=> onDelete(ques._id)}/>
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
