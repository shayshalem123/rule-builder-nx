import React from "react";
import { TestCase } from "@/features/rules/types/rule";
import { Button } from "@/shared/components/inputs/button";
import TestCaseRow from "./TestCaseRow";
import { PlayIcon, ClipboardList } from "lucide-react";

// Props for TestCaseList component
export interface TestCaseListProps {
  testCases: TestCase[];
  onRunTest: (id: string) => void;
  onRemoveTest: (id: string) => void;
  onEditTest: (id: string) => void;
  onRunAllTests: () => void;
  onUpdateTest: (id: string, updatedData: Partial<TestCase>) => void;
}

// Component for displaying the list of test cases
const TestCaseList: React.FC<TestCaseListProps> = ({
  testCases,
  onRunTest,
  onRemoveTest,
  onEditTest,
  onRunAllTests,
  onUpdateTest,
}) => {
  if (testCases.length === 0) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-md mr-3">
            <ClipboardList className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Test Cases</h3>
        </div>
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

      <div className="border rounded-lg overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr className="relative">
              <th className="px-6 pr-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-2/5">
                Name
              </th>
              <th className="pl-0 pr-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider w-1/5">
                <span className="-ml-10">Result</span>
              </th>
              <th className="px-6 py-3 w-auto"></th>
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
                onUpdate={onUpdateTest}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestCaseList;
