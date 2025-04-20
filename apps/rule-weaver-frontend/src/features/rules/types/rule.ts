export type Operator = "EQUALS" | "NOT_EQUALS" | "IN";

export interface BaseRule {
  field: string;
  operator: Operator;
  value: string | string[];
}

export interface AndRule {
  AND: RuleType[];
}

export interface OrRule {
  OR: RuleType[];
}

export type RuleType = BaseRule | AndRule | OrRule;

export type Rules = "BASE" | "AND" | "OR";

export type RuleWithMeta = Rule & {
  createdAt?: string;
  updatedAt?: string;
  createdBy?: {
    id: string;
    name: string;
  };
  updatedBy?: {
    id: string;
    name: string;
  };
};

export type Rule = {
  id?: string;
  name: string;
  description?: string;
  destination: string;
  category: string;
  rule: RuleType;
};

export const destinationOptions = ["A", "B"];
export const categoryOptions = ["partners-images", "partners-algo"];

// Test case interface for rule testing
export interface TestCase {
  id: string;
  name: string;
  metadata: Record<string, unknown>;
  expectedResult: boolean;
  result?: {
    passed: boolean;
    isSuccess: boolean;
    error?: string;
  };
  isRunning: boolean;
}

// Default metadata for new test cases
export const DEFAULT_TEST_METADATA = { metadata: { name: "" } };
