import { useState } from "react";
import { RuleWithMeta } from "@/features/rules/types/rule";
import { ruleEvaluationService } from "@/features/rules/services/ruleEvaluationService";

// Define a generic type for JSON data
type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];
type JsonData = { [key: string]: JsonValue };

interface TestResult {
  data: JsonData;
  passed: boolean;
  expectedToPass: boolean;
  isCorrect: boolean;
}

interface TestResults {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  results: TestResult[];
}

interface RuleTestProps {
  rule: RuleWithMeta;
}

export const useRuleTest = ({ rule }: RuleTestProps) => {
  const [customTestData, setCustomTestData] = useState("");
  const [customTestExpected, setCustomTestExpected] = useState<boolean>(true);
  const [customTestResult, setCustomTestResult] = useState<boolean | null>(
    null
  );
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to run custom test with user-provided data
  const runCustomTest = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation();
    setIsLoading(true);
    setError(null);

    try {
      // Parse custom test data
      const metadata = JSON.parse(customTestData) as JsonData;

      // Call the mock API service to evaluate the rule
      const response = await ruleEvaluationService.evaluateRule(rule, metadata);

      // Set the result
      setCustomTestResult(response.passed);
    } catch (err) {
      console.error("Error evaluating rule:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Invalid JSON data. Please check your input."
      );
      setCustomTestResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Run a batch of test cases
  const runBatchTests = async (
    testCases: Array<{ metadata: JsonData; expectedResult: boolean }>
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the mock API service to batch evaluate the rule
      const results = await ruleEvaluationService.batchEvaluate(
        rule,
        testCases
      );

      // Set the results
      setTestResults({
        totalTests: results.totalTests,
        passedTests: results.passedTests,
        failedTests: results.failedTests,
        results: results.results.map((r) => ({
          data: r.metadata,
          passed: r.passed,
          expectedToPass: r.expectedResult,
          isCorrect: r.isCorrect,
        })),
      });
    } catch (err) {
      console.error("Error batch evaluating rules:", err);
      setError(
        err instanceof Error ? err.message : "Failed to run batch tests"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Update custom test data
  const updateCustomTestData = (data: string) => {
    setCustomTestData(data);
  };

  // Update expected test result
  const updateCustomTestExpected = (expected: boolean) => {
    setCustomTestExpected(expected);
  };

  return {
    testResults,
    customTestData,
    customTestResult,
    customTestExpected,
    isLoading,
    error,
    runCustomTest,
    runBatchTests,
    updateCustomTestData,
    updateCustomTestExpected,
  };
};
