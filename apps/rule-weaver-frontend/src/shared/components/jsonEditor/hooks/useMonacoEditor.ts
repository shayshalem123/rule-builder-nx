import { useState, useEffect, useRef } from "react";
import type { editor } from "monaco-editor";
import type { OnMount, OnChange, Monaco } from "@monaco-editor/react";

interface UseMonacoEditorOptions {
  value: object;
  setRawContent: (content: string) => void;
  onChange?: (parsedJson: Record<string, unknown>) => void;
  readOnly?: boolean;
  enableStickyProperties?: boolean;
  isFullscreen?: boolean;
  jsonSchema?: Record<string, unknown>;
  editorPath?: string;
}

/**
 * Custom hook to handle Monaco editor functionality
 */
export function useMonacoEditor({
  value,
  setRawContent,
  onChange,
  readOnly = false,
  enableStickyProperties = false,
  isFullscreen = false,
  jsonSchema,
  editorPath,
}: UseMonacoEditorOptions) {
  const [error, setError] = useState<string | null>(null);
  const [stickyPropertiesEnabled, setStickyPropertiesEnabled] = useState(
    enableStickyProperties
  );
  const [isFormatted, setIsFormatted] = useState(true);

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const isUserEditing = useRef(false);
  const editorPathRef = useRef<string>(
    editorPath ||
      `file:///model-${Math.random().toString(36).substring(2, 10)}.json`
  );

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
      setIsFormatted(true);
    } catch (err) {
      setError("Could not convert value to JSON");
    }
  }, [value]);

  // Configure JSON schema validation if schema is provided
  useEffect(() => {
    if (jsonSchema && monacoRef.current && editorRef.current) {
      configureJsonValidation(
        monacoRef.current,
        jsonSchema,
        editorPathRef.current
      );
    }
  }, [jsonSchema]);

  // Configure JSON validation with the provided schema
  const configureJsonValidation = (
    monaco: Monaco,
    schema: Record<string, unknown>,
    modelPath: string
  ) => {
    // Get the JSON language
    const jsonLanguage = monaco.languages.json;

    // Configure JSON language with the schema
    if (jsonLanguage && jsonLanguage.jsonDefaults) {
      jsonLanguage.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemaValidation: "error", // Show validation issues as errors
        schemas: [
          {
            uri: "http://myserver/schema.json", // ID of the schema
            fileMatch: [modelPath], // Match our model path
            schema: schema, // The actual schema object
          },
        ],
      });
    }
  };

  // Handle editor mount
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure JSON schema validation if a schema is provided
    if (jsonSchema && monaco) {
      configureJsonValidation(monaco, jsonSchema, editorPathRef.current);
    }

    // Focus the editor
    setTimeout(() => editor.focus(), 100);
  };

  // Check if content is formatted
  const checkIsFormatted = (content: string): boolean => {
    try {
      const parsed = JSON.parse(content);
      const formatted = JSON.stringify(parsed, null, 2);
      return content === formatted;
    } catch {
      return false;
    }
  };

  // Handle editor content change
  const handleEditorChange: OnChange = (content) => {
    if (!content) return;

    setRawContent(content);
    const formattedStatus = checkIsFormatted(content);
    setIsFormatted(formattedStatus);

    if (!onChange) return;

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

  // Format the current editor content
  const formatContent = () => {
    if (!editorRef.current) return;

    try {
      const text = editorRef.current.getValue();
      const parsed = JSON.parse(text);
      const formatted = JSON.stringify(parsed, null, 2);

      editorRef.current.setValue(formatted);
      editorRef.current.focus();

      setIsFormatted(true);
      return true;
    } catch {
      return false;
    }
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
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
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
      editor.onDidPaste(() => {
        setTimeout(() => formatContent(), 0);
      });
    });
  };

  return {
    editorRef,
    error,
    stickyPropertiesEnabled,
    isFormatted,
    formatContent,
    handleEditorDidMount,
    handleEditorChange,
    handleStickyPropertiesChange,
    getEditorOptions,
    setupEditorEvents,
    editorPath: editorPathRef.current,
  };
}
