import React, { useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { useMonacoEditor } from "./hooks/useMonacoEditor";
import useTheme from "@/shared/hooks/useTheme";
import EditorToolbar from "./EditorToolbar";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/shared/components/inputs/dialog";

interface FullscreenEditorProps {
  onClose: () => void;
  value: object;
  rawContent: string;
  onRawContentChange: (content: string) => void;
  fileName?: string;
  onChange?: (parsedJson: Record<string, unknown>) => void;
  readOnly?: boolean;
  showToolbar?: boolean;
  enableStickyProperties?: boolean;
  jsonSchema?: Record<string, unknown>;
  editorPath?: string;
}

/**
 * Standalone fullscreen editor component using Monaco editor and Dialog
 */
const FullscreenEditor: React.FC<FullscreenEditorProps> = ({
  onClose,
  value,
  rawContent,
  onRawContentChange,
  onChange,
  fileName,
  readOnly = false,
  showToolbar = true,
  enableStickyProperties = false,
  jsonSchema,
  editorPath,
}) => {
  const theme = useTheme();

  const {
    editorRef,
    handleEditorDidMount,
    handleEditorChange,
    getEditorOptions,
    setupEditorEvents,
    handleStickyPropertiesChange,
    stickyPropertiesEnabled,
    isFormatted,
    formatContent,
  } = useMonacoEditor({
    value,
    setRawContent: onRawContentChange,
    onChange,
    readOnly,
    enableStickyProperties,
    isFullscreen: true,
    jsonSchema,
    editorPath,
  });

  // Prevent body scroll when in fullscreen
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Layout editor after mounting
  useEffect(() => {
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.layout();
        editorRef.current.focus();
      }
    }, 200);
  }, [editorRef]);

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogTitle>JSON Editor</DialogTitle>
      <DialogContent
        className="p-0 max-w-[95vw] w-full h-[95vh] max-h-[95vh] flex flex-col"
        aria-describedby={undefined}
      >
        {showToolbar && (
          <div className="flex justify-between items-center px-3 py-2 z-50 bg-background-secondary/90 border-b border-border-primary">
            <DialogClose asChild>
              <button
                className="p-1.5 bg-accent hover:bg-border-primary text-text-secondary rounded-md shadow-sm transition-all duration-200 flex items-center justify-center"
                title="Exit Fullscreen (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogClose>

            <EditorToolbar
              readOnly={readOnly}
              isFullscreen={true}
              stickyPropertiesEnabled={stickyPropertiesEnabled}
              handleStickyPropertiesChange={handleStickyPropertiesChange}
              editorRef={editorRef}
              isFormatted={isFormatted}
              onFormat={formatContent}
              fileName={fileName}
              className="flex items-center gap-2"
            />
          </div>
        )}

        <div className="flex-1 relative overflow-hidden">
          <Editor
            height="100%"
            value={rawContent}
            language="json"
            theme={theme}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            className="bg-background-primary"
            options={getEditorOptions()}
            beforeMount={setupEditorEvents}
            path={editorPath}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullscreenEditor;
