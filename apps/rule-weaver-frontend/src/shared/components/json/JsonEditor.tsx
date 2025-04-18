import React, { useState, useEffect, useRef } from "react";
import { AlertCircle, Copy, FileJson } from "lucide-react";

export interface JsonEditorProps {
  value: object;
  onChange?: (parsedJson: Record<string, unknown>) => void;
  readOnly?: boolean;
  height?: string;
  className?: string;
  showToolbar?: boolean;
}

const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  height = "60vh",
  className = "",
  showToolbar = true,
}) => {
  const [jsonText, setJsonText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isFormatted, setIsFormatted] = useState(true);
  const isUserEditing = useRef(false);
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

  useEffect(() => {
    if (isUserEditing.current) return;

    try {
      const formattedJson = JSON.stringify(value, null, 2);
      setJsonText(formattedJson);
      setIsFormatted(true);
    } catch (err) {
      setJsonText("");
      setError("Could not convert value to JSON");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJsonText(text);

    // Update formatting state
    setIsFormatted(checkFormatting(text));

    if (!onChange) return;

    try {
      const parsedJson = JSON.parse(text);
      setError(null);
      onChange(parsedJson);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Invalid JSON format";
      setError(errorMessage);
    }
  };

  const handleBlur = () => {
    isUserEditing.current = false;
  };

  const handleFocus = () => {
    isUserEditing.current = true;
  };

  const handleCopy = () => {
    if (!textareaRef.current) return;

    navigator.clipboard
      .writeText(jsonText)
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
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);

      setJsonText(formatted);
      setIsFormatted(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Invalid JSON format";
      setError(errorMessage);
    }
  };

  const renderButtons = () => {
    if (!showToolbar) return null;

    return (
      <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
        {!readOnly && (
          <button
            type="button"
            onClick={handleFormat}
            disabled={readOnly || isFormatted}
            className={`flex items-center justify-center px-2.5 py-1.5 text-xs font-medium rounded-md transition-all duration-200 shadow-sm
            ${
              readOnly || isFormatted
                ? "bg-gray-100 text-gray-400 opacity-70"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200 cursor-pointer"
            }`}
            title={isFormatted ? "JSON is already formatted" : "Format JSON"}
          >
            <FileJson className="h-3.5 w-3.5 mr-1" />
            Format
          </button>
        )}

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
    );
  };

  const renderErrors = () => {
    if (!error) return null;

    return (
      <div className="text-red-500 mt-2 flex items-start">
        <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  };

  return (
    <div className="space-y-0">
      <div className="relative border rounded-md shadow-sm" style={{ height }}>
        {renderButtons()}
        <textarea
          ref={textareaRef}
          className={`w-full h-full p-4 font-mono text-sm bg-gray-50 rounded-md ${className}`}
          value={jsonText}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          readOnly={readOnly}
          style={{ resize: "none" }}
        />
      </div>

      {!readOnly && renderErrors()}
    </div>
  );
};

export default JsonEditor;
