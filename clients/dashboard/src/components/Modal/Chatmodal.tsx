import React, { useEffect } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { Chat } from "@/src/common/interfaces/chat.interface";
import { MessageCircleQuestion , MessageCircleMore } from "lucide-react";
import Response from "../Response/Response";

interface ApikeymodalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: Boolean;
  selectedChat: Chat;
}

const Apikeymodal: React.FC<ApikeymodalProps> = ({
  showModal,
  setShowModal,
  selectedChat,
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  useEffect(() => {
    if (showModal) {
      onOpen();
    }
  }, [showModal]);

  return (
    <>
      <Modal
        className="z-99999 outline-none dark:bg-[#24303F] "
        isOpen={isOpen}
        size={'3xl'} 
        onOpenChange={() => {
          onOpenChange();
          setShowModal(false);
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chat</ModalHeader>
              <ModalBody>
               
                  <Response data={selectedChat}/>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" >
                  Delete Chat
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default Apikeymodal;
