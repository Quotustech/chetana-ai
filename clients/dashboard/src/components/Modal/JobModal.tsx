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
import {setShowJobModal } from "@/src/Redux/slices/interviewSlice";
import toast from "react-hot-toast";
import { createJob } from "@/src/Redux/actions/interviesAction";

type Props = {}

const JobModal = (props: Props) => {
  const dispatch = useDispatch();
  const { showJobModal } = useSelector((state: RootState) => state.interviewReducer);
    const {isOpen, onOpen, onOpenChange , onClose} = useDisclosure();
    const initialState = {
      jobName: '',
      description: ''
    }
    const [inpData, setInpData] = useState(initialState);
    useEffect(() => {
      if(showJobModal){
        onOpen();
      }
    }, [showJobModal])

    const onChangeHandler = (e: { target: { name: string; value: string; }; })=>{
      setInpData({...inpData , [e.target.name]: e.target.value})
    }

    const onSubmit = async(e: { preventDefault: () => void; })=>{
      e.preventDefault();
      if(!inpData.jobName){
        return toast.error('Job Name required');
      }
     try{
      dispatch(createJob(inpData)).then((result) => {
        if (createJob.fulfilled.match(result)) {
          const payload = result.payload;
          if (payload.success) {
            toast.success(payload.message);
          }
        } else if (createJob.rejected.match(result)) {
          const err = result.payload as { response: { data: any } };
          // console.log("+++++++++++", err.response.data);
          toast.error(err.response.data.message);
        }
      });

     }catch(error:any){
      // console.log(error);
     }
    }

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={()=>{
        onOpenChange();
        dispatch(setShowJobModal(false))
        }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add Job</ModalHeader>
              <ModalBody>
              <form className="w-full flex justify-between flex-col items-center h-[80%] gap-3" onSubmit={onSubmit}>
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                      <Input type="text"
                      name="jobName" 
                      label="Job Name" placeholder="Enter Job Name" isRequired value={inpData.jobName} onChange={onChangeHandler}/>  
                  </div>
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                      <Input type="text"
                      name="description"
                       label="Description" placeholder="Enter Description" isRequired value={inpData.description} onChange={onChangeHandler}/>  
                  </div>
              </form>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={onSubmit}>
                Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default JobModal