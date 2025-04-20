import React from "react";
import { TestCase } from "@/features/rules/types/rule";
import { Button } from "@/shared/components/inputs/button";
import {
  CheckIcon,
  XIcon,
  Loader2,
  PlayIcon,
  Trash2,
  Edit,
} from "lucide-react";

// Props for TestCaseRow component
export interface TestCaseRowProps {
  test: TestCase;
  onRun: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
}

// Component for a single test case row
const TestCaseRow: React.FC<TestCaseRowProps> = ({
  test,
  onRun,
  onRemove,
  onEdit,
}) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/3">
        {test.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-1/5">
        {test.expectedResult ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Pass
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Fail
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm w-1/4">
        {test.isRunning ? (
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        ) : test.result ? (
          <div className="flex items-center">
            {test.result.isSuccess ? (
              <>
                {test.result.passed === test.expectedResult ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckIcon className="h-3 w-3 mr-1" />
                    Success
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XIcon className="h-3 w-3 mr-1" />
                    Failed
                  </span>
                )}
              </>
            ) : (
              <span className="text-red-600">
                {test.result.error || "Error"}
              </span>
            )}
          </div>
        ) : (
          <span className="text-gray-400 italic">Not run</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-auto">
        <div className="flex justify-end space-x-2">
          <Button
            onClick={() => onRun(test.id)}
            disabled={test.isRunning}
            size="sm"
            variant="ghost"
            className="h-8 px-2"
            type="button"
          >
            <PlayIcon className="h-4 w-4 mr-1" />
            Run
          </Button>
          <Button
            onClick={() => onEdit(test.id)}
            size="sm"
            variant="ghost"
            className="h-8 px-2"
            type="button"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            onClick={() => onRemove(test.id)}
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
            type="button"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default TestCaseRow;
