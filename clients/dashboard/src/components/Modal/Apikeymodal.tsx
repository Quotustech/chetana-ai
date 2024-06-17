import React, { useState ,useEffect} from "react";
import { Button, Input } from "@nextui-org/react";
import { Department } from "@/src/common/interfaces/department.interface";
import capitalizeFirstLetter from "@/src/utils/capitalizeFirstLetter";
import { useDispatch } from "@/src/Redux/store";
import toast from "react-hot-toast";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { approveDept, rejectDept } from "@/src/Redux/actions/superAdminAction";

interface ApikeymodalProps {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    setDeptData: React.Dispatch<React.SetStateAction<Department | {}>>;
    deptData: Department;
    showModal: Boolean;
  }

  const Apikeymodal: React.FC<ApikeymodalProps> = ({ setShowModal, deptData , setDeptData , showModal}) =>  {
    const initialState = {
      apiKey: '',
      chatGptModel: ''
    }
    const dispatch = useDispatch();
    const [inpData, setInpData] = useState(initialState);

    const {isOpen, onOpen, onOpenChange , onClose} = useDisclosure();
    useEffect(() => {
      if(showModal){
        onOpen();
      }
    }, [showModal])
    
    const onChangeHandler = (e: { target: { name: string; value: string; }; })=>{
      setInpData({...inpData , [e.target.name]: e.target.value})
    }

    const submitHandler = async(e: { preventDefault: () => void; })=>{
        e.preventDefault();
        try{
          if(inpData){
            dispatch(approveDept({...inpData , departmentId: deptData._id})).then((result) => {
              if (approveDept.fulfilled.match(result)) {
                const payload = result.payload;
                if (payload.success) {
                  setInpData(initialState);
                  setDeptData({});
                  onClose();
                  setShowModal(false)
                  toast.success(payload.message);
                }
              } else if (approveDept.rejected.match(result)) {
                const err = result.payload as { response: { data: any } };
                // console.log("+++++++++++", err.response.data);
                toast.error(err.response.data.message)
              }
            });
          }


        }catch(err){
          toast.error('error in approving department.');
        }
        
    }

    const handleReject = async(id:string)=>{
      dispatch(rejectDept(id)).then((result) => {
        if (rejectDept.fulfilled.match(result)) {
          const payload = result.payload;
          if (payload.success) {
            setInpData(initialState);
            setDeptData({});
            onClose();
            setShowModal(false)
            toast.success(payload.message);
          }
        } else if (rejectDept.rejected.match(result)) {
          const err = result.payload as { response: { data: any } };
          // console.log("+++++++++++", err.response.data);
          toast.error(err.response.data.message)
        }
      });
    }
 
  return (

    <>
      {/* <Button onPress={onOpen}>Open Modal</Button> */}
      <Modal isOpen={isOpen} onOpenChange={()=>{
        onOpenChange();
        setShowModal(false)
        }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{capitalizeFirstLetter(deptData.name)} department</ModalHeader>
              <ModalBody>
              <form className="w-full flex justify-between flex-col items-center h-[80%] gap-3" onSubmit={submitHandler}>
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                      <Input type="text"
                      name="apiKey" 
                      label="Api Key" placeholder="Enter API Key" isRequired value={inpData.apiKey} onChange={onChangeHandler}/>  
                  </div>
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                      <Input type="text"
                      name="chatGptModel"
                       label="Model" placeholder="Enter Model" isRequired value={inpData.chatGptModel} onChange={onChangeHandler}/>  
                  </div>
              </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={()=>{handleReject(deptData._id)}}>
                  Reject
                </Button>
                <Button color="primary" onClick={submitHandler}>
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
export default Apikeymodal;
