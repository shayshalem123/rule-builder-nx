import React, { useState, useMemo } from "react";
import { TestCase } from "@/features/rules/types/rule";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/shared/components/inputs/dialog";
import { Button } from "@/shared/components/inputs/button";
import { Label } from "@/shared/components/inputs/label";
import { AlertTriangleIcon } from "lucide-react";
import JsonEditor from "@/shared/components/jsonEditor/JsonEditor";
import PassFailToggle from "./PassFailToggle";
import { SchemaDefinition } from "@/features/schemas/types/schema";

interface TestCaseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  testCase: TestCase | null;
  onSave: (updatedTest: Omit<TestCase, "id" | "isRunning" | "result">) => void;
  schema?: SchemaDefinition | null;
}

const TestCaseEditModal: React.FC<TestCaseEditModalProps> = ({
  isOpen,
  onClose,
  testCase,
  onSave,
  schema = null,
}) => {
  const [name, setName] = useState("");
  const [metadata, setMetadata] = useState<Record<string, unknown>>({});
  const [expectedResult, setExpectedResult] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create a proper JSON Schema for validation
  const validationSchema = useMemo(() => {
    if (!schema) return undefined;

    return {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: schema.properties ?? {},
      required: schema.required ?? [],
      additionalProperties: schema.additionalProperties,
    };
  }, [schema]);

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
        <div className="bg-background-primary rounded-lg border border-border-primary shadow-sm p-6 space-y-6 my-2">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-center">
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
              className="px-3 py-2 w-full border border-border-primary rounded-md shadow-sm focus:outline-none focus:ring-info focus:border-info"
              placeholder="Enter a name for this test case"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-metadata" className="mb-2 block">
              Test Metadata (JSON)
            </Label>
            <p className="text-sm text-text-primary">
              Enter JSON metadata to test against this rule via API
            </p>
            <div className="min-h-[300px] bg-background-secondary border border-border-primary rounded-md overflow-hidden">
              <JsonEditor
                value={metadata}
                onChange={(data) => {
                  setMetadata(data);
                  if (error) setError(null);
                }}
                height="300px"
                showToolbar={true}
                enableStickyProperties={true}
                jsonSchema={validationSchema}
              />
            </div>
          </div>

          <PassFailToggle
            value={expectedResult}
            onChange={setExpectedResult}
            className="my-4"
          />
        </div>

        <DialogFooter className="flex justify-end space-x-2 mt-4">
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
