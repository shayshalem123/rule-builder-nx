import {
  BaseRule,
  RuleType,
  AndRule,
  OrRule,
  Operator,
  Rule,
  RuleWithMeta,
} from '@/features/rules/types/rule';
import { RuleFormValues } from '@/features/rules/ruleForm/hooks/useRuleForm';

// Check if a rule is a base rule (with field, operator, value)
export const isBaseRule = (rule: RuleType): rule is BaseRule => {
  return 'field' in rule && 'operator' in rule && 'value' in rule;
};

// Check if a rule is an AND rule
export const isAndRule = (rule: RuleType): rule is AndRule => {
  return 'AND' in rule;
};

// Check if a rule is an OR rule
export const isOrRule = (rule: RuleType): rule is OrRule => {
  return 'OR' in rule;
};

// Get the type of a rule as a string
export const getRuleType = (rule: RuleType): 'BASE' | 'AND' | 'OR' => {
  if (isBaseRule(rule)) return 'BASE';
  if (isAndRule(rule)) return 'AND';
  if (isOrRule(rule)) return 'OR';
  throw new Error('Unknown rule type');
};

// Create a new empty base rule
export const createEmptyBaseRule = (): BaseRule => ({
  field: '',
  operator: 'EQUALS',
  value: '',
});

// Create a new empty AND rule
export const createEmptyAndRule = (): AndRule => ({
  AND: [createEmptyBaseRule()],
});

// Create a new empty OR rule
export const createEmptyOrRule = (): OrRule => ({
  OR: [createEmptyBaseRule()],
});

// Create a new empty rule with metadata
export const createEmptyRule = (
  ruleType: RuleType = createEmptyBaseRule()
): Omit<Rule, 'permittedActions'> => ({
  name: '',
  description: '',
  destination: '', // Default destination
  category: '', // Default category
  type: '',
  rule: ruleType,
});

// Deep clone a rule
export const cloneRule = (rule: RuleType): RuleType => {
  return JSON.parse(JSON.stringify(rule));
};

// List of available operators
export const operators: { value: Operator; label: string }[] = [
  { value: 'EQUALS', label: 'Equals' },
  { value: 'NOT_EQUALS', label: 'Not Equals' },
  { value: 'IN', label: 'In' },
];

// Group rules by destination
export const getGroupedRulesByDestination = (
  rules: RuleWithMeta[]
): Record<string, RuleWithMeta[]> => {
  return rules.reduce<Record<string, RuleWithMeta[]>>((acc, rule) => {
    const destination = rule.destination;
    if (!acc[destination]) {
      acc[destination] = [];
    }
    acc[destination].push(rule);
    return acc;
  }, {});
};

/**
 * Creates a rule object by combining initialRule with current form values
 * Conditionally includes extraProperties only if they exist
 */
export const createRuleObjectFromValues = (
  currentValues: RuleFormValues,
  initialRule?: RuleWithMeta
): Record<string, unknown> => {
  return {
    ...initialRule,
    name: currentValues.name,
    description: currentValues.description,
    destination: currentValues.destination,
    category: currentValues.category,
    type: currentValues.type,
    rule: currentValues.rule,
    ...(currentValues.extraProperties
      ? { extraProperties: currentValues.extraProperties }
      : {}),
  };
};
