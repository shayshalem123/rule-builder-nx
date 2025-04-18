import React, { useState, useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";

export interface JsonEditorProps {
  value: object;
  onChange?: (parsedJson: Record<string, unknown>) => void;
  readOnly?: boolean;
  height?: string;
  className?: string;
}

const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  height = "60vh",
  className = "",
}) => {
  const [jsonText, setJsonText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setJsonText(JSON.stringify(value, null, 2));
    } catch (err) {
      setJsonText("");
      setError("Could not convert value to JSON");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;

    setJsonText(text);

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
    <div className="space-y-4">
      <div className="border rounded-md shadow-sm">
        <textarea
          className={`w-full p-4 font-mono text-sm bg-gray-50 rounded-md ${className}`}
          value={jsonText}
          onChange={handleChange}
          readOnly={readOnly}
          style={{ resize: "none", height }}
        />
      </div>

      {!readOnly && renderErrors()}
    </div>
  );
};

export default JsonEditor;
