import React, { useState, useEffect, useRef } from "react";
import { Editor, OnMount, OnChange } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { toast } from "sonner";

// Import components from separate files
import ErrorMessage from "./ErrorMessage";
import SettingsMenu from "./SettingsMenu";
import EditorToolbar from "./EditorToolbar";

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
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [stickyPropertiesEnabled, setStickyPropertiesEnabled] = useState(
    enableStickyProperties
  );

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const isUserEditing = useRef(false);

  // Update editor options when sticky properties setting changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        stickyScroll: {
          enabled: stickyPropertiesEnabled,
        },
      });
    }
  }, [stickyPropertiesEnabled]);

  useEffect(() => {
    if (isUserEditing.current || !editorRef.current) return;

    try {
      const formattedJson = JSON.stringify(value, null, 2);

      if (editorRef.current.getValue() !== formattedJson) {
        editorRef.current.setValue(formattedJson);
      }

      setError(null);
    } catch (err) {
      setError("Could not convert value to JSON");
    }
  }, [value]);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    setTimeout(() => editor.focus(), 100);
  };

  const handleEditorChange: OnChange = (content) => {
    if (!content || !onChange) return;

    try {
      const parsed = JSON.parse(content);
      setError(null);
      onChange(parsed);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Invalid JSON format";
      setError(errorMessage);
    }
  };

  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
  };

  const handleStickyPropertiesChange = (enabled: boolean) => {
    setStickyPropertiesEnabled(enabled);
  };

  return (
    <div className="space-y-0">
      <div
        className={`relative border rounded-md shadow-sm ${className}`}
        style={{ height }}
      >
        {showToolbar && (
          <EditorToolbar
            readOnly={readOnly}
            showSettings={showSettings}
            onToggleSettings={toggleSettings}
            editorRef={editorRef}
          />
        )}

        <SettingsMenu
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          defaultStickyProperties={stickyPropertiesEnabled}
          onStickyPropertiesChange={handleStickyPropertiesChange}
        />

        <Editor
          height="100%"
          defaultValue={JSON.stringify(value, null, 2)}
          defaultLanguage="json"
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          className="bg-gray-50"
          options={{
            readOnly,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            lineNumbers: "on",
            folding: true,
            tabSize: 2,
            wordWrap: "on",
            formatOnPaste: true,
            formatOnType: true,
            autoIndent: "advanced",
            fontSize: 14,
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            stickyScroll: {
              enabled: stickyPropertiesEnabled,
            },
          }}
          beforeMount={(monaco) => {
            monaco.editor.onDidCreateEditor((editor) => {
              editor.onDidBlurEditorText(() => {
                isUserEditing.current = false;
              });
              editor.onDidFocusEditorText(() => {
                isUserEditing.current = true;
              });
            });
          }}
        />
      </div>

      {!readOnly && <ErrorMessage error={error} />}
    </div>
  );
};

export default JsonEditor;
