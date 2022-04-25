import React from "react";
import Content from "./Content";
import Sidebar from "./Sidebar";

export default function Home() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <Content>
        <div className="flex h-screen flex-col space-y-4 px-16 py-6">
          <div className="mb-8 flex flex-col gap-1">
            <p className="text-[16px] text-slate-900">Tuesday, March 1</p>
            <p className="text-[32px] text-slate-900">Good Evening Jerin</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded border-2 bg-white">
              <div className="mx-8 my-3 flex">
                <div className="flex flex-col">
                  <p className="mb-8 text-slate-900">Completed Tasks</p>
                  <p className="text-lg font-bold text-slate-900">0</p>
                  <p className="text-zinc-500">Task Count</p>
                </div>
              </div>
            </div>
            <div className="rounded border-2 bg-white">
              <div className="mx-8 my-3 flex">
                <div className="flex flex-col">
                  <p className="mb-8 text-slate-900">Incomplete Tasks</p>
                  <p className="text-lg font-bold text-slate-900">0</p>
                  <p className="text-zinc-500">Task Count</p>
                </div>
              </div>
            </div>
            <div className="rounded border-2 bg-white">
              <div className="mx-8 my-3 flex">
                <div className="flex flex-col">
                  <p className="mb-8 text-slate-900">Total Tasks</p>
                  <p className="text-lg font-bold text-slate-900">0</p>
                  <p className="text-zinc-500">Task Count</p>
                </div>
              </div>
            </div>
          </div>
          <h1 className="pt-10 text-2xl font-medium text-slate-900">
            My Tasks
          </h1>
          <div className="flex w-full gap-4 border-b-2">
            <button className="mb-[-2px] border-b-4 border-zinc-500 px-3 pt-2 font-bold text-zinc-500">
              Todo
            </button>
            <button className="px-3 pt-2 font-medium text-zinc-500">
              On Progress
            </button>
            <button className="px-3 pt-2 font-medium text-zinc-500">
              Done
            </button>
          </div>
          <div className="mb-2 flex max-h-56 flex-col gap-2 overflow-scroll pt-3">
            <div className="w-full rounded bg-stone-200">
              <p className="px-8 py-4 font-medium text-zinc-500">
                Updating Design System
              </p>
            </div>
            <div className="w-full rounded bg-stone-200">
              <p className="px-8 py-4 font-medium text-zinc-500">
                Updating Design System
              </p>
            </div>
            <div className="w-full rounded bg-stone-200">
              <p className="px-8 py-4 font-medium text-zinc-500">
                Updating Design System
              </p>
            </div>
            <div className="w-full rounded bg-stone-200">
              <p className="px-8 py-4 font-medium text-zinc-500">
                Updating Design System
              </p>
            </div>
            <div className="w-full rounded bg-stone-200">
              <p className="px-8 py-4 font-medium text-zinc-500">
                Updating Design System
              </p>
            </div>
            <div className="w-full rounded bg-stone-200">
              <p className="px-8 py-4 font-medium text-zinc-500">
                Updating Design System
              </p>
            </div>
            <div className="w-full rounded bg-stone-200">
              <p className="px-8 py-4 font-medium text-zinc-500">
                Updating Design System
              </p>
            </div>
          </div>
        </div>
      </Content>
    </div>
  );
}
