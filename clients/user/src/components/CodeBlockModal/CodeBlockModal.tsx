import React, { useEffect } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Button,
  } from "@nextui-org/react";
import { RootState, useSelector,useDispatch } from '@/redux/store';
import { setShowModal } from '@/redux/slices/chat/chatSlice';
import CodeBlock from '../CodeBlock/CodeBlock';

type Props = {

}

const CodeBlockModal = () => {
    const dispatch = useDispatch();
    const { showModal , modalContent } = useSelector((state: RootState) => state.chatReducer);
    const {isOpen, onOpen, onOpenChange , onClose} = useDisclosure();
    useEffect(() => {
      if(showModal){
        onOpen();
      }
    }, [showModal])
  return (
    <>
    <Modal isOpen={isOpen} onOpenChange={()=>{
      onOpenChange();
      dispatch(setShowModal(false))
      }}
      size="full"
      >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className='h-full max-h-svh flex items-center overflow-x-scroll'>
                <CodeBlock codeSnippet={modalContent.codeSnippet} language={modalContent.language} openInModal={true}/>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  </>
  )
}

export default CodeBlockModal