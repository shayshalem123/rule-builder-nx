
import React from 'react';
import { AndRule, OrRule, RuleType, BaseRule } from '@/features/rules/types/rule';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/inputs/button';
import BaseRuleComponent from './BaseRuleComponent';
import { createEmptyBaseRule, isBaseRule, isAndRule, isOrRule } from '@/features/rules/utils/ruleUtils';

interface GroupRuleComponentProps {
  rule: AndRule | OrRule;
  onChange: (updatedRule: AndRule | OrRule) => void;
  onDelete?: () => void;
}

const GroupRuleComponent: React.FC<GroupRuleComponentProps> = ({
  rule,
  onChange,
  onDelete,
}) => {
  const isAnd = isAndRule(rule);
  const rules = isAnd ? rule.AND : rule.OR;
  const groupType = isAnd ? 'AND' : 'OR';
  const groupColor = isAnd ? 'bg-rule-and/10 border-rule-and/30' : 'bg-rule-or/10 border-rule-or/30';
  const groupTextColor = isAnd ? 'text-rule-and' : 'text-rule-or';

  const handleAddRule = () => {
    const newRules = [...rules, createEmptyBaseRule()];
    onChange(
      isAnd ? { ...rule, AND: newRules } : { ...rule, OR: newRules }
    );
  };

  const handleRuleChange = (index: number, updatedRule: RuleType) => {
    const newRules = [...rules];
    newRules[index] = updatedRule;
    onChange(
      isAnd ? { ...rule, AND: newRules } : { ...rule, OR: newRules }
    );
  };

  const handleRuleDelete = (index: number) => {
    if (rules.length <= 1) {
      onDelete?.();
      return;
    }
    
    const newRules = [...rules];
    newRules.splice(index, 1);
    onChange(
      isAnd ? { ...rule, AND: newRules } : { ...rule, OR: newRules }
    );
  };

  return (
    <div className={`p-4 rounded-lg border ${groupColor} animate-fade-in`}>
      <div className="flex justify-between items-center mb-3">
        <div className={`font-medium ${groupTextColor}`}>
          {groupType} Group (all conditions {isAnd ? 'must' : 'can'} match)
        </div>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-gray-500 hover:text-red-500"
            title={`Delete ${groupType} group`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {rules.map((nestedRule, index) => {
          if (isBaseRule(nestedRule)) {
            return (
              <BaseRuleComponent
                key={index}
                rule={nestedRule}
                onChange={(updatedRule: BaseRule) => handleRuleChange(index, updatedRule)}
                onDelete={() => handleRuleDelete(index)}
              />
            );
          } else if (isAndRule(nestedRule) || isOrRule(nestedRule)) {
            return (
              <GroupRuleComponent
                key={index}
                rule={nestedRule}
                onChange={(updatedRule) => handleRuleChange(index, updatedRule)}
                onDelete={() => handleRuleDelete(index)}
              />
            );
          }
          return null;
        })}
      </div>

      <div className="mt-3 flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddRule}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Condition
        </Button>
      </div>
    </div>
  );
};

export default GroupRuleComponent;
