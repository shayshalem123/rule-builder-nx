import React, { useState } from "react";
import { DiffEditor, DiffOnMount } from "@monaco-editor/react";
import { Dialog, DialogClose } from "@/shared/components/inputs/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Settings } from "lucide-react";
import type { editor } from "monaco-editor";
import { cn } from "@/shared/utils/cn";
import SettingsMenu from "@/shared/components/jsonEditor/SettingsMenu";
import useTheme from "@/shared/hooks/useTheme";

interface DiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  original: string;
  modified: string;
  language?: string;
  renderSideBySide?: boolean;
}

/**
 * A shared modal component for displaying code diffs using Monaco Editor
 */
const DiffModal: React.FC<DiffModalProps> = ({
  isOpen,
  onClose,
  title = "Changes",
  original,
  modified,
  language = "json",
  renderSideBySide = true,
}) => {
  const diffEditorRef = React.useRef<editor.IStandaloneDiffEditor | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [stickyPropertiesEnabled, setStickyPropertiesEnabled] = useState(false);
  const theme = useTheme();

  const handleDiffEditorDidMount: DiffOnMount = (editor) => {
    diffEditorRef.current = editor;
  };

  const handleStickyPropertiesChange = (enabled: boolean) => {
    setStickyPropertiesEnabled(enabled);

    if (diffEditorRef.current) {
      const originalEditor = diffEditorRef.current.getOriginalEditor();
      const modifiedEditor = diffEditorRef.current.getModifiedEditor();

      originalEditor.updateOptions({
        stickyScroll: { enabled },
      });

      modifiedEditor.updateOptions({
        stickyScroll: { enabled },
      });
    }
  };

  // Make the editor options match FullscreenEditor
  const editorOptions = {
    renderSideBySide,
    originalEditable: false,
    minimap: { enabled: true }, // Enable minimap like in fullscreen mode
    scrollBeyondLastLine: false,
    lineNumbers: "on" as const,
    wordWrap: "on" as const,
    diffWordWrap: "on" as const,
    readOnly: true,
    folding: true,
    tabSize: 2,
    formatOnPaste: true,
    formatOnType: true,
    autoIndent: "advanced" as const,
    fontSize: 16,
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", // Match fullscreen editor font family
    stickyScroll: {
      enabled: stickyPropertiesEnabled,
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 flex flex-col w-full max-w-7xl h-[95vh] translate-x-[-50%] translate-y-[-50%] border bg-background-secondary p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">{title}</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="p-1.5 bg-accent hover:bg-border-primary text-text-secondary rounded-md shadow-sm transition-all duration-200 flex items-center justify-center"
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                </button>

                <SettingsMenu
                  isOpen={isSettingsOpen}
                  onClose={() => setIsSettingsOpen(false)}
                  stickyPropertiesEnabled={stickyPropertiesEnabled}
                  handleStickyPropertiesChange={handleStickyPropertiesChange}
                />
              </div>

              <DialogClose asChild>
                <button
                  onClick={onClose}
                  className="p-1.5 bg-accent hover:bg-border-primary text-text-secondary rounded-md shadow-sm transition-all duration-200 flex items-center justify-center"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </DialogClose>
            </div>
          </div>

          <div className="p-4 flex-1 min-h-0">
            <div className="h-full border rounded-lg overflow-hidden">
              <DiffEditor
                height="100%"
                language={language}
                original={original}
                modified={modified}
                theme={theme}
                onMount={handleDiffEditorDidMount}
                options={editorOptions}
                className="bg-background-primary" // Match the background color from JsonEditor
              />
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
};

export default DiffModal;
