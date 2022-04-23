import React from "react";
import { Icon } from "@iconify/react";
import { ActiveLink } from "raviger";

export default function Sidebar() {
  return (
    <div className="h-screen w-1/5 border-r-2 bg-white">
      <div className="h-20 border-b-2 py-6">
        <h1 className="text-center text-xl font-bold text-slate-900">
          Kanban Tasks
        </h1>
      </div>
      <div className="flex flex-col py-6 px-2">
        {[
          { page: "Home", url: "/", icon: "mdi-light:home" },
          { page: "Boards", url: "/boards/", icon: "charm:apps" },
          { page: "Todo", url: "/todo", icon: "wpf:todo-list" },
        ].map((link) => (
          <ActiveLink
            href={link.url}
            key={link.url}
            className="group relative mb-2 w-full cursor-pointer rounded-xl border border-transparent py-3 text-sm font-medium hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2"
            exactActiveClass="text-blue-500"
          >
            <div className="flex space-x-4">
              <div />
              <Icon icon={link.icon} className="text-2xl" />
              <div className="flex items-center">{link.page}</div>
            </div>
          </ActiveLink>
        ))}
      </div>
    </div>
  );
}
