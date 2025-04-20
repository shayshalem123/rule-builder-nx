import React from "react";
import { Button } from "@/shared/components/inputs/button";
import { Switch } from "@/shared/components/inputs/switch";
import { Label } from "@/shared/components/inputs/label";
import { AlertTriangleIcon, PlusIcon } from "lucide-react";
import JsonEditor from "@/shared/components/jsonEditor/JsonEditor";

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
}

// Component for the form to add a new test
const AddTestForm: React.FC<AddTestFormProps> = ({
  currentTestForm,
  onUpdateName,
  onUpdateMetadata,
  onUpdateExpected,
  onAddTest,
  parseError,
}) => {
  return (
    <div className="space-y-4">
      {parseError && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-center">
          <AlertTriangleIcon className="h-5 w-5 mr-2" />
          <span>{parseError}</span>
        </div>
      )}

      <h3 className="text-md font-medium">Add New Test Case</h3>

      <div className="space-y-2">
        <Label htmlFor="test-name" className="mb-2 block">
          Test Name
        </Label>
        <input
          id="test-name"
          type="text"
          value={currentTestForm.name}
          onChange={(e) => onUpdateName(e.target.value)}
          className="px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter a name for this test case"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="metadata" className="mb-2 block">
          Test Metadata (JSON)
        </Label>
        <div className="min-h-[300px]">
          <JsonEditor
            value={currentTestForm.metadata}
            onChange={onUpdateMetadata}
            height="300px"
            showToolbar={true}
            enableStickyProperties={true}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Enter JSON metadata to test against this rule via API
        </p>
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <Switch
          id="expected-result"
          checked={currentTestForm.expectedResult}
          onCheckedChange={onUpdateExpected}
        />
        <Label htmlFor="expected-result">
          Rule should {currentTestForm.expectedResult ? "pass" : "fail"} for
          this data
        </Label>
      </div>

      <div className="flex justify-end">
        <Button onClick={onAddTest} type="button" className="flex items-center">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Test Case
        </Button>
      </div>
    </div>
  );
};

export default AddTestForm;
