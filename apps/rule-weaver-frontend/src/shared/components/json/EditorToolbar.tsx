import React, { useState } from "react";
import { Copy, FileJson, Settings, Maximize, Minimize, X } from "lucide-react";
import { toast } from "sonner";
import type { editor } from "monaco-editor";

interface EditorToolbarProps {
  readOnly: boolean;
  showSettings: boolean;
  onToggleSettings: () => void;
  editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

/**
 * Toolbar component for the JSON editor with format, copy, and settings buttons
 */
const EditorToolbar: React.FC<EditorToolbarProps> = ({
  readOnly,
  showSettings,
  onToggleSettings,
  editorRef,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [isFormatted, setIsFormatted] = useState(true);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editorRef.current) return;

    try {
      await navigator.clipboard.writeText(editorRef.current.getValue());

      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1000);

      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error(
        `Failed to copy to clipboard: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const handleFormat = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editorRef.current) return;

    try {
      const text = editorRef.current.getValue();
      const parsed = JSON.parse(text);
      const formatted = JSON.stringify(parsed, null, 2);

      editorRef.current.setValue(formatted);
      editorRef.current.focus();

      setIsFormatted(true);
      toast.success("JSON formatted successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Invalid JSON format";
      toast.error(`Failed to format JSON: ${errorMessage}`);
    }
  };

  const handleToggleSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSettings();
  };

  const handleToggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFullscreen) {
      onToggleFullscreen();
    }
  };

  // In fullscreen mode, we create a toolbar that spans the full width with the X on the left
  if (isFullscreen) {
    return (
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-3 py-2 z-50 bg-white/90">
        <button
          onClick={handleToggleFullscreen}
          className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md shadow-sm transition-all duration-200 flex items-center justify-center"
          title="Exit Fullscreen (Esc)"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
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

          <button
            type="button"
            onClick={handleToggleSettings}
            className={`flex items-center justify-center px-2.5 py-1.5 text-xs font-medium rounded-md transition-all duration-200 shadow-sm cursor-pointer
              ${
                showSettings
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
              }`}
            title="Editor Settings"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Regular non-fullscreen toolbar
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

      {onToggleFullscreen && (
        <button
          type="button"
          onClick={handleToggleFullscreen}
          className="flex items-center justify-center px-2.5 py-1.5 text-xs font-medium rounded-md transition-all duration-200 shadow-sm cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
          title="Enter fullscreen"
        >
          <Maximize className="h-3.5 w-3.5" />
        </button>
      )}

      <button
        type="button"
        onClick={handleToggleSettings}
        className={`flex items-center justify-center px-2.5 py-1.5 text-xs font-medium rounded-md transition-all duration-200 shadow-sm cursor-pointer
          ${
            showSettings
              ? "bg-blue-100 text-blue-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
          }`}
        title="Editor Settings"
      >
        <Settings className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default EditorToolbar;
