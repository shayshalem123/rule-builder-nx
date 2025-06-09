import { JsonSchema } from '../hooks/useExtraPropertiesSchemas';

export type Operator = 'EQUALS' | 'NOT_EQUALS' | 'IN';

export type PermittedAction = 'read' | 'write' | 'delete';

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

export type Rules = 'BASE' | 'AND' | 'OR';

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
  type: string;
  rule: RuleType;
  extraProperties?: Record<string, unknown>;
  permittedActions: PermittedAction[];
};

export const destinationOptions = ['A', 'B', 'C', 'D', 'E'];
export const categoryOptions = [
  'partners-images',
  'partners-algo',
  'data-processing',
];

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
export const DEFAULT_TEST_METADATA = { metadata: { name: '' } };

// Category metadata info type
export interface CategoryMetaInfo {
  category: string;
  extraProperties: Record<string, unknown>;
}

// Destination info type
export interface DestinationInfo {
  destination: string;
  categories: Array<{
    category: string;
    extraProperties: Record<string, unknown>;
  }>;
}

export type DestinationCategoryInfo = {
  destination: string;
  category: string;
  typeOptions: {
    fieldName: string;
    options: string[];
  };
  extraProperties: JsonSchema;
  validOperators?: Operator[];
};

export type CategoryInfo = {
  schemaId: string;
  destinations: Record<string, DestinationCategoryInfo>;
};

export type CategoriesInfoMap = Record<string, CategoryInfo>;
