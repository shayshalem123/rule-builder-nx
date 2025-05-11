import {
  RuleWithMeta,
  Rule,
  destinationOptions,
  categoryOptions,
} from "@/features/rules/types/rule";
import { User } from "@/features/users/types/user";

// Default user for mock data
const defaultUser = {
  id: "1",
  name: "Jane Doe",
};

// Initial mock data
const mockRules: RuleWithMeta[] = [
  {
    id: "1",
    name: "Simple Rule",
    description: "Basic metadata name equals hello rule",
    destination: "A",
    category: "partners-images",
    rule: {
      field: "metadata.name",
      operator: "EQUALS",
      value: "hello",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "2",
    name: "AND Rule Example",
    description: "Example of an AND rule with nested conditions",
    destination: "B",
    category: "partners-algo",
    rule: {
      AND: [
        {
          field: "metadata.name",
          operator: "EQUALS",
          value: "test",
        },
        {
          field: "metadata.namespace",
          operator: "EQUALS",
          value: "default",
        },
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "3",
    name: "OR Rule Example",
    description: "Example of an OR rule with nested conditions",
    destination: "A",
    category: "partners-algo",
    rule: {
      OR: [
        {
          field: "metadata.name",
          operator: "EQUALS",
          value: "app",
        },
        {
          field: "metadata.name",
          operator: "EQUALS",
          value: "service",
        },
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "4",
    name: "Complex Nested Rule",
    description: "A complex rule with multiple nested levels",
    destination: "B",
    category: "partners-images",
    rule: {
      AND: [
        {
          field: "metadata.namespace",
          operator: "EQUALS",
          value: "production",
        },
        {
          OR: [
            {
              field: "spec.replicas",
              operator: "NOT_EQUALS",
              value: "2",
            },
            {
              field: "metadata.labels.tier",
              operator: "EQUALS",
              value: "frontend",
            },
          ],
        },
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API service
export const ruleService = {
  // Get all rules
  getRules: async (): Promise<RuleWithMeta[]> => {
    await delay(500); // Simulate network delay
    return [...mockRules];
  },

  // Get rule by ID
  getRule: async (id: string): Promise<RuleWithMeta | undefined> => {
    await delay(300);
    return mockRules.find((rule) => rule.id === id);
  },

  // Create new rule
  createRule: async (
    rule: Omit<Rule, "id">,
    user: User
  ): Promise<RuleWithMeta> => {
    await delay(500);
    const newRule: RuleWithMeta = {
      ...rule,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: { id: user.id, name: user.name },
      updatedBy: { id: user.id, name: user.name },
    };
    mockRules.push(newRule);
    return newRule;
  },

  // Update existing rule
  updateRule: async (
    id: string,
    rule: Omit<Rule, "id">,
    user: User
  ): Promise<RuleWithMeta> => {
    await delay(500);
    const index = mockRules.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Rule with id ${id} not found`);
    }

    const updatedRule: RuleWithMeta = {
      ...rule,
      id,
      createdAt: mockRules[index].createdAt,
      createdBy: mockRules[index].createdBy,
      updatedAt: new Date().toISOString(),
      updatedBy: { id: user.id, name: user.name },
    };

    mockRules[index] = updatedRule;
    return updatedRule;
  },

  // Delete rule
  deleteRule: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockRules.findIndex((rule) => rule.id === id);
    if (index === -1) {
      throw new Error(`Rule with id ${id} not found`);
    }
    mockRules.splice(index, 1);
  },

  // Get available destination options
  getDestinations: async (): Promise<string[]> => {
    await delay(300);
    return [...destinationOptions];
  },

  // Get available category options
  getCategories: async (): Promise<string[]> => {
    await delay(300);
    return [...categoryOptions];
  },
};
