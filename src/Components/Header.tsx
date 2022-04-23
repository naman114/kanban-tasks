import { ActiveLink } from "raviger";
import React, { useContext } from "react";
import logo from "../logo.svg";
import { userContext } from "../utils/formUtils";

export default function Header(props: { title: string }) {
  const currentUser = useContext(userContext);
  return (
    <div className="flex items-center gap-2">
      <img
        src={logo}
        className="h-16 w-16 animate-spin"
        alt="logo"
        style={{ animation: "spin 2s linear infinite" }}
      />
      <div className="flex items-center gap-2">
        {[
          { page: "Home", url: "/" },
          { page: "About", url: "/about" },
          ...(currentUser?.username.length > 0
            ? [
                {
                  page: "Logout",
                  onClick: () => {
                    localStorage.removeItem("token");
                    window.location.reload();
                  },
                },
              ]
            : [{ page: "Login", url: "/login" }]),
        ].map((link) =>
          link.url ? (
            <ActiveLink
              href={link.url}
              key={link.url}
              className="m-2 p-2 uppercase text-gray-800"
              exactActiveClass="text-blue-500"
            >
              {link.page}
            </ActiveLink>
          ) : (
            <button
              onClick={link.onClick}
              key={link.page}
              className="m-2 p-2 uppercase text-gray-800"
            >
              {link.page}
            </button>
          )
        )}
      </div>
    </div>
  );
}
