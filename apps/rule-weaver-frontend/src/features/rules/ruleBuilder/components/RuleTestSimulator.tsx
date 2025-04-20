import React, { useState } from "react";
import { RuleWithMeta, TestCase } from "@/features/rules/types/rule";
import { Button } from "@/shared/components/inputs/button";
import { Switch } from "@/shared/components/inputs/switch";
import { Label } from "@/shared/components/inputs/label";
import {
  AlertTriangleIcon,
  CheckIcon,
  XIcon,
  Loader2,
  PlusIcon,
  PlayIcon,
  TrashIcon,
} from "lucide-react";
import { ruleEvaluationService } from "@/features/rules/services/ruleEvaluationService";
import { useMutation } from "@tanstack/react-query";
import JsonEditor from "@/shared/components/jsonEditor/JsonEditor";

// Define a generic type for JSON data
type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];
type JsonData = { [key: string]: JsonValue };

interface RuleTestSimulatorProps {
  rule: RuleWithMeta;
  // Props for state management
  testCases: TestCase[];
  setTestCases: React.Dispatch<React.SetStateAction<TestCase[]>>;
  currentTestForm: {
    metadata: Record<string, unknown>;
    expectedResult: boolean;
    name: string;
  };
  setCurrentTestForm: React.Dispatch<
    React.SetStateAction<{
      metadata: Record<string, unknown>;
      expectedResult: boolean;
      name: string;
    }>
  >;
}

const RuleTestSimulator: React.FC<RuleTestSimulatorProps> = ({
  rule,
  testCases,
  setTestCases,
  currentTestForm,
  setCurrentTestForm,
}) => {
  // Local state for parse errors
  const [parseError, setParseError] = useState<string | null>(null);

  // Use React Query's useMutation hook for rule evaluation
  const evaluateRuleMutation = useMutation({
    mutationFn: async ({
      testId,
      metadata,
    }: {
      testId: string;
      metadata: JsonData;
    }) => {
      const result = await ruleEvaluationService.evaluateRule(rule, metadata);
      return { testId, result };
    },
    onError: (error) => {
      console.error("Error evaluating rule:", error);
    },
    onSuccess: ({ testId, result }) => {
      setTestCases((prev) =>
        prev.map((test) =>
          test.id === testId
            ? {
                ...test,
                result: {
                  passed: result.passed,
                  isSuccess: true,
                },
                isRunning: false,
              }
            : test
        )
      );
    },
  });

  // Function to add a new test case
  const addTestCase = () => {
    if (!currentTestForm.name.trim()) {
      setParseError("Please provide a test name");
      return;
    }

    try {
      const newTest: TestCase = {
        id: Date.now().toString(),
        name: currentTestForm.name,
        metadata: currentTestForm.metadata,
        expectedResult: currentTestForm.expectedResult,
        isRunning: false,
      };

      setTestCases((prev) => [...prev, newTest]);

      // Reset form for next test
      setCurrentTestForm({
        metadata: { metadata: { name: "" } },
        expectedResult: true,
        name: "",
      });
      setParseError(null);
    } catch (err) {
      console.error("Error adding test:", err);
      setParseError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Function to remove a test case
  const removeTestCase = (id: string) => {
    setTestCases((prev) => prev.filter((test) => test.id !== id));
  };

  // Function to run a single test
  const runTest = (testId: string) => {
    try {
      // Find the test
      const testToRun = testCases.find((test) => test.id === testId);
      if (!testToRun) return;

      // Mark test as running
      setTestCases((prev) =>
        prev.map((test) =>
          test.id === testId ? { ...test, isRunning: true } : test
        )
      );

      // Call the mutation function
      evaluateRuleMutation.mutate({
        testId,
        metadata: testToRun.metadata as unknown as JsonData,
      });
    } catch (err) {
      console.error("Error running test:", err);

      // Update test with error
      setTestCases((prev) =>
        prev.map((test) =>
          test.id === testId
            ? {
                ...test,
                result: {
                  passed: false,
                  isSuccess: false,
                  error:
                    err instanceof Error ? err.message : "An error occurred",
                },
                isRunning: false,
              }
            : test
        )
      );
    }
  };

  // Function to run all tests
  const runAllTests = () => {
    testCases.forEach((test) => {
      runTest(test.id);
    });
  };

  // Update current test data
  const updateCurrentTestMetadata = (data: Record<string, unknown>) => {
    setCurrentTestForm((prev) => ({ ...prev, metadata: data }));
    // Clear parse error when input changes
    if (parseError) setParseError(null);
  };

  // Update expected test result
  const updateCurrentTestExpected = (expected: boolean) => {
    setCurrentTestForm((prev) => ({ ...prev, expectedResult: expected }));
  };

  // Update test name
  const updateTestName = (name: string) => {
    setCurrentTestForm((prev) => ({ ...prev, name }));
    if (parseError) setParseError(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Rule Test Simulator</h2>

        {/* Test cases list */}
        {testCases.length > 0 && (
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
                    <tr key={test.id}>
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
                                    <span className="text-green-600">
                                      Success
                                    </span>
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
                            onClick={() => runTest(test.id)}
                            disabled={test.isRunning}
                            size="sm"
                            className="px-2 py-1"
                          >
                            <PlayIcon className="h-3 w-3 mr-1" />
                            Run
                          </Button>
                          <Button
                            onClick={() => removeTestCase(test.id)}
                            variant="destructive"
                            size="sm"
                            className="px-2 py-1"
                          >
                            <TrashIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-3">
              <Button onClick={runAllTests} type="button" className="ml-2">
                Run All Tests
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {parseError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-center">
              <AlertTriangleIcon className="h-5 w-5 mr-2" />
              <span>{parseError}</span>
            </div>
          )}

          <h3 className="text-md font-medium">Add New Test Case</h3>

          <div className="space-y-2">
            <Label htmlFor="test-name" className="mb-2 block">
              Test Name
            </Label>
            <input
              id="test-name"
              type="text"
              value={currentTestForm.name}
              onChange={(e) => updateTestName(e.target.value)}
              className="px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter a name for this test case"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metadata" className="mb-2 block">
              Test Metadata (JSON)
            </Label>
            <div className="min-h-[300px]">
              <JsonEditor
                value={currentTestForm.metadata}
                onChange={updateCurrentTestMetadata}
                height="300px"
                showToolbar={true}
                enableStickyProperties={true}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Enter JSON metadata to test against this rule via API
            </p>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Switch
              id="expected-result"
              checked={currentTestForm.expectedResult}
              onCheckedChange={updateCurrentTestExpected}
            />
            <Label htmlFor="expected-result">
              Rule should {currentTestForm.expectedResult ? "pass" : "fail"} for
              this data
            </Label>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={addTestCase}
              type="button"
              className="flex items-center"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Test Case
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleTestSimulator;
