export type Operator =
  | "EQUALS"
  | "NOT_EQUALS"
  | "CONTAINS"
  | "NOT_CONTAINS"
  | "GREATER_THAN"
  | "LESS_THAN";

export interface BaseRule {
  field: string;
  operator: Operator;
  value: string;
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
  rule: RuleType;
};
