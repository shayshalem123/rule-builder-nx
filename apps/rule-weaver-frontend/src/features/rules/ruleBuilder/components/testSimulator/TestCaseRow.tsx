import React from "react";
import { TestCase } from "@/features/rules/types/rule";
import { Button } from "@/shared/components/inputs/button";
import { CheckIcon, XIcon, Loader2, PlayIcon, TrashIcon } from "lucide-react";

// Props for TestCaseRow component
export interface TestCaseRowProps {
  test: TestCase;
  onRun: (id: string) => void;
  onRemove: (id: string) => void;
}

// Component for a single test case row
const TestCaseRow: React.FC<TestCaseRowProps> = ({ test, onRun, onRemove }) => {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {test.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {test.expectedResult ? "Pass" : "Fail"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {test.isRunning ? (
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        ) : test.result ? (
          <div className="flex items-center">
            {test.result.isSuccess ? (
              <>
                {test.result.passed === test.expectedResult ? (
                  <>
                    <CheckIcon className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600">Success</span>
                  </>
                ) : (
                  <>
                    <XIcon className="h-4 w-4 text-red-600 mr-1" />
                    <span className="text-red-600">Failed</span>
                  </>
                )}
              </>
            ) : (
              <span className="text-red-600">
                {test.result.error || "Error"}
              </span>
            )}
          </div>
        ) : (
          <span className="text-gray-400">Not run</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex space-x-2">
          <Button
            onClick={() => onRun(test.id)}
            disabled={test.isRunning}
            size="sm"
            className="px-2 py-1"
          >
            <PlayIcon className="h-3 w-3 mr-1" />
            Run
          </Button>
          <Button
            onClick={() => onRemove(test.id)}
            variant="destructive"
            size="sm"
            className="px-2 py-1"
          >
            <TrashIcon className="h-3 w-3" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default TestCaseRow;
