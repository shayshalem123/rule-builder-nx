import React, { useState } from "react";
import { TestCase } from "@/features/rules/types/rule";
import { Button } from "@/shared/components/inputs/button";
import { TableRow, TableCell } from "@/shared/components/inputs/table";
import {
  CheckIcon,
  XIcon,
  Loader2,
  PlayIcon,
  Trash2,
  Edit,
  Eye,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
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

  // Render the status badge based on test state
  const renderStatusBadge = () => {
    if (test.isRunning) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin text-blue-600" />
          Running...
        </span>
      );
    }

    if (!test.result) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200">
          <PlayIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
          Run
        </span>
      );
    }

    if (!test.result.isSuccess) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
          <AlertCircle className="h-3.5 w-3.5 mr-1.5 text-red-600" />
          Error
        </span>
      );
    }

    if (test.result.passed === test.expectedResult) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
          <ThumbsUp className="h-3.5 w-3.5 mr-1.5 text-green-600" />
          Pass
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
          <ThumbsDown className="h-3.5 w-3.5 mr-1.5 text-red-600" />
          Fail
        </span>
      );
    }
  };

  return (
    <>
      <TableRow
        className="hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={handleRowClick}
      >
        <TableCell className="px-6 pr-0 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/3 max-w-xs">
          <div
            className="truncate overflow-hidden max-w-full"
            title={test.name}
          >
            {test.name}
          </div>
        </TableCell>
        <TableCell className="pl-0 pr-6 py-4 whitespace-nowrap text-sm w-1/5">
          <div className="ml-2 flex justify-center items-center">
            {renderStatusBadge()}
          </div>
        </TableCell>
        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-auto min-w-[220px]">
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
        </TableCell>
      </TableRow>

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
