import React, { useEffect, useState } from "react";
import { textFieldTypes } from "../types/formTypes";

export default function LabelledInput(props: {
  id: number;
  label: string;
  value: string;
  fieldType: textFieldTypes;
  kind: string;
  updateFieldTypeCB: (id: number, type: textFieldTypes) => void;
  removeFieldCB: (id: number) => void;
  updateInputFieldLabelCB: (id: number, label: string) => void;
}) {
  const [label, setLabel] = useState(props.label);
  const [fieldType, setFieldType] = useState<textFieldTypes>(props.fieldType);

  useEffect(() => {
    if (label === props.label) return;

    let timeout = setTimeout(() => {
      props.updateInputFieldLabelCB(props.id, label);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [label]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (fieldType === props.fieldType) return;

    let timeout = setTimeout(() => {
      props.updateFieldTypeCB(props.id, fieldType);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [fieldType]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="flex items-center gap-2">
        <p className="my-2 flex transform rounded-lg border-2 border-gray-200 bg-gray-100 p-2">
          {props.kind}
        </p>
        <input
          type="text"
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
          }}
          className="focus:border-blueGray-500 focus:shadow-outline my-2 flex flex-1 transform rounded-lg border-2 border-gray-200 bg-gray-100 p-2 ring-offset-2 ring-offset-current transition duration-500 ease-in-out focus:bg-white focus:outline-none focus:ring-2"
        />
        <select
          className="focus:border-blueGray-500 focus:shadow-outline my-2 flex transform rounded-lg border-2 border-gray-200 bg-gray-100 p-2 ring-offset-2 ring-offset-current transition duration-500 ease-in-out focus:bg-white focus:outline-none focus:ring-2"
          onChange={(e) => {
            setFieldType(e.target.value as textFieldTypes);
          }}
          value={fieldType}
        >
          <option value="text">Text</option>
          <option value="email">Email</option>
          <option value="date">Date</option>
        </select>
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
