
export type Operator = 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'NOT_CONTAINS' | 'GREATER_THAN' | 'LESS_THAN';

export interface BaseRule {
  id?: string;
  field: string;
  operator: Operator;
  value: string;
}

export interface AndRule {
  id?: string;
  AND: (RuleType)[];
}

export interface OrRule {
  id?: string;
  OR: (RuleType)[];
}

export type RuleType = BaseRule | AndRule | OrRule;

export type RuleWithMeta =  RuleType & {
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
