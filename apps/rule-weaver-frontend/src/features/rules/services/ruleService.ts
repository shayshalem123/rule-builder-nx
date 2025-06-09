import {
  RuleWithMeta,
  Rule,
  destinationOptions,
  categoryOptions,
  CategoriesInfoMap,
} from '@/features/rules/types/rule';
import { User } from '@/features/users/types/user';
import { mockRules } from './__mocks__/mockRules';
import { mockExtraPropertiesSchemas } from './__mocks__/mockExtraProperties';
import { mockCategoriesInfo } from './__mocks__/mockCategoriesInfo';

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API service
export const ruleService = {
  // Get all rules
  getRules: async (): Promise<RuleWithMeta[]> => {
    return [...mockRules];
  },

  // Get rule by ID
  getRule: async (id: string): Promise<RuleWithMeta | undefined> => {
    return mockRules.find((rule) => rule.id === id);
  },

  // Create new rule
  createRule: async (
    rule: Omit<Rule, 'id'>,
    user: User
  ): Promise<RuleWithMeta> => {
    const newRule: RuleWithMeta = {
      ...rule,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: { id: user.id, name: user.name },
      updatedBy: { id: user.id, name: user.name },
      permittedActions: ['read', 'write', 'delete'], // Creator gets all permissions
    };
    mockRules.push(newRule);
    return newRule;
  },

  // Update existing rule
  updateRule: async (
    id: string,
    rule: Omit<Rule, 'id'>,
    user: User
  ): Promise<RuleWithMeta> => {
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
    const index = mockRules.findIndex((rule) => rule.id === id);
    if (index === -1) {
      throw new Error(`Rule with id ${id} not found`);
    }
    mockRules.splice(index, 1);
  },

  // Get available destination options
  getDestinations: async (): Promise<string[]> => {
    return [...destinationOptions];
  },

  // Get available category options
  getCategories: async (): Promise<string[]> => {
    return [...categoryOptions];
  },

  // Get extra properties schemas for all category-destination combinations
  getExtraPropertiesSchemas: async (): Promise<
    Record<string, Record<string, object>>
  > => {
    return { ...mockExtraPropertiesSchemas };
  },

  // Get categories info with destinations and extra properties
  getCategoriesInfo: async (): Promise<CategoriesInfoMap> => {
    return { ...mockCategoriesInfo };
  },
};
