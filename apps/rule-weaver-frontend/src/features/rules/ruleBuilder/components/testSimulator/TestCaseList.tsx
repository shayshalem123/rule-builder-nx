import React from "react";
import { TestCase } from "@/features/rules/types/rule";
import { Button } from "@/shared/components/inputs/button";
import TestCaseRow from "./TestCaseRow";

// Props for TestCaseList component
export interface TestCaseListProps {
  testCases: TestCase[];
  onRunTest: (id: string) => void;
  onRemoveTest: (id: string) => void;
  onRunAllTests: () => void;
}

// Component for displaying the list of test cases
const TestCaseList: React.FC<TestCaseListProps> = ({
  testCases,
  onRunTest,
  onRemoveTest,
  onRunAllTests,
}) => {
  if (testCases.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-md font-medium mb-3">Test Cases</h3>
      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expected
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Result
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-3">
        <Button onClick={onRunAllTests} type="button" className="ml-2">
          Run All Tests
        </Button>
      </div>
    </div>
  );
};

export default TestCaseList;
