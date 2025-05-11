import { Editor } from "@monaco-editor/react";
import useTheme from "../hooks/useTheme";

interface MonacoEditorProps {
  value?: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
  height?: string | number;
  readOnly?: boolean;
}

export const MonacoEditor = ({
  value = "",
  language = "json",
  onChange,
  height = "400px",
  readOnly = false,
}: MonacoEditorProps) => {
  // Use our custom theme hook to get the current Monaco theme
  const theme = useTheme();

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      theme={theme}
      onChange={onChange}
      options={{
        readOnly,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
};

export default MonacoEditor;
