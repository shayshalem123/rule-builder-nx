import React, { useRef, useEffect, useMemo, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { useMonacoEditor } from "./hooks/useMonacoEditor";
import { useFullscreenEditor } from "./hooks/useFullscreenEditor";
import useTheme from "@/shared/hooks/useTheme";

import ErrorMessage from "./ErrorMessage";
import EditorToolbar from "./EditorToolbar";
import FullscreenEditor from "./FullscreenEditor";

export interface JsonEditorProps {
  value: object;
  fileName?: string;
  onChange?: (parsedJson: Record<string, unknown>) => void;
  readOnly?: boolean;
  height?: string;
  className?: string;
  showToolbar?: boolean;
  enableStickyProperties?: boolean;
  jsonSchema?: Record<string, unknown>;
}

/**
 * Enhanced JSON editor component using Monaco editor
 */
const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  height = "60vh",
  fileName,
  className = "",
  showToolbar = true,
  enableStickyProperties = false,
  jsonSchema,
}) => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [rawContent, setRawContent] = useState<string>(
    JSON.stringify(value, null, 2)
  );
  const theme = useTheme();

  const editorPath = useMemo(
    () =>
      `file:///json-editor-${Math.random().toString(36).substring(2, 7)}.json`,
    []
  );

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
    setRawContent,
    onChange,
    readOnly,
    enableStickyProperties,
    jsonSchema,
    editorPath,
  });

  const { isFullscreen, toggleFullscreen } = useFullscreenEditor({ editorRef });

  useEffect(() => {
    const styleTag = document.createElement("style");

    styleTag.innerHTML = `
      .monaco-editor .monaco-hover {
        z-index: 100 !important;
        position: absolute !important;
      }
      .monaco-editor .suggest-widget {
        z-index: 100 !important;
      }
    `;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  return (
    <div className="h-full">
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
              fileName={fileName}
              onToggleFullscreen={toggleFullscreen}
              className="flex items-center gap-2"
            />
          </div>
        )}

        {!isFullscreen && (
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
        )}
      </div>

      {isFullscreen && (
        <FullscreenEditor
          onClose={toggleFullscreen}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          showToolbar={showToolbar}
          enableStickyProperties={enableStickyProperties}
          jsonSchema={jsonSchema}
          editorPath={editorPath}
          rawContent={rawContent}
          onRawContentChange={setRawContent}
          fileName={fileName}
        />
      )}

      {!readOnly && <ErrorMessage error={error} />}
    </div>
  );
};

export default JsonEditor;
