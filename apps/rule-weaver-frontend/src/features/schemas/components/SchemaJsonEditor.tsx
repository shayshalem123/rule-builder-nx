import React from "react";

interface SchemaJsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export const SchemaJsonEditor: React.FC<SchemaJsonEditorProps> = ({
  value,
  onChange,
  height = "200px",
}) => {
  return (
    <div className="relative border rounded-md overflow-hidden">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono text-sm p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ height, resize: "vertical" }}
        spellCheck="false"
      />
    </div>
  );
};
