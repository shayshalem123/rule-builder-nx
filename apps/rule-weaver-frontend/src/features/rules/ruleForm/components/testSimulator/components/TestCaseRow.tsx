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
import { SchemaDefinition } from "@/features/schemas/types/schema";

// Props for TestCaseRow component
export interface TestCaseRowProps {
  test: TestCase;
  onRun: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
  onUpdate: (id: string, updatedData: Partial<TestCase>) => void;
  schema?: SchemaDefinition | null;
}

// Component for a single test case row
const TestCaseRow: React.FC<TestCaseRowProps> = ({
  test,
  onRun,
  onRemove,
  onEdit,
  onUpdate,
  schema = null,
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
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-info/10 text-info border border-info/30">
          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin text-info" />
          Running...
        </span>
      );
    }

    if (!test.result) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-background-primary text-text-primary border border-border-primary">
          <PlayIcon className="h-3.5 w-3.5 mr-1.5 text-text-muted" />
          Run
        </span>
      );
    }

    if (!test.result.isSuccess) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-destructive/10 text-destructive border border-destructive/30">
          <AlertCircle className="h-3.5 w-3.5 mr-1.5 text-destructive" />
          Error
        </span>
      );
    }

    if (test.result.passed === test.expectedResult) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-success/10 text-success border border-success/30">
          <ThumbsUp className="h-3.5 w-3.5 mr-1.5 text-success" />
          Pass
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-destructive/10 text-destructive border border-destructive/30">
          <ThumbsDown className="h-3.5 w-3.5 mr-1.5 text-destructive" />
          Fail
        </span>
      );
    }
  };

  return (
    <>
      <TableRow
        className="hover:bg-background-primary transition-colors cursor-pointer"
        onClick={handleRowClick}
      >
        <TableCell className="px-6 pr-0 py-4 whitespace-nowrap text-sm font-medium text-text-secondary w-1/3 max-w-xs">
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
        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-text-primary w-auto min-w-[220px]">
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
              className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
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
        schema={schema}
      />
    </>
  );
};

export default TestCaseRow;
