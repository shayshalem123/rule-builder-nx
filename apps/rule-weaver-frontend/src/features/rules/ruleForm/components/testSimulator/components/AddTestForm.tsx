import React, { useMemo } from "react";
import { Button } from "@/shared/components/inputs/button";
import { Label } from "@/shared/components/inputs/label";
import { AlertTriangleIcon, XIcon, Beaker, ClipboardEdit } from "lucide-react";
import JsonEditor from "@/shared/components/jsonEditor/JsonEditor";
import PassFailToggle from "./PassFailToggle";
import { SchemaDefinition } from "@/features/schemas/types/schema";

export interface TestFormData {
  metadata: Record<string, unknown>;
  expectedResult: boolean;
  name: string;
}

export interface AddTestFormProps {
  currentTestForm: TestFormData;
  onUpdateName: (name: string) => void;
  onUpdateMetadata: (data: Record<string, unknown>) => void;
  onUpdateExpected: (expected: boolean) => void;
  onAddTest: () => void;
  parseError: string | null;
  isEditing?: boolean;
  onCancelEdit?: () => void;
  schema?: SchemaDefinition | null;
}

// Component for the form to add a new test
const AddTestForm: React.FC<AddTestFormProps> = ({
  currentTestForm,
  onUpdateName,
  onUpdateMetadata,
  onUpdateExpected,
  onAddTest,
  parseError,
  isEditing = false,
  onCancelEdit,
  schema = null,
}) => {
  // Create a proper JSON Schema for validation
  const validationSchema = useMemo(() => {
    if (!schema) return undefined;

    return {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: schema.properties || {},
      required: schema.required || [],
      additionalProperties: schema.additionalProperties !== false,
    };
  }, [schema]);

  return (
    <div className="space-y-6">
      <div className="flex items-center border-b border-border-primary pb-4 mb-6">
        <div className="bg-indigo-100 p-2 rounded-md mr-3">
          {isEditing ? (
            <ClipboardEdit className="h-5 w-5 text-indigo-600" />
          ) : (
            <Beaker className="h-5 w-5 text-indigo-600" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-text-secondary">
          {isEditing ? "Edit Test Case" : "Add New Test Case"}
        </h3>
      </div>

      {parseError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center border border-red-200 shadow-sm">
          <AlertTriangleIcon className="h-5 w-5 mr-3 flex-shrink-0" />
          <span className="text-sm">{parseError}</span>
        </div>
      )}

      <div className="space-y-3">
        <Label
          htmlFor="test-name"
          className="text-sm font-medium text-text-secondary"
        >
          Test Name
        </Label>
        <input
          id="test-name"
          type="text"
          value={currentTestForm.name}
          onChange={(e) => onUpdateName(e.target.value)}
          className="px-4 py-2.5 w-full bg-background-secondary border border-border-primary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-info focus:border-info transition-colors"
          placeholder="Enter a descriptive name for this test case"
        />
      </div>

      <div className="space-y-3">
        <Label
          htmlFor="metadata"
          className="text-sm font-medium text-text-secondary"
        >
          Test Metadata (JSON)
        </Label>
        <p className="text-sm text-text-primary -mt-1">
          Enter JSON metadata to test against this rule via API
        </p>
        <div className="min-h-[300px] bg-background-secondary border border-border-primary rounded-lg shadow-sm">
          <JsonEditor
            value={currentTestForm.metadata}
            onChange={onUpdateMetadata}
            height="300px"
            showToolbar={true}
            enableStickyProperties={true}
            jsonSchema={validationSchema}
          />
        </div>
      </div>

      <div className="pt-2 space-y-3">
        <PassFailToggle
          value={currentTestForm.expectedResult}
          onChange={onUpdateExpected}
          className="mb-2"
        />
      </div>

      <div className="flex justify-end items-center pt-6 pb-2 border-t border-border-primary mt-6">
        {isEditing && onCancelEdit && (
          <Button
            onClick={onCancelEdit}
            type="button"
            variant="outline"
            className="flex items-center mr-3"
          >
            <XIcon className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}
        <Button
          onClick={onAddTest}
          type="button"
          className="py-2 px-4 rounded-md shadow-sm transition-colors"
        >
          {isEditing ? "Save Changes" : "Add Test Case"}
        </Button>
      </div>
    </div>
  );
};

export default AddTestForm;
