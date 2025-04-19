import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Monaco Editor global setup - fixes "toUrl is not a function" error
// This needs to be configured before Monaco is loaded anywhere in the app
import { loader } from "@monaco-editor/react";
import { initializeMonaco } from "./shared/utils/monaco-config";

// Initialize Monaco environment to prevent worker loading issues
initializeMonaco();

// Additionally configure the Monaco loader paths
loader.config({
  paths: {
    vs: "/node_modules/monaco-editor/min/vs",
  },
  "vs/nls": { availableLanguages: { "*": "en" } },
});

createRoot(document.getElementById("root")!).render(<App />);
