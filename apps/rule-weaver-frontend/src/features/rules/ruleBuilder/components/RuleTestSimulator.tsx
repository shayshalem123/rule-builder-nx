import React, { useState } from "react";
import { RuleWithMeta, TestCase } from "@/features/rules/types/rule";
import { ruleEvaluationService } from "@/features/rules/services/ruleEvaluationService";
import { useMutation } from "@tanstack/react-query";
import { JsonData } from "./testSimulator/types";
import TestCaseList from "./testSimulator/TestCaseList";
import AddTestForm, { TestFormData } from "./testSimulator/AddTestForm";

interface RuleTestSimulatorProps {
  rule: RuleWithMeta;
  testCases: TestCase[];
  setTestCases: React.Dispatch<React.SetStateAction<TestCase[]>>;
  currentTestForm: TestFormData;
  setCurrentTestForm: React.Dispatch<React.SetStateAction<TestFormData>>;
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

  const removeTestCase = (id: string) => {
    setTestCases((prev) => prev.filter((test) => test.id !== id));
  };

  const runTest = (testId: string) => {
    try {
      const testToRun = testCases.find((test) => test.id === testId);
      if (!testToRun) return;

      setTestCases((prev) =>
        prev.map((test) =>
          test.id === testId ? { ...test, isRunning: true } : test
        )
      );

      evaluateRuleMutation.mutate({
        testId,
        metadata: testToRun.metadata as unknown as JsonData,
      });
    } catch (err) {
      console.error("Error running test:", err);

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

  const runAllTests = () => {
    testCases.forEach((test) => {
      runTest(test.id);
    });
  };

  const updateCurrentTestMetadata = (data: Record<string, unknown>) => {
    setCurrentTestForm((prev) => ({ ...prev, metadata: data }));

    if (parseError) setParseError(null);
  };

  const updateCurrentTestExpected = (expected: boolean) => {
    setCurrentTestForm((prev) => ({ ...prev, expectedResult: expected }));
  };

  const updateTestName = (name: string) => {
    setCurrentTestForm((prev) => ({ ...prev, name }));
    if (parseError) setParseError(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Rule Test Simulator</h2>

        <TestCaseList
          testCases={testCases}
          onRunTest={runTest}
          onRemoveTest={removeTestCase}
          onRunAllTests={runAllTests}
        />

        <AddTestForm
          currentTestForm={currentTestForm}
          onUpdateName={updateTestName}
          onUpdateMetadata={updateCurrentTestMetadata}
          onUpdateExpected={updateCurrentTestExpected}
          onAddTest={addTestCase}
          parseError={parseError}
        />
      </div>
    </div>
  );
};

export default RuleTestSimulator;
