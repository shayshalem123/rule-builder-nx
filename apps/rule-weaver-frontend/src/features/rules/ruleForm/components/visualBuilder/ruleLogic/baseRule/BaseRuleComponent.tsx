import React, { useState } from 'react';
import { BaseRule, AndRule, OrRule } from '@/features/rules/types/rule';
import {
  createEmptyAndRule,
  createEmptyOrRule,
} from '@/features/rules/shared/utils/ruleUtils';
import BaseRuleForm from './BaseRuleForm';
import RuleActions from './RuleActions';

interface BaseRuleComponentProps {
  rule: BaseRule;
  onChange: (updatedRule: BaseRule | AndRule | OrRule) => void;
  onValidationChange?: (isValid: boolean) => void;
  onDelete?: () => void;
  showDelete?: boolean;
  parentGroupType?: 'AND' | 'OR' | null;
  category?: string;
  destination?: string;
}

const BaseRuleComponent: React.FC<BaseRuleComponentProps> = ({
  rule,
  onChange,
  onDelete,
  onValidationChange,
  showDelete = true,
  parentGroupType = null,
  category,
  destination,
}) => {
  const [isValid, setIsValid] = useState(true);

  const handleConvertToGroup = (type: 'AND' | 'OR') => {
    const currentRuleCopy = { ...rule };

    if (type === 'AND') {
      const andRule = createEmptyAndRule();
      andRule.AND[0] = currentRuleCopy;
      onChange(andRule);
    } else {
      const orRule = createEmptyOrRule();
      orRule.OR[0] = currentRuleCopy;
      onChange(orRule);
    }
  };

  const handleValidationChange = (valid: boolean) => {
    setIsValid(valid);
    if (onValidationChange) {
      onValidationChange(valid);
    }
  };

  return (
    <div
      className={`p-3 rounded-md border shadow-sm animate-fade-in w-full transition-colors duration-200 ${
        isValid ? 'bg-white border-border-primary' : 'bg-red-50 border-red-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-grow">
          <BaseRuleForm
            rule={rule}
            onChange={onChange}
            category={category}
            destination={destination}
            onValidationChange={handleValidationChange}
          />
        </div>
        <div className="pt-6">
          <RuleActions
            onConvertToGroup={handleConvertToGroup}
            onDelete={onDelete}
            showDelete={showDelete}
            parentGroupType={parentGroupType}
          />
        </div>
      </div>
    </div>
  );
};

export default BaseRuleComponent;
