"use client";
import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

interface RichTextEditorProps {
  placeholder: string;
  value?: string;
  onChange: (value: string) => void;
}

const RichTextEditor = ({ placeholder, value, onChange }: RichTextEditorProps) => {
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start typing...",
    }),
    [placeholder]
  );

  return (
    <JoditEditor
      ref={editor}
      value={value || ""}
      config={config}
      tabIndex={1}
      onBlur={(newContent) => onChange(newContent)}
      onChange={(newContent) => onChange(newContent)}
    />
  );
};

export default RichTextEditor;
