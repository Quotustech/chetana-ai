import Breadcrumb from "@/src/components/Breadcrumbs/Breadcrumb";
import CreateDepartmentForm from "@/src/components/Formcontroll/Createdepartment";
import { Metadata } from "next";
import Checkrole from "@/src/components/Checkrole/Checkrole";


export const metadata: Metadata = {
  title: "Create Department Page",
  description: "This is Create Department page for TechMateAdmin Next.js",
  // other metadata
};

const CreateDepartment = () => {
  return (
  <>
  <Breadcrumb pageName="forms/create-department"/>
  <CreateDepartmentForm/>
  </>
  );
};

export default Checkrole(CreateDepartment , ['admin'])
