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

interface DocumentImpactResponse {
  affectedDocuments: number;
  totalDocuments: number;
  percentageImpact: number;
  sampleDocuments?: Array<{
    id: string;
    name: string;
    matched: boolean;
  }>;
}

// Keep a cache of simulated results for consistent responses
const documentImpactCache = new Map<string, DocumentImpactResponse>();

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

  // Evaluate document impact for a rule
  evaluateDocumentImpact: async (
    rule: RuleWithMeta,
    dateRange: string = "all"
  ): Promise<DocumentImpactResponse> => {
    // Simulate API delay (between 800-1200ms for realism)
    const delayTime = 800 + Math.floor(Math.random() * 400);
    await delay(delayTime);

    try {
      // Check if we have a cached result for this rule
      const cacheKey = `${rule.id || JSON.stringify(rule.rule)}_${dateRange}`;

      if (documentImpactCache.has(cacheKey)) {
        return documentImpactCache.get(cacheKey)!;
      }

      // In a real implementation, this would send the rule to a backend API
      // that would evaluate it against all documents in the system

      // For mock purposes, generate impact statistics based on rule complexity
      // to make it somewhat deterministic
      let ruleComplexity = 0;

      // Add complexity based on rule structure
      if (rule.rule) {
        const ruleString = JSON.stringify(rule.rule);
        // More complex rules generally have more conditions
        ruleComplexity = ruleString.length / 100;
      }

      // Adjust total documents based on date range
      let totalDocuments = 5000 + Math.floor(Math.random() * 5000);

      // Reduce document count for smaller time ranges
      switch (dateRange) {
        case "day":
          totalDocuments = Math.floor(totalDocuments * 0.1); // 10% of total
          break;
        case "week":
          totalDocuments = Math.floor(totalDocuments * 0.3); // 30% of total
          break;
        case "month":
          totalDocuments = Math.floor(totalDocuments * 0.7); // 70% of total
          break;
        default:
          // Use full count for "all"
          break;
      }

      // More complex rules tend to match fewer documents
      let affectedRatio = 0.5;
      if (ruleComplexity > 1) {
        affectedRatio = 1 / (ruleComplexity * 2);
      }

      const affectedDocuments = Math.floor(totalDocuments * affectedRatio);
      const percentageImpact = (affectedDocuments / totalDocuments) * 100;

      // Generate sample documents that would be affected
      const sampleSize = Math.min(5, affectedDocuments);
      const sampleDocuments = Array.from({ length: sampleSize }, (_, i) => ({
        id: `doc-${i + 1}`,
        name: `${rule.category || "Document"} Sample ${i + 1}`,
        matched: true,
      }));

      const response = {
        affectedDocuments,
        totalDocuments,
        percentageImpact,
        sampleDocuments,
      };

      // Cache the result for this rule
      documentImpactCache.set(cacheKey, response);

      return response;
    } catch (error) {
      console.error("Error evaluating document impact:", error);
      throw new Error("Failed to evaluate document impact");
    }
  },
};
