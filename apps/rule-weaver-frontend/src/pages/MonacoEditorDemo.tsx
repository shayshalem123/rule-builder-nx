import React, { useState } from "react";
import MonacoJsonEditor from "@/shared/components/json/MonacoJsonEditor";

const INITIAL_JSON = {
  name: "Example Schema",
  description: "This is an example schema to test Monaco editor",
  version: "1.0.0",
  properties: {
    id: {
      type: "string",
      description: "The unique identifier for the item",
      format: "uuid",
    },
    title: {
      type: "string",
      description: "The title of the item",
      minLength: 1,
      maxLength: 100,
    },
    description: {
      type: "string",
      description: "A detailed description of the item",
    },
    price: {
      type: "number",
      description: "The price of the item",
      minimum: 0,
    },
    tags: {
      type: "array",
      description: "Tags associated with the item",
      items: {
        type: "string",
      },
    },
    metadata: {
      type: "object",
      description: "Additional metadata",
      properties: {
        created: {
          type: "string",
          format: "date-time",
        },
        updated: {
          type: "string",
          format: "date-time",
        },
      },
    },
  },
  required: ["id", "title", "price"],
};

const MonacoEditorDemo: React.FC = () => {
  const [jsonValue, setJsonValue] =
    useState<Record<string, unknown>>(INITIAL_JSON);
  const [readOnlyMode, setReadOnlyMode] = useState(false);

  const handleJsonChange = (newValue: Record<string, unknown>) => {
    setJsonValue(newValue);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Monaco Editor Demo</h1>
        <p className="text-gray-600">
          This page demonstrates a Monaco-based JSON editor component.
        </p>
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
        <MonacoJsonEditor
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

export default MonacoEditorDemo;
