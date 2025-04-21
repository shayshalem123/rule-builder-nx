import React, { useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { useMonacoEditor } from "./hooks/useMonacoEditor";
import { useFullscreenEditor } from "./hooks/useFullscreenEditor";

import ErrorMessage from "./ErrorMessage";
import EditorToolbar from "./EditorToolbar";
import FullscreenEditor from "./FullscreenEditor";

export interface JsonEditorProps {
  value: object;
  onChange?: (parsedJson: Record<string, unknown>) => void;
  readOnly?: boolean;
  height?: string;
  className?: string;
  showToolbar?: boolean;
  enableStickyProperties?: boolean;
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
  enableStickyProperties = false,
}) => {
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const {
    editorRef,
    error,
    formatContent,
    handleEditorDidMount,
    handleEditorChange,
    getEditorOptions,
    setupEditorEvents,
    stickyPropertiesEnabled,
    handleStickyPropertiesChange,
    isFormatted,
  } = useMonacoEditor({
    value,
    onChange,
    readOnly,
    enableStickyProperties,
  });

  const { isFullscreen, toggleFullscreen } = useFullscreenEditor({ editorRef });

  return (
    <div className="space-y-0">
      <div
        ref={editorContainerRef}
        className={`relative border rounded-md shadow-sm ${className}`}
        style={{ height: height, display: isFullscreen ? "none" : "block" }}
      >
        {showToolbar && (
          <div className="absolute top-2 right-2 z-10">
            <EditorToolbar
              readOnly={readOnly}
              isFullscreen={false}
              editorRef={editorRef}
              stickyPropertiesEnabled={stickyPropertiesEnabled}
              handleStickyPropertiesChange={handleStickyPropertiesChange}
              isFormatted={isFormatted}
              onFormat={formatContent}
              onToggleFullscreen={toggleFullscreen}
              className="flex items-center gap-2"
            />
          </div>
        )}

        <Editor
          height="100%"
          defaultValue={JSON.stringify(value, null, 2)}
          defaultLanguage="json"
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          className="bg-gray-50"
          options={getEditorOptions()}
          beforeMount={setupEditorEvents}
        />
      </div>

      {isFullscreen && (
        <FullscreenEditor
          onClose={toggleFullscreen}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          showToolbar={showToolbar}
          enableStickyProperties={enableStickyProperties}
        />
      )}

      {!readOnly && <ErrorMessage error={error} />}
    </div>
  );
};

export default JsonEditor;
