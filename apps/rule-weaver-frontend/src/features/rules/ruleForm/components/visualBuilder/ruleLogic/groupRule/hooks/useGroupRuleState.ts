import { useMemo } from 'react';
import { AndRule, OrRule } from '@/features/rules/types/rule';
import { isAndRule } from '@/features/rules/shared/utils/ruleUtils';

export const useGroupRuleState = (rule: AndRule | OrRule) => {
  const isAnd = useMemo(() => isAndRule(rule), [rule]);

  const rules = useMemo(
    () => (isAnd ? (rule as AndRule).AND : (rule as OrRule).OR),
    [isAnd, rule]
  );

  const groupType = useMemo(
    () => (isAnd ? 'AND' : 'OR') as 'AND' | 'OR',
    [isAnd]
  );

  return {
    isAnd,
    rules,
    groupType,
  };
};
