import React from "react";
import { TestCase } from "@/features/rules/types/rule";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/inputs/dialog";
import { Button } from "@/shared/components/inputs/button";
import { CheckIcon, XIcon, FileJson } from "lucide-react";
import JsonEditor from "@/shared/components/jsonEditor/JsonEditor";

interface TestCaseViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  testCase: TestCase | null;
}

const TestCaseViewModal: React.FC<TestCaseViewModalProps> = ({
  isOpen,
  onClose,
  testCase,
}) => {
  if (!testCase) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <span className="mr-2">{testCase.name}</span>
            {testCase.result && (
              <>
                {testCase.result.isSuccess &&
                testCase.result.passed === testCase.expectedResult ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckIcon className="h-3 w-3 mr-1" />
                    Success
                  </span>
                ) : testCase.result.isSuccess ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XIcon className="h-3 w-3 mr-1" />
                    Failed
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Error
                  </span>
                )}
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <FileJson className="h-4 w-4 mr-2" />
              Metadata
            </h4>
            <div className="border rounded-md">
              <JsonEditor
                value={testCase.metadata}
                onChange={() => {}}
                height="300px"
                readOnly={true}
                showToolbar={false}
              />
            </div>
          </div>

          <div className="text-sm text-gray-700">
            <p className="mb-1">
              <span className="font-medium">Expected Result:</span>{" "}
              {testCase.expectedResult ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Pass
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Fail
                </span>
              )}
            </p>

            {testCase.result && testCase.result.error && (
              <p className="mb-1">
                <span className="font-medium">Error:</span>{" "}
                <span className="text-red-600">{testCase.result.error}</span>
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} type="button">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestCaseViewModal;
