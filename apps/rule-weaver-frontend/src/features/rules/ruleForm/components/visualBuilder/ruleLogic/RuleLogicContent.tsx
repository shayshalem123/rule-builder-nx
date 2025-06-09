import React from 'react';
import { RuleType } from '@/features/rules/types/rule';
import * as ruleUtils from '@/features/rules/shared/utils/ruleUtils';
import BaseRuleComponent from './baseRule/BaseRuleComponent';
import GroupRuleComponent from './groupRule/GroupRuleComponent';

interface RuleLogicContentProps {
  ruleLogic: RuleType;
  onRuleChange: (rule: RuleType) => void;
  category: string;
  className?: string;
}

export const RuleLogicContent: React.FC<RuleLogicContentProps> = ({
  ruleLogic,
  onRuleChange,
  category,
  className,
}) => {
  return (
    <div className={className}>
      {ruleUtils.isBaseRule(ruleLogic) ? (
        <BaseRuleComponent
          rule={ruleLogic}
          onChange={onRuleChange}
          showDelete={false}
          category={category}
        />
      ) : (
        <GroupRuleComponent
          rule={ruleLogic}
          onChange={onRuleChange}
          category={category}
        />
      )}
    </div>
  );
};
