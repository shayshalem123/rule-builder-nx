import React from "react";
import { TestCase } from "@/features/rules/types/rule";
import { Button } from "@/shared/components/inputs/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/shared/components/inputs/table";
import TestCaseRow from "./TestCaseRow";
import { PlayIcon, ClipboardList } from "lucide-react";
import { SchemaDefinition } from "@/features/schemas/types/schema";

// Props for TestCaseList component
export interface TestCaseListProps {
  testCases: TestCase[];
  onRunTest: (id: string) => void;
  onRemoveTest: (id: string) => void;
  onEditTest: (id: string) => void;
  onRunAllTests: () => void;
  onUpdateTest: (id: string, updatedData: Partial<TestCase>) => void;
  schema?: SchemaDefinition | null;
}

// Component for displaying the list of test cases
const TestCaseList: React.FC<TestCaseListProps> = ({
  testCases,
  onRunTest,
  onRemoveTest,
  onEditTest,
  onRunAllTests,
  onUpdateTest,
  schema = null,
}) => {
  if (testCases.length === 0) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-md mr-3">
            <ClipboardList className="h-5 w-5 text-info" />
          </div>
          <h3 className="text-lg font-semibold text-text-secondary">
            Test Cases
          </h3>
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
        <Table className="table-fixed">
          <TableHeader className="bg-accent">
            <TableRow className="relative">
              <TableHead className="px-6 pr-0 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider w-1/3 max-w-xs">
                Name
              </TableHead>
              <TableHead className="pl-0 pr-6 py-3 text-center text-xs font-medium text-text-primary uppercase tracking-wider w-1/5">
                <span className="ml-2">Result</span>
              </TableHead>
              <TableHead className="px-6 py-3 w-auto min-w-[220px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-background-secondary divide-y divide-border-primary">
            {testCases.map((test) => (
              <TestCaseRow
                key={test.id}
                test={test}
                onRun={onRunTest}
                onRemove={onRemoveTest}
                onEdit={onEditTest}
                onUpdate={onUpdateTest}
                schema={schema}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TestCaseList;
