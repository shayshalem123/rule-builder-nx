import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/shared/components/inputs/card";
import JsonEditor from "@/shared/components/jsonEditor/JsonEditor";
import { Button } from "@/shared/components/inputs/button";
import { DiffEditor, DiffOnMount } from "@monaco-editor/react";
import { Maximize2, Eye, EyeOff } from "lucide-react";
import type { editor } from "monaco-editor";
import { JsonData } from "../types";
import useTheme from "@/shared/hooks/useTheme";

interface DiffModeProps {
  leftJson: JsonData;
  rightJson: JsonData;
  onLeftJsonChange: (data: JsonData) => void;
  onRightJsonChange: (data: JsonData) => void;
  onShowFullscreen: () => void;
}

export const DiffMode: React.FC<DiffModeProps> = ({
  leftJson,
  rightJson,
  onLeftJsonChange,
  onRightJsonChange,
  onShowFullscreen,
}) => {
  const diffEditorRef = useRef<editor.IStandaloneDiffEditor | null>(null);
  const [showSideBySide, setShowSideBySide] = useState(true);
  const [showDiff, setShowDiff] = useState(false);
  const theme = useTheme();

  const editorHeight = showDiff ? "40vh" : "70vh";
  const diffHeight = "50vh";

  const handleDiffEditorDidMount: DiffOnMount = (editor) => {
    diffEditorRef.current = editor;
  };

  const toggleDiffViewMode = () => {
    setShowSideBySide(!showSideBySide);

    if (diffEditorRef.current) {
      diffEditorRef.current.updateOptions({
        renderSideBySide: !showSideBySide,
      });
    }
  };

  const toggleDiffDisplay = () => {
    setShowDiff(!showDiff);
  };

  const swapDiffContent = () => {
    const prevLeftJson = leftJson;

    onLeftJsonChange(rightJson);
    onRightJsonChange(prevLeftJson);
  };

  // Make the editor options match FullscreenEditor
  const diffEditorOptions = {
    renderSideBySide: showSideBySide,
    originalEditable: false,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    lineNumbers: "on" as const,
    wordWrap: "on" as const,
    diffWordWrap: "on" as const,
    readOnly: false,
    folding: true,
    tabSize: 2,
    formatOnPaste: true,
    formatOnType: true,
    autoIndent: "advanced" as const,
    fontSize: 14,
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  };

  return (
    <Card className="shadow-md m-2 rounded-lg border-border-primary border">
      <CardHeader className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={toggleDiffDisplay}
              className="text-sm flex items-center gap-1.5"
              size="sm"
            >
              {showDiff ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  Hide Diff
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Show Diff
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={swapDiffContent}
              className="text-sm"
              size="sm"
            >
              Swap Left / Right
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2 text-text-primary">
              Left JSON
            </h3>
            <div style={{ height: editorHeight }}>
              <JsonEditor
                value={leftJson}
                onChange={onLeftJsonChange}
                height="100%"
                showToolbar={true}
                enableStickyProperties={true}
              />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2 text-text-primary">
              Right JSON
            </h3>
            <div style={{ height: editorHeight }}>
              <JsonEditor
                value={rightJson}
                onChange={onRightJsonChange}
                height="100%"
                showToolbar={true}
                enableStickyProperties={true}
              />
            </div>
          </div>
        </div>

        {showDiff && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-medium text-text-primary">
                  Live Diff View
                </h3>
                <Button
                  variant="outline"
                  onClick={toggleDiffViewMode}
                  className="text-xs"
                  size="sm"
                >
                  {showSideBySide ? "Inline View" : "Side-by-Side View"}
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={onShowFullscreen}
                className="text-sm flex items-center gap-1.5"
                size="sm"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                Fullscreen
              </Button>
            </div>
            <div style={{ height: diffHeight }}>
              <DiffEditor
                height="100%"
                language="json"
                original={JSON.stringify(leftJson, null, 2)}
                modified={JSON.stringify(rightJson, null, 2)}
                theme={theme}
                onMount={handleDiffEditorDidMount}
                options={diffEditorOptions}
                className="bg-background-primary"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
