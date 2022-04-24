import React from "react";
import Content from "../Components/Content";
import Sidebar from "../Components/Sidebar";

export default function Loading() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <Content>
        <div className="flex h-screen items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-blue-500"></div>
        </div>
      </Content>
    </div>
  );
}
