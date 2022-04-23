import React from "react";
import Content from "./Content";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <Content>
        <div className="flex min-h-full flex-col space-y-4 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="mx-2 h-28 cursor-pointer rounded-xl bg-white hover:bg-slate-100">
              <a href="/patient/{{ patient.id }}/">
                <div className="mx-8 my-3 flex">
                  <div className="flex flex-col">
                    <p>Incomplete Tasks</p>
                    <p className="text-gray-400">0</p>
                    <p className="text-gray-400">Task Count</p>
                  </div>
                </div>
              </a>
            </div>
            <div className="mx-2 h-28 cursor-pointer rounded-xl bg-white hover:bg-slate-100">
              <a href="/patient/{{ patient.id }}/">
                <div className="mx-8 my-3 flex">
                  <div className="flex flex-col">
                    <p>Completed Tasks</p>
                    <p className="text-gray-400">0</p>
                    <p className="text-gray-400">Task Count</p>
                  </div>
                </div>
              </a>
            </div>
            <div className="mx-2 h-28 cursor-pointer rounded-xl bg-white hover:bg-slate-100">
              <a href="/patient/{{ patient.id }}/">
                <div className="mx-8 my-3 flex">
                  <div className="flex flex-col">
                    <p>Total Tasks</p>
                    <p className="text-gray-400">0</p>
                    <p className="text-gray-400">Task Count</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <p>My Tasks</p>
        </div>
      </Content>
    </div>
  );
}
