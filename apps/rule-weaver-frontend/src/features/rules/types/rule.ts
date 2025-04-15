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
