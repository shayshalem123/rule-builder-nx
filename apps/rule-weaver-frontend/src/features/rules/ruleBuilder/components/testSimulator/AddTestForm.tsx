import React from "react";
import { Button } from "@/shared/components/inputs/button";
import { Label } from "@/shared/components/inputs/label";
import {
  AlertTriangleIcon,
  PlusIcon,
  CheckIcon,
  XIcon,
  FileJson,
  ClipboardEdit,
} from "lucide-react";
import JsonEditor from "@/shared/components/jsonEditor/JsonEditor";
import PassFailToggle from "./PassFailToggle";

// Type for the current test form
export interface TestFormData {
  metadata: Record<string, unknown>;
  expectedResult: boolean;
  name: string;
}

// Props for AddTestForm component
export interface AddTestFormProps {
  currentTestForm: TestFormData;
  onUpdateName: (name: string) => void;
  onUpdateMetadata: (data: Record<string, unknown>) => void;
  onUpdateExpected: (expected: boolean) => void;
  onAddTest: () => void;
  parseError: string | null;
  isEditing?: boolean;
  onCancelEdit?: () => void;
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
}) => {
  return (
    <div className="mb-8 space-y-6">
      <div className="flex items-center border-b border-gray-200 pb-4 mb-6">
        <div className="bg-indigo-100 p-2 rounded-md mr-3">
          {isEditing ? (
            <ClipboardEdit className="h-5 w-5 text-indigo-600" />
          ) : (
            <FileJson className="h-5 w-5 text-indigo-600" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
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
          className="text-sm font-medium text-gray-700"
        >
          Test Name
        </Label>
        <input
          id="test-name"
          type="text"
          value={currentTestForm.name}
          onChange={(e) => onUpdateName(e.target.value)}
          className="px-4 py-2.5 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Enter a descriptive name for this test case"
        />
      </div>

      <div className="space-y-3 pt-2">
        <Label htmlFor="metadata" className="text-sm font-medium text-gray-700">
          Test Metadata (JSON)
        </Label>
        <p className="text-sm text-gray-500 -mt-1">
          Enter JSON metadata to test against this rule via API
        </p>
        <div className="min-h-[300px] bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <JsonEditor
            value={currentTestForm.metadata}
            onChange={onUpdateMetadata}
            height="300px"
            showToolbar={true}
            enableStickyProperties={true}
          />
        </div>
      </div>

      <div className="pt-2">
        <Label className="text-sm font-medium text-gray-700 block mb-3">
          Expected Result
        </Label>
        <PassFailToggle
          value={currentTestForm.expectedResult}
          onChange={onUpdateExpected}
          className="my-2"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
        {isEditing && onCancelEdit && (
          <Button
            onClick={onCancelEdit}
            type="button"
            variant="outline"
            className="flex items-center"
          >
            <XIcon className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}
        <Button
          onClick={onAddTest}
          type="button"
          className="flex items-center bg-indigo-600 hover:bg-indigo-700"
        >
          {isEditing ? (
            <>
              <CheckIcon className="mr-2 h-4 w-4" />
              Save Changes
            </>
          ) : (
            <>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Test Case
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AddTestForm;
