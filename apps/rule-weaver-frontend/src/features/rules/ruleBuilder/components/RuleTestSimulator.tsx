import React, { useState } from "react";
import { RuleWithMeta } from "@/features/rules/types/rule";
import { Button } from "@/shared/components/inputs/button";
import { Switch } from "@/shared/components/inputs/switch";
import { Label } from "@/shared/components/inputs/label";
import { AlertTriangleIcon, CheckIcon, XIcon, Loader2 } from "lucide-react";
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
}

// Default sample metadata
const DEFAULT_METADATA = { metadata: { name: "" } };

const RuleTestSimulator: React.FC<RuleTestSimulatorProps> = ({ rule }) => {
  // State for custom test data and expected result
  const [customTestData, setCustomTestData] =
    useState<Record<string, unknown>>(DEFAULT_METADATA);
  const [customTestExpected, setCustomTestExpected] = useState<boolean>(true);
  const [parseError, setParseError] = useState<string | null>(null);

  // Use React Query's useMutation hook for rule evaluation
  const evaluateRuleMutation = useMutation({
    mutationFn: async (metadata: JsonData) => {
      return ruleEvaluationService.evaluateRule(rule, metadata);
    },
    onError: (error) => {
      console.error("Error evaluating rule:", error);
    },
  });

  // Function to run custom test with user-provided data
  const runCustomTest = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation();

    // Clear any previous parse errors
    setParseError(null);

    try {
      // JsonEditor already provides parsed JSON objects, so no need to parse
      const metadata = customTestData as unknown as JsonData;

      // Call the mutation function
      evaluateRuleMutation.mutate(metadata);
    } catch (err) {
      // Handle errors
      console.error("Error running test:", err);
      setParseError(err instanceof Error ? err.message : "An error occurred");

      // Reset mutation state to clear any previous results
      evaluateRuleMutation.reset();
    }
  };

  // Update custom test data
  const updateCustomTestData = (data: Record<string, unknown>) => {
    setCustomTestData(data);
    // Clear parse error when input changes
    if (parseError) setParseError(null);
  };

  // Update expected test result
  const updateCustomTestExpected = (expected: boolean) => {
    setCustomTestExpected(expected);
  };

  // Determine if there's a test result to show
  const hasTestResult = evaluateRuleMutation.isSuccess;
  const testPassed = evaluateRuleMutation.data?.passed;

  // Show either parse error or mutation error
  const showError = parseError || evaluateRuleMutation.isError;
  const errorMessage =
    parseError ||
    (evaluateRuleMutation.error instanceof Error
      ? evaluateRuleMutation.error.message
      : "An error occurred while evaluating the rule");

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Rule Test Simulator</h2>
        <div className="space-y-4">
          {showError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-center">
              <AlertTriangleIcon className="h-5 w-5 mr-2" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="metadata" className="mb-2 block">
              Test Metadata (JSON)
            </Label>
            <div className="min-h-[300px]">
              <JsonEditor
                value={customTestData}
                onChange={updateCustomTestData}
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
              checked={customTestExpected}
              onCheckedChange={updateCustomTestExpected}
            />
            <Label htmlFor="expected-result">
              Rule should {customTestExpected ? "pass" : "fail"} for this data
            </Label>
          </div>

          {hasTestResult && (
            <div
              className={`mt-4 p-4 rounded-md ${
                testPassed
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              <div className="flex items-center">
                {testPassed ? (
                  <CheckIcon className="h-5 w-5 mr-2" />
                ) : (
                  <XIcon className="h-5 w-5 mr-2" />
                )}
                <span className="font-semibold">
                  API: Rule {testPassed ? "passed" : "failed"} for the given
                  data
                </span>
              </div>
              <div className="mt-2 text-sm">
                {testPassed === customTestExpected ? (
                  <span className="text-green-700">
                    ✓ This matches your expected result
                  </span>
                ) : (
                  <span className="text-red-700">
                    ✗ This does not match your expected result
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={runCustomTest}
              disabled={evaluateRuleMutation.isPending}
              type="button"
            >
              {evaluateRuleMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Run API Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleTestSimulator;
