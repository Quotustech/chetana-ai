import Breadcrumb from "@/src/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";

import { Metadata } from "next";
import ProfilePage from "@/src/components/profile/ProfilePage";
export const metadata: Metadata = {
  title: "Profile Page ",
  description: "This is Profile page for TechMateAdmin Next.js",
  // other metadata
};

const Profile = () => {
  return (
    <>
      <Breadcrumb pageName="profile" />

      <ProfilePage/>
    </>
  );
};

export default Profile;
