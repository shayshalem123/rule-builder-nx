import { useCallback } from 'react';
import { AndRule, OrRule, RuleType, Rules } from '@/features/rules/types/rule';
import {
  createEmptyBaseRule,
  createEmptyAndRule,
  createEmptyOrRule,
} from '@/features/rules/shared/utils/ruleUtils';

const ruleMap: Record<Rules, () => RuleType> = {
  BASE: createEmptyBaseRule,
  AND: createEmptyAndRule,
  OR: createEmptyOrRule,
};

interface UseGroupRuleOperationsProps {
  rule: AndRule | OrRule;
  rules: RuleType[];
  isAnd: boolean;
  onChange: (updatedRule: AndRule | OrRule) => void;
  handleRuleValidationAfterDelete: (index: number) => {
    hasErrors: boolean;
    errorCount: number;
  };
  onDeleteGroup?: () => void;
  onValidationChange?: (hasErrors: boolean, errorCount: number) => void;
}

export const useGroupRuleOperations = ({
  rule,
  rules,
  isAnd,
  onChange,
  onDeleteGroup,
  handleRuleValidationAfterDelete,
  onValidationChange,
}: UseGroupRuleOperationsProps) => {
  const handleRuleChange = useCallback(
    (index: number, updatedRule: RuleType) => {
      const newRules = [...rules];
      newRules[index] = updatedRule;
      onChange(isAnd ? { ...rule, AND: newRules } : { ...rule, OR: newRules });
    },
    [isAnd, onChange, rule, rules]
  );

  const handleAddRule = useCallback(
    (type: Rules) => {
      const newRules = [...rules, ruleMap[type]()];
      onChange(isAnd ? { ...rule, AND: newRules } : { ...rule, OR: newRules });
    },
    [isAnd, onChange, rule, rules]
  );

  const handleRuleDelete = useCallback(
    (index: number) => {
      const newRules = [...rules];
      newRules.splice(index, 1);

      const validationResult = handleRuleValidationAfterDelete(index);

      onValidationChange?.(
        validationResult.hasErrors,
        validationResult.errorCount
      );

      onChange(isAnd ? { ...rule, AND: newRules } : { ...rule, OR: newRules });
    },
    [
      isAnd,
      onChange,
      rule,
      rules,
      handleRuleValidationAfterDelete,
      onValidationChange,
    ]
  );

  const handleRuleItemDelete = useCallback(
    (index: number) => {
      if (rules.length <= 1) return onDeleteGroup?.();

      handleRuleDelete(index);
    },
    [rules.length, onDeleteGroup, handleRuleDelete]
  );

  const handleGroupDelete = useCallback(() => {
    onDeleteGroup?.();
  }, [onDeleteGroup]);

  return {
    handleRuleChange,
    handleAddRule,
    handleRuleDelete,
    handleRuleItemDelete,
    handleGroupDelete,
  };
};
