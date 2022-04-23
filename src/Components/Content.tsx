import React from "react";
import Navbar from "./Navbar";

export default function Content(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-full w-4/5 bg-slate-200">
      <Navbar />
      {props.children}
    </div>
  );
}
