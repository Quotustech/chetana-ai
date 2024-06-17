import { Loader2 } from "lucide-react";
import React from "react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center mt-10">
      <Loader2 className="w-8 h-8 animate-spin" />
      <span className=" text-lg ml-2">Loading...</span>
    </div>
  );
}
