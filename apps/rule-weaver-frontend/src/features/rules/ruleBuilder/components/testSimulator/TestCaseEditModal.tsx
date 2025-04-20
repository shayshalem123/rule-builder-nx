import React, { useState } from "react";
import { TestCase } from "@/features/rules/types/rule";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/inputs/dialog";
import { Button } from "@/shared/components/inputs/button";
import { Label } from "@/shared/components/inputs/label";
import { AlertTriangleIcon } from "lucide-react";
import JsonEditor from "@/shared/components/jsonEditor/JsonEditor";
import PassFailToggle from "./PassFailToggle";

interface TestCaseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  testCase: TestCase | null;
  onSave: (updatedTest: Omit<TestCase, "id" | "isRunning" | "result">) => void;
}

const TestCaseEditModal: React.FC<TestCaseEditModalProps> = ({
  isOpen,
  onClose,
  testCase,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [metadata, setMetadata] = useState<Record<string, unknown>>({});
  const [expectedResult, setExpectedResult] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize form when modal opens with a test case
  React.useEffect(() => {
    if (testCase && isOpen) {
      setName(testCase.name);
      setMetadata(testCase.metadata);
      setExpectedResult(testCase.expectedResult);
      setError(null);
    }
  }, [testCase, isOpen]);

  const handleSave = () => {
    if (!name.trim()) {
      setError("Please provide a test name");
      return;
    }

    try {
      onSave({
        name,
        metadata,
        expectedResult,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (!testCase) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Test Case</DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-center">
              <AlertTriangleIcon className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-test-name" className="mb-2 block">
              Test Name
            </Label>
            <input
              id="edit-test-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              className="px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter a name for this test case"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-metadata" className="mb-2 block">
              Test Metadata (JSON)
            </Label>
            <div className="min-h-[300px]">
              <JsonEditor
                value={metadata}
                onChange={(data) => {
                  setMetadata(data);
                  if (error) setError(null);
                }}
                height="300px"
                showToolbar={true}
                enableStickyProperties={true}
              />
            </div>
          </div>

          <PassFailToggle
            value={expectedResult}
            onChange={setExpectedResult}
            className="my-6"
          />
        </div>

        <DialogFooter className="flex justify-end space-x-2 mt-6">
          <Button onClick={onClose} type="button" variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} type="button">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestCaseEditModal;
