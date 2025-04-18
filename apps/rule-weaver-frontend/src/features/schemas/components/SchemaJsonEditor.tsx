import React, { useState, useRef } from "react";
import { Copy, FileJson } from "lucide-react";

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
  const [copySuccess, setCopySuccess] = useState(false);
  const [isFormatted, setIsFormatted] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check if current JSON is properly formatted
  const checkFormatting = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      const formatted = JSON.stringify(parsed, null, 2);
      return formatted === text;
    } catch {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    onChange(text);

    // Update formatting state
    setIsFormatted(checkFormatting(text));
  };

  const handleCopy = () => {
    if (!textareaRef.current) return;

    navigator.clipboard
      .writeText(textareaRef.current.value)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 1000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);

      onChange(formatted);
      setIsFormatted(true);
    } catch (err) {
      // If we can't parse, just leave it as is
      console.error("Failed to format JSON: ", err);
    }
  };

  return (
    <div className="relative border rounded-md overflow-hidden">
      <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
        <button
          type="button"
          onClick={handleFormat}
          disabled={isFormatted}
          className={`flex items-center justify-center px-2.5 py-1.5 text-xs font-medium rounded-md transition-all duration-200 shadow-sm
          ${
            isFormatted
              ? "bg-gray-100 text-gray-400 opacity-70"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200 cursor-pointer"
          }`}
          title={isFormatted ? "JSON is already formatted" : "Format JSON"}
        >
          <FileJson className="h-3.5 w-3.5 mr-1" />
          Format
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center justify-center px-2.5 py-1.5 text-xs font-medium rounded-md transition-all duration-200 shadow-sm cursor-pointer
          ${
            copySuccess
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
          }`}
          title={copySuccess ? "Copied!" : "Copy to clipboard"}
        >
          <Copy className="h-3.5 w-3.5 mr-1" />
          {copySuccess ? "Copied!" : "Copy"}
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        className="font-mono text-sm p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ height, resize: "vertical" }}
        spellCheck="false"
      />
    </div>
  );
};
