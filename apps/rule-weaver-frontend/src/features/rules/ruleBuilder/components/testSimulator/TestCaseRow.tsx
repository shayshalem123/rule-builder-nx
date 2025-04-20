import React, { useState } from "react";
import { TestCase } from "@/features/rules/types/rule";
import { Button } from "@/shared/components/inputs/button";
import {
  CheckIcon,
  XIcon,
  Loader2,
  PlayIcon,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import TestCaseViewModal from "./TestCaseViewModal";
import TestCaseEditModal from "./TestCaseEditModal";

// Props for TestCaseRow component
export interface TestCaseRowProps {
  test: TestCase;
  onRun: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
  onUpdate: (id: string, updatedData: Partial<TestCase>) => void;
}

// Component for a single test case row
const TestCaseRow: React.FC<TestCaseRowProps> = ({
  test,
  onRun,
  onRemove,
  onEdit,
  onUpdate,
}) => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleRowClick = (e: React.MouseEvent) => {
    // Only open modal if the click didn't occur on a button
    if (!(e.target as HTMLElement).closest("button")) {
      setShowViewModal(true);
    }
  };

  const handleSaveEdit = (
    updatedTest: Omit<TestCase, "id" | "isRunning" | "result">
  ) => {
    // Update the test with new data via the parent component
    onUpdate(test.id, updatedTest);
    setShowEditModal(false);
  };

  return (
    <>
      <tr
        className="hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={handleRowClick}
      >
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
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click
                setShowViewModal(true);
              }}
              size="sm"
              variant="ghost"
              className="h-8 px-2"
              type="button"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click
                onRun(test.id);
              }}
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
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click
                setShowEditModal(true);
              }}
              size="sm"
              variant="ghost"
              className="h-8 px-2"
              type="button"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click
                onRemove(test.id);
              }}
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

      {/* Test Case View Modal */}
      <TestCaseViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        testCase={test}
      />

      {/* Test Case Edit Modal */}
      <TestCaseEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        testCase={test}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default TestCaseRow;
