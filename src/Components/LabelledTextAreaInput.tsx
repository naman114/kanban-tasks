import React, { useEffect, useState } from "react";

export default function LabelledTextAreaInput(props: {
  id: number;
  label: string;
  value: string;
  kind: string;
  removeFieldCB: (id: number) => void;
  updateInputFieldLabelCB: (id: number, label: string) => void;
}) {
  const [label, setLabel] = useState(props.label);

  useEffect(() => {
    if (label === props.label) return;

    let timeout = setTimeout(() => {
      props.updateInputFieldLabelCB(props.id, label);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [label]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="flex items-center gap-2">
        <p className="my-2 flex transform rounded-lg border-2 border-gray-200 bg-gray-100 p-2">
          {props.kind}
        </p>
        <input
          type="text"
          aria-label="Textarea Label"
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
          }}
          className="focus:border-blueGray-500 focus:shadow-outline my-2 flex flex-1 transform rounded-lg border-2 border-gray-200 bg-gray-100 p-2 ring-offset-2 ring-offset-current transition duration-500 ease-in-out focus:bg-white focus:outline-none focus:ring-2"
        />
        <button
          onClick={(_) => props.removeFieldCB(props.id)}
          className="group relative my-2 flex justify-center rounded-lg border border-transparent bg-blue-500 py-2 px-4 text-sm font-extrabold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Remove
        </button>
      </div>
    </>
  );
}
