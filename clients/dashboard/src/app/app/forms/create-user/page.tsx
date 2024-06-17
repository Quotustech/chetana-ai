import Breadcrumb from "@/src/components/Breadcrumbs/Breadcrumb";
import Checkrole from "@/src/components/Checkrole/Checkrole";
import CreateUserForm from "@/src/components/Formcontroll/Createuser";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create User Page ",
  description: "This is Create User page for TechMateAdmin Next.js",
  // other metadata
};

const CreateOrganization = () => {
  return (
  <>
  <Breadcrumb pageName="forms/create-user"/>
  <CreateUserForm/>
  </>
  );
};

export default Checkrole(CreateOrganization , ['superadmin']);
