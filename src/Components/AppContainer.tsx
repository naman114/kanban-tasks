// Parent Wrapper Component
import React from "react";
import Header from "./Header";

export default function AppContainer(props: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      {/* <div className="mx-auto w-full max-w-3xl rounded-xl bg-white p-4 shadow-lg">
        <Header
          title={"Welcome to Lesson 5 of $react-typescript with #tailwindcss"}
        /> */}
      {props.children}
      {/* </div> */}
    </div>
  );
}
