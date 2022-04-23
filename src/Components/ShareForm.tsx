import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useState } from "react";

export default function ShareForm(props: { formID: number }) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  return (
    <div className="flex">
      <CopyToClipboard
        text={
          process.env.REACT_APP_HOST_URL
            ? `${process.env.REACT_APP_HOST_URL}/forms/${props.formID}`
            : `localhost:3000/forms/${props.formID}`
        }
        onCopy={onCopy}
      >
        <button
          type="button"
          className="group relative my-2 flex justify-center rounded-lg border border-transparent bg-blue-500 py-2 px-4 text-sm font-extrabold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-300"
        >
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </CopyToClipboard>
    </div>
  );
}
