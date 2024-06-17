import Techmate from "@/src/components/Dashboard/Techmate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TechMate Dashboard",
  description: "This is dashboard page for TechMate admin ",
  // other metadata
};

export default function Home() {
  return (
    <>
      
      <Techmate />
    </>
  );
}
