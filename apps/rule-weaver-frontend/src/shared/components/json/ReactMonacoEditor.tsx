import React, { useRef, useState } from "react";
import { Editor, OnMount, OnChange } from "@monaco-editor/react";
import { Copy, FileJson } from "lucide-react";
import type { editor } from "monaco-editor";

interface ReactMonacoEditorProps {
  value: Record<string, unknown>;
  onChange?: (value: Record<string, unknown>) => void;
  readOnly?: boolean;
  height?: string;
}

/**
 * A Monaco-based JSON editor component using @monaco-editor/react
 */
const ReactMonacoEditor: React.FC<ReactMonacoEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  height = "400px",
}) => {
  // Editor reference for accessing Monaco methods
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isFormatted, setIsFormatted] = useState(true);

  // Store reference to editor instance when mounted
  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    // Focus the editor
    setTimeout(() => editor.focus(), 100);
  };

  // Handle editor content changes
  const handleEditorChange: OnChange = (value) => {
    if (!onChange || !value) return;

    try {
      const parsed = JSON.parse(value);
      onChange(parsed);
      // Check if content is formatted
      setIsFormatted(value === JSON.stringify(parsed, null, 2));
    } catch (error) {
      // Ignore parsing errors while typing
    }
  };

  // Format JSON content
  const handleFormat = () => {
    if (!editorRef.current) return;

    try {
      const text = editorRef.current.getValue();
      const parsed = JSON.parse(text);
      const formatted = JSON.stringify(parsed, null, 2);

      editorRef.current.setValue(formatted);
      setIsFormatted(true);
      editorRef.current.focus();
    } catch (err) {
      console.error("Failed to format JSON", err);
    }
  };

  // Copy content to clipboard
  const handleCopy = () => {
    if (!editorRef.current) return;

    try {
      const text = editorRef.current.getValue();
      navigator.clipboard.writeText(text).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 1000);
      });
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div
      className="relative border rounded-md overflow-hidden"
      style={{ height }}
    >
      {/* Action buttons */}
      <div className="absolute top-2 right-5 flex items-center gap-2 z-10">
        {!readOnly && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleFormat();
            }}
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
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
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

      {/* Monaco Editor */}
      <Editor
        height="100%"
        defaultValue={JSON.stringify(value, null, 2)}
        defaultLanguage="json"
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          lineNumbers: "on",
          folding: true,
          tabSize: 2,
          wordWrap: "on",
          // Improved editor experience
          formatOnPaste: true,
          formatOnType: true,
          autoIndent: "advanced",
        }}
      />
    </div>
  );
};

export default ReactMonacoEditor;
