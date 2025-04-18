import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
/* eslint-disable @typescript-eslint/no-explicit-any */
import monacoEditorPlugin from "vite-plugin-monaco-editor";

// Type for Monaco plugin since its typing is inconsistent
type MonacoPlugin = {
  (options: Record<string, unknown>): any;
  default?: (options: Record<string, unknown>) => any;
};

// https://vitejs.dev/config/
export const config = defineConfig(({ mode }) => {
  // Handle plugin which might be a direct function or have a default export
  const monaco = monacoEditorPlugin as MonacoPlugin;
  const monacoPlugin = monaco.default || monaco;

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      monacoPlugin({
        customWorkers: [
          {
            label: "json",
            entry: "monaco-editor/esm/vs/language/json/json.worker",
          },
          {
            label: "editorWorkerService",
            entry: "monaco-editor/esm/vs/editor/editor.worker",
          },
        ],
        languageWorkers: ["json"],
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      include: [
        "monaco-editor/esm/vs/language/json/json.worker",
        "monaco-editor/esm/vs/editor/editor.worker",
      ],
    },
  };
});

export default config;
