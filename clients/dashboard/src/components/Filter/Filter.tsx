import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {CheckboxGroup, Checkbox} from "@nextui-org/react";
import { Filter } from "lucide-react";
import {useSelector } from "react-redux";
import { RootState } from "@/src/Redux/store";
import { getOrgs , getDepts, getSearch } from "@/src/Redux/slices/filterSlice";
import { useDispatch } from "@/src/Redux/store";

export default function FilterComponent() {
    const dispatch = useDispatch();
    const {user } = useSelector(
        (state: RootState) => state.authReducer
      );
      const { allDepartments} = useSelector(
        (state: RootState) => state.organizationReducer
      );
      const { orgs , depts} = useSelector(
        (state: RootState) => state.filterReducer
      );
      const { organizations , approvedDepts } = useSelector(
        (state: RootState) => state.superAdminReducer
      );

    const uniqueDepts = new Set(approvedDepts.map((dept: { name: string; }) => dept.name));
    const uniqueApprovedDeptsArray = [...uniqueDepts]
    const uniqueAllDepts = new Set(allDepartments.map((dept: { name: string; }) => dept.name));
    const uniqueAllDeptsArray = [...uniqueAllDepts]

    const [selectedOrgs, setSelectedOrgs] = React.useState(orgs as string[]);
    const [selectedDepts, setSelectedDepts] = React.useState(depts as string[]);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    useEffect(() => {
      return () => {
        // console.log('filter unmounted')
        dispatch(getOrgs([]));
        dispatch(getDepts([]));
        dispatch(getSearch(""));
      }
    }, [])
    
    

    const setFilterQuery = ()=>{
        dispatch(getOrgs(selectedOrgs));
        dispatch(getDepts(selectedDepts));
        // console.log('selected orgs' , selectedOrgs);
        // console.log('selected depts' , selectedDepts);
    }

    

  return (
    <>
      <Button onPress={onOpen} className=""> <Filter/> {window.innerWidth > 768 && "Filters"}</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Filters</ModalHeader>
              <ModalBody>
               <div className="flex gap-2 justify-between">
                {user.role === 'superadmin' &&
                <div className="w-1/2 overflow-hidden max-h-[13rem] h-[13rem] overflow-y-scroll">
                <CheckboxGroup
                    label="Select Orgs"
                    value={selectedOrgs}
                    onValueChange={setSelectedOrgs}
                >
                    {organizations.map((el , index)=>{
                        return <Checkbox value={el.name} key={index}>{el.name}</Checkbox>
                    })}
                </CheckboxGroup>

                </div>}
                <div className="w-1/2 overflow-hidden max-h-[13rem] h-[13rem] overflow-y-scroll">
                <CheckboxGroup
                    label="Select Depts"
                    value={selectedDepts}
                    onValueChange={setSelectedDepts}
                >
                     {(user.role === 'superadmin' ? uniqueApprovedDeptsArray  : uniqueAllDeptsArray).map((el , index)=>{
                        return <Checkbox value={el} key={index}>{el}</Checkbox>
                    })}
                </CheckboxGroup>

                </div>
               </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose} onClick={setFilterQuery}>
                  Apply
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
