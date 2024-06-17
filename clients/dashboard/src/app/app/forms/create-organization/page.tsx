import Breadcrumb from "@/src/components/Breadcrumbs/Breadcrumb";
import Checkrole from "@/src/components/Checkrole/Checkrole";
import CreateOrganizationForm from "@/src/components/Formcontroll/Createorganization";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create Organization Page",
  description: "This is Create Organization page for TechMateAdmin Next.js",
  // other metadata
};

const CreateOrganization = () => {
  return (
  <>
  <Breadcrumb pageName="forms/create-organization"/>
  <CreateOrganizationForm/>
  </>
  );
};

export default Checkrole(CreateOrganization , ['superadmin']);
