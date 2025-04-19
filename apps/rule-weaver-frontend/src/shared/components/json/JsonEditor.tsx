import React, { useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { useMonacoEditor } from "./hooks/useMonacoEditor";
import { useFullscreenEditor } from "./hooks/useFullscreenEditor";

// Import components from separate files
import ErrorMessage from "./ErrorMessage";
import SettingsMenu from "./SettingsMenu";
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
    showSettings,
    stickyPropertiesEnabled,
    handleEditorDidMount,
    handleEditorChange,
    toggleSettings,
    handleStickyPropertiesChange,
    getEditorOptions,
    setupEditorEvents,
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
          <EditorToolbar
            readOnly={readOnly}
            showSettings={showSettings}
            onToggleSettings={toggleSettings}
            editorRef={editorRef}
            isFullscreen={false}
            onToggleFullscreen={toggleFullscreen}
          />
        )}

        <SettingsMenu
          isOpen={showSettings}
          onClose={() => toggleSettings()}
          defaultStickyProperties={stickyPropertiesEnabled}
          onStickyPropertiesChange={handleStickyPropertiesChange}
          isFullscreen={false}
          onToggleFullscreen={toggleFullscreen}
        />

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

      <FullscreenEditor
        isOpen={isFullscreen}
        onClose={toggleFullscreen}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        showToolbar={showToolbar}
        enableStickyProperties={stickyPropertiesEnabled}
      />

      {!readOnly && <ErrorMessage error={error} />}
    </div>
  );
};

export default JsonEditor;
