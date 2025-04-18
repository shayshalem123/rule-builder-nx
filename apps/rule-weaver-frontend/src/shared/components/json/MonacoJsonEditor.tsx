import React, { useRef, useEffect, useState } from "react";
import * as monaco from "monaco-editor";
import { Copy, FileJson } from "lucide-react";

interface MonacoJsonEditorProps {
  value: Record<string, unknown>;
  onChange?: (value: Record<string, unknown>) => void;
  readOnly?: boolean;
  height?: string;
}

const MonacoJsonEditor: React.FC<MonacoJsonEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  height = "400px",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isFormatted, setIsFormatted] = useState(true);

  // Initialize Monaco editor
  useEffect(() => {
    if (!containerRef.current) return;

    // Configure language formatting options
    monaco.languages.json.jsonDefaults.setModeConfiguration({
      documentFormattingEdits: true,
      documentRangeFormattingEdits: true,
      completionItems: true,
      hovers: true,
      documentSymbols: true,
      tokens: true,
      colors: true,
      foldingRanges: true,
      diagnostics: true,
    });

    // Basic configuration for the editor
    const editorInstance = monaco.editor.create(containerRef.current, {
      value: JSON.stringify(value, null, 2),
      language: "json",
      automaticLayout: true,
      scrollBeyondLastLine: false,
      minimap: { enabled: false },
      lineNumbers: "on",
      glyphMargin: false,
      folding: true,
      lineDecorationsWidth: 10,
      readOnly,
      tabSize: 2,
      wordWrap: "on",
      autoIndent: "advanced",
      formatOnPaste: true,
      formatOnType: true,
    });

    // Give focus to the editor
    setTimeout(() => {
      editorInstance.focus();
    }, 100);

    // Register change listener
    const changeDisposable = editorInstance.onDidChangeModelContent(() => {
      if (!onChange) return;

      try {
        const newValue = editorInstance.getValue();
        const parsed = JSON.parse(newValue);
        onChange(parsed);
        setIsFormatted(newValue === JSON.stringify(parsed, null, 2));
      } catch (error) {
        // Ignore parsing errors while typing
      }
    });

    return () => {
      changeDisposable.dispose();
      editorInstance.dispose();
    };
  }, []);

  // Update editor when value changes
  useEffect(() => {
    if (editor) {
      const currentValue = editor.getValue();
      const newValue = JSON.stringify(value, null, 2);

      if (currentValue !== newValue) {
        editor.setValue(newValue);
      }
    }
  }, [value, editor]);

  const handleCopy = () => {
    if (!editor) return;

    const text = editor.getValue();
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 1000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handleFormat = () => {
    if (!editor) return;

    try {
      const text = editor.getValue();
      const parsedJson = JSON.parse(text);
      const formatted = JSON.stringify(parsedJson, null, 2);

      editor.setValue(formatted);
      setIsFormatted(true);
      editor.focus();
    } catch (err) {
      console.error("Failed to format JSON: ", err);
    }
  };

  return (
    <div
      className="relative border rounded-md overflow-hidden"
      style={{ height }}
    >
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
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%" }}
        data-testid="monaco-editor"
        onClick={() => editor?.focus()}
      />
    </div>
  );
};

export default MonacoJsonEditor;
