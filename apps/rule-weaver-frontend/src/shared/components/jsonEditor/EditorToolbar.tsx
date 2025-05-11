import React, { useState } from "react";
import { Copy, FileJson, Settings, Maximize } from "lucide-react";
import { toast } from "sonner";
import SettingsMenu from "./SettingsMenu";
import type { editor } from "monaco-editor";

interface EditorToolbarProps {
  readOnly: boolean;
  isFormatted: boolean;
  editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor>;
  stickyPropertiesEnabled: boolean;
  handleStickyPropertiesChange: (enabled: boolean) => void;
  onFormat: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  className?: string;
}

/**
 * Generic toolbar component for JSON editor with buttons only
 */
const EditorToolbar: React.FC<EditorToolbarProps> = ({
  readOnly,
  isFullscreen = false,
  editorRef,
  stickyPropertiesEnabled,
  handleStickyPropertiesChange,
  onToggleFullscreen,
  onFormat,
  className = "",
  isFormatted,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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

    onFormat();
  };

  const handleToggleSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSettings((prev) => !prev);
  };

  const handleToggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFullscreen) {
      onToggleFullscreen();
    }
  };

  return (
    <>
      <div className={className}>
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

        {!isFullscreen && onToggleFullscreen && (
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

      <SettingsMenu
        isOpen={showSettings}
        stickyPropertiesEnabled={stickyPropertiesEnabled}
        handleStickyPropertiesChange={handleStickyPropertiesChange}
        onClose={() => setShowSettings(false)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={onToggleFullscreen}
      />
    </>
  );
};

export default EditorToolbar;
