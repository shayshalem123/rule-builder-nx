import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Editor } from "@monaco-editor/react";
import { useMonacoEditor } from "./hooks/useMonacoEditor";
import EditorToolbar from "./EditorToolbar";
import SettingsMenu from "./SettingsMenu";
import { X } from "lucide-react";

interface FullscreenEditorProps {
  onClose: () => void;
  value: object;
  onChange?: (parsedJson: Record<string, unknown>) => void;
  readOnly?: boolean;
  showToolbar?: boolean;
  enableStickyProperties?: boolean;
}

/**
 * Standalone fullscreen editor component using Monaco editor and portal
 */
const FullscreenEditor: React.FC<FullscreenEditorProps> = ({
  onClose,
  value,
  onChange,
  readOnly = false,
  showToolbar = true,
  enableStickyProperties = false,
}) => {
  const {
    editorRef,
    showSettings,
    toggleSettings,
    handleEditorDidMount,
    handleEditorChange,
    getEditorOptions,
    setupEditorEvents,
  } = useMonacoEditor({
    value,
    onChange,
    readOnly,
    enableStickyProperties,
    isFullscreen: true,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent body scroll when in fullscreen
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.layout();
        editorRef.current.focus();
      }
    }, 200);
  }, [editorRef]);

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full h-full max-w-[95vw] max-h-[95vh] rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200">
        <div className="flex-1 h-full relative">
          {showToolbar && (
            <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-3 py-2 z-50 bg-white/90">
              <button
                onClick={onClose}
                className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md shadow-sm transition-all duration-200 flex items-center justify-center"
                title="Exit Fullscreen (Esc)"
              >
                <X className="h-4 w-4" />
              </button>

              <EditorToolbar
                readOnly={readOnly}
                isFullscreen={true}
                className="flex items-center gap-2"
              />
            </div>
          )}

          <SettingsMenu
            isOpen={showSettings}
            onClose={toggleSettings}
            isFullscreen={true}
            onToggleFullscreen={onClose}
          />

          <Editor
            height="100%"
            defaultValue={JSON.stringify(value, null, 2)}
            defaultLanguage="json"
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            className="bg-gray-50 pt-10"
            options={getEditorOptions()}
            beforeMount={setupEditorEvents}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FullscreenEditor;
