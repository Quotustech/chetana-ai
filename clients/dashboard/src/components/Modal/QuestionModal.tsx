import React, { useState ,useEffect} from "react";
import { Button, Input } from "@nextui-org/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
  } from "@nextui-org/react";
  import { useDispatch , useSelector , RootState } from "@/src/Redux/store";
import {setShowQuestionModal } from "@/src/Redux/slices/interviewSlice";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { createQuestion } from "@/src/Redux/actions/interviesAction";

type Props = {}

const QuestionModal = (props: Props) => {
  const dispatch = useDispatch();
  const params = useParams<{ jobId: string }>();
  const { showQuestionModal } = useSelector((state: RootState) => state.interviewReducer);
    const {isOpen, onOpen, onOpenChange , onClose} = useDisclosure();
    const initialState = {
      question: ''
    }
    const [inpData, setInpData] = useState(initialState);
    useEffect(() => {
      if(showQuestionModal){
        onOpen();
      }
    }, [showQuestionModal])

    const onChangeHandler = (e: { target: { name: string; value: string; }; })=>{
      setInpData({...inpData , [e.target.name]: e.target.value})
    }

    const onSubmit = async(e: { preventDefault: () => void; })=>{
      e.preventDefault();
      if(!inpData.question){
        return toast.error('Question required');
      }
      try{
        dispatch(createQuestion({question: inpData.question , jobRoleId: params.jobId})).then((result) => {
          if (createQuestion.fulfilled.match(result)) {
            const payload = result.payload;
            if (payload.success) {
              toast.success(payload.message);
            }
          } else if (createQuestion.rejected.match(result)) {
            const err = result.payload as { response: { data: any } };
            // console.log("+++++++++++", err.response.data);
            toast.error(err.response.data.message);
          }
        });

       }catch(error:any){
        // console.log(error);
        // toast.error(error)
       }
    }
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={()=>{
        onOpenChange();
        dispatch(setShowQuestionModal(false))
        }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add Job</ModalHeader>
              <ModalBody>
              <form className="w-full flex justify-between flex-col items-center h-[80%] gap-3" onSubmit={onSubmit}>
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                      <Input type="text"
                      name="question" 
                      label="Question" placeholder="Enter Question" isRequired value={inpData.question} onChange={onChangeHandler}/>  
                  </div>
              </form>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={onSubmit}>
                Approve
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default QuestionModal