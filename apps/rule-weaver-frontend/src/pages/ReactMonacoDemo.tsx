import React, { useState } from "react";
import ReactMonacoEditor from "@/shared/components/json/ReactMonacoEditor";

const SAMPLE_JSON = {
  name: "React Monaco Demo",
  description: "Testing the @monaco-editor/react integration",
  benefits: [
    "Simpler React integration",
    "Better lifecycle management",
    "Simplified API",
    "Proper resize handling",
    "Less boilerplate code",
  ],
  configuration: {
    readOnly: false,
    theme: "vs",
    formatOnPaste: true,
  },
  versions: {
    monaco: "latest",
    wrapper: "@monaco-editor/react",
  },
};

const ReactMonacoDemo: React.FC = () => {
  const [jsonValue, setJsonValue] =
    useState<Record<string, unknown>>(SAMPLE_JSON);
  const [readOnlyMode, setReadOnlyMode] = useState(false);

  const handleJsonChange = (newValue: Record<string, unknown>) => {
    setJsonValue(newValue);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">React Monaco Editor Demo</h1>
        <p className="text-gray-600 mb-4">
          This demonstrates a Monaco editor implemented using{" "}
          <code>@monaco-editor/react</code>.
        </p>
        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 mb-6">
          <p className="text-sm">
            <strong>Key benefits:</strong> Better React integration, proper
            resize handling, and the Enter key issue should be fixed out of the
            box.
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
            checked={readOnlyMode}
            onChange={() => setReadOnlyMode(!readOnlyMode)}
          />
          <span className="text-sm font-medium text-gray-700">
            Read-only mode
          </span>
        </label>
      </div>

      <div className="mb-6">
        <ReactMonacoEditor
          value={jsonValue}
          onChange={handleJsonChange}
          readOnly={readOnlyMode}
          height="400px"
        />
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h2 className="text-lg font-semibold mb-2">Current JSON Value:</h2>
        <pre className="bg-white p-3 rounded-md border border-gray-200 text-xs overflow-auto max-h-60">
          {JSON.stringify(jsonValue, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ReactMonacoDemo;
