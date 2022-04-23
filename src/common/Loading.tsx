import React from "react";

export default function Loading() {
  return (
    <div className="flex h-24 items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
    </div>
  );
}
