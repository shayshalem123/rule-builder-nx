import { useState, useEffect, useRef } from "react";
import type { editor } from "monaco-editor";
import type { OnMount, OnChange } from "@monaco-editor/react";
import { toast } from "sonner";

interface UseMonacoEditorOptions {
  value: object;
  onChange?: (parsedJson: Record<string, unknown>) => void;
  readOnly?: boolean;
  enableStickyProperties?: boolean;
  isFullscreen?: boolean;
}

/**
 * Custom hook to handle Monaco editor functionality
 */
export function useMonacoEditor({
  value,
  onChange,
  readOnly = false,
  enableStickyProperties = false,
  isFullscreen = false,
}: UseMonacoEditorOptions) {
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

  // Update editor content when value changes
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

  // Handle editor mount
  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Focus the editor
    setTimeout(() => editor.focus(), 100);
  };

  // Handle editor content change
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

  // Toggle settings panel
  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
  };

  // Handle sticky properties change
  const handleStickyPropertiesChange = (enabled: boolean) => {
    setStickyPropertiesEnabled(enabled);
  };

  // Get editor options based on current state
  const getEditorOptions = () => {
    return {
      readOnly,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      minimap: { enabled: isFullscreen ? true : false },
      lineNumbers: "on" as const,
      folding: true,
      tabSize: 2,
      wordWrap: "on" as const,
      formatOnPaste: true,
      formatOnType: true,
      autoIndent: "advanced" as const,
      fontSize: isFullscreen ? 16 : 14,
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      stickyScroll: {
        enabled: stickyPropertiesEnabled,
      },
    };
  };

  // Editor event handlers setup
  const setupEditorEvents = (monaco: typeof import("monaco-editor")) => {
    monaco.editor.onDidCreateEditor((editor: editor.IStandaloneCodeEditor) => {
      editor.onDidBlurEditorText(() => {
        isUserEditing.current = false;
      });
      editor.onDidFocusEditorText(() => {
        isUserEditing.current = true;
      });
    });
  };

  return {
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
  };
}
