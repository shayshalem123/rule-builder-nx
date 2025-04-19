import React from "react";
import { DiffEditor, DiffOnMount } from "@monaco-editor/react";
import { Dialog, DialogContent } from "@/shared/components/inputs/dialog";
import type { editor } from "monaco-editor";

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

  const handleDiffEditorDidMount: DiffOnMount = (editor) => {
    diffEditorRef.current = editor;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        <div className="p-4 flex-1 min-h-0">
          <div className="h-full border rounded-lg overflow-hidden">
            <DiffEditor
              height="100%"
              language={language}
              original={original}
              modified={modified}
              onMount={handleDiffEditorDidMount}
              options={{
                renderSideBySide,
                originalEditable: false,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                wordWrap: "on",
                diffWordWrap: "on",
                readOnly: true,
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiffModal;
