import React from "react";
import { TestCase } from "@/features/rules/types/rule";
import { Button } from "@/shared/components/inputs/button";
import TestCaseRow from "./TestCaseRow";
import { PlayIcon } from "lucide-react";

// Props for TestCaseList component
export interface TestCaseListProps {
  testCases: TestCase[];
  onRunTest: (id: string) => void;
  onRemoveTest: (id: string) => void;
  onEditTest: (id: string) => void;
  onRunAllTests: () => void;
}

// Component for displaying the list of test cases
const TestCaseList: React.FC<TestCaseListProps> = ({
  testCases,
  onRunTest,
  onRemoveTest,
  onEditTest,
  onRunAllTests,
}) => {
  if (testCases.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-medium">Test Cases</h3>
        <Button
          onClick={onRunAllTests}
          type="button"
          variant="outline"
          className="flex items-center"
        >
          <PlayIcon className="h-4 w-4 mr-2" />
          Run All Tests
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Expected
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Result
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {testCases.map((test) => (
              <TestCaseRow
                key={test.id}
                test={test}
                onRun={onRunTest}
                onRemove={onRemoveTest}
                onEdit={onEditTest}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestCaseList;
