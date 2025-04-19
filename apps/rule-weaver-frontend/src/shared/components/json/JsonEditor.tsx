import React, { useState, useEffect, useRef } from "react";
import { AlertCircle, Copy, FileJson } from "lucide-react";
import { Editor, OnMount, OnChange } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { toast } from "sonner";

export interface JsonEditorProps {
  value: object;
  onChange?: (parsedJson: Record<string, unknown>) => void;
  readOnly?: boolean;
  height?: string;
  className?: string;
  showToolbar?: boolean;
}

/**
 * Enhanced JSON editor component using Monaco editor
 */
const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  height = "60vh",
  className = "",
  showToolbar = true,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isFormatted, setIsFormatted] = useState(true);

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const isUserEditing = useRef(false);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    setTimeout(() => editor.focus(), 100);
  };

  useEffect(() => {
    if (isUserEditing.current || !editorRef.current) return;

    try {
      const formattedJson = JSON.stringify(value, null, 2);

      if (editorRef.current.getValue() !== formattedJson) {
        editorRef.current.setValue(formattedJson);
      }

      setIsFormatted(true);
      setError(null);
    } catch (err) {
      setError("Could not convert value to JSON");
    }
  }, [value]);

  const handleEditorChange: OnChange = (content) => {
    if (!content || !onChange) return;

    try {
      const parsed = JSON.parse(content);

      setError(null);
      setIsFormatted(content === JSON.stringify(parsed, null, 2));

      onChange(parsed);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Invalid JSON format";
      setError(errorMessage);
    }
  };

  const handleCopy = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!editorRef.current) return;

    try {
      await navigator.clipboard.writeText(editorRef.current.getValue());

      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1000);
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy", err);
      toast.error(
        `Failed to copy to clipboard: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const handleFormat = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!editorRef.current) return;

    try {
      const text = editorRef.current.getValue();
      const parsed = JSON.parse(text);
      const formatted = JSON.stringify(parsed, null, 2);

      editorRef.current.setValue(formatted);
      editorRef.current.focus();

      setIsFormatted(true);
      setError(null);
      toast.success("JSON formatted successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Invalid JSON format";
      setError(errorMessage);
      toast.error(`Failed to format JSON: ${errorMessage}`);
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
      <div
        className={`relative border rounded-md shadow-sm ${className}`}
        style={{ height }}
      >
        {renderButtons()}
        <Editor
          height="100%"
          defaultValue={JSON.stringify(value, null, 2)}
          defaultLanguage="json"
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          className="bg-gray-50"
          options={{
            readOnly,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            lineNumbers: "on",
            folding: true,
            tabSize: 2,
            wordWrap: "on",
            formatOnPaste: true,
            formatOnType: true,
            autoIndent: "advanced",
            fontSize: 14,
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            stickyScroll: {
              enabled: false,
            },
          }}
          beforeMount={(monaco) => {
            monaco.editor.onDidCreateEditor((editor) => {
              editor.onDidBlurEditorText(() => {
                isUserEditing.current = false;
              });
              editor.onDidFocusEditorText(() => {
                isUserEditing.current = true;
              });
            });
          }}
        />
      </div>

      {!readOnly && renderErrors()}
    </div>
  );
};

export default JsonEditor;
