import { RuleType, RuleWithMeta } from "@/features/rules/types/rule";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Define a type for metadata
type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];
type JsonData = { [key: string]: JsonValue };

interface EvaluationRequest {
  rule: RuleType;
  metadata: JsonData;
}

interface EvaluationResponse {
  passed: boolean;
  ruleId?: string;
  ruleName?: string;
}

// Mock rule evaluation service
export const ruleEvaluationService = {
  // Evaluate a rule against provided metadata
  evaluateRule: async (
    rule: RuleWithMeta,
    metadata: JsonData
  ): Promise<EvaluationResponse> => {
    // Simulate API delay
    await delay(500);

    try {
      // This is a mock implementation that will be replaced by a real API call
      // For simple rules, we can do some basic evaluation as a placeholder
      const request: EvaluationRequest = {
        rule: rule.rule,
        metadata,
      };

      console.log("Mock API Request:", request);

      // Simulate a random response for demonstration purposes
      // In a real implementation, this would make an actual API call
      const passed = Math.random() > 0.5;

      // Return the evaluation result
      return {
        passed,
        ruleId: rule.id,
        ruleName: rule.name,
      };
    } catch (error) {
      console.error("Error evaluating rule:", error);
      throw new Error("Failed to evaluate rule");
    }
  },

  // Batch evaluate multiple test cases
  batchEvaluate: async (
    rule: RuleWithMeta,
    testCases: Array<{ metadata: JsonData; expectedResult: boolean }>
  ): Promise<{
    results: Array<{
      metadata: JsonData;
      passed: boolean;
      expectedResult: boolean;
      isCorrect: boolean;
    }>;
    passedTests: number;
    failedTests: number;
    totalTests: number;
  }> => {
    // Simulate API delay
    await delay(1000);

    try {
      // Process each test case with a simulated result
      const results = await Promise.all(
        testCases.map(async (testCase) => {
          // Simulate individual evaluation
          await delay(100);

          // For mock purposes, randomly determine if it passes or fails
          // In reality, this would call the actual evaluation endpoint
          const passed = Math.random() > 0.5;

          return {
            metadata: testCase.metadata,
            passed,
            expectedResult: testCase.expectedResult,
            isCorrect: passed === testCase.expectedResult,
          };
        })
      );

      // Calculate summary stats
      const passedTests = results.filter((r) => r.isCorrect).length;
      const failedTests = results.length - passedTests;

      return {
        results,
        passedTests,
        failedTests,
        totalTests: results.length,
      };
    } catch (error) {
      console.error("Error batch evaluating rules:", error);
      throw new Error("Failed to batch evaluate rules");
    }
  },
};
