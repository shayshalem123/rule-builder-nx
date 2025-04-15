import React, { useState } from "react";
import {
  AndRule,
  OrRule,
  RuleType,
  BaseRule,
  Rules,
} from "@/features/rules/types/rule";
import {
  createEmptyBaseRule,
  createEmptyAndRule,
  createEmptyOrRule,
  isBaseRule,
  isAndRule,
  isOrRule,
} from "@/features/rules/utils/ruleUtils";
import GroupRuleHeader from "./GroupRuleHeader";
import GroupRuleContent from "./GroupRuleContent";
import GroupRuleActions from "./GroupRuleActions";
import { getGroupStyles } from "./groupStyles";
import BaseRuleComponent from "../baseRule";
import { Button } from "@/shared/components/inputs/button";
import { Plus } from "lucide-react";

interface GroupRuleComponentProps {
  rule: AndRule | OrRule;
  onChange: (updatedRule: AndRule | OrRule) => void;
  onDelete?: () => void;
}

const ruleMap: Record<Rules, () => RuleType> = {
  BASE: createEmptyBaseRule,
  AND: createEmptyAndRule,
  OR: createEmptyOrRule,
};

const GroupRuleComponent: React.FC<GroupRuleComponentProps> = ({
  rule,
  onChange,
  onDelete,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isAnd = isAndRule(rule);
  const rules = isAnd ? rule.AND : rule.OR;
  const groupType = isAnd ? "AND" : "OR";
  const { groupColor } = getGroupStyles(isAnd);

  const handleAddRule = (type: Rules) => {
    const newRules = [...rules, ruleMap[type]()];
    onChange(isAnd ? { ...rule, AND: newRules } : { ...rule, OR: newRules });
    // Auto-expand when adding a new rule
    if (isCollapsed) setIsCollapsed(false);
  };

  const handleRuleChange = (index: number, updatedRule: RuleType) => {
    const newRules = [...rules];
    newRules[index] = updatedRule;
    onChange(isAnd ? { ...rule, AND: newRules } : { ...rule, OR: newRules });
  };

  const handleRuleDelete = (index: number) => {
    if (rules.length <= 1) {
      onDelete?.();
      return;
    }

    const newRules = [...rules];
    newRules.splice(index, 1);
    onChange(isAnd ? { ...rule, AND: newRules } : { ...rule, OR: newRules });
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const renderRuleComponent = (nestedRule: RuleType, index: number) => {
    if (isBaseRule(nestedRule)) {
      return (
        <BaseRuleComponent
          key={index}
          rule={nestedRule}
          onChange={(updatedRule: BaseRule) =>
            handleRuleChange(index, updatedRule)
          }
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
  };

  const actionsComponent = (
    <GroupRuleActions
      isCollapsed={isCollapsed}
      isAnd={isAnd}
      groupType={groupType}
      onAddRule={handleAddRule}
      onDelete={onDelete}
    />
  );

  return (
    <div className={`rounded-lg border ${groupColor} animate-fade-in w-full`}>
      <GroupRuleHeader
        isCollapsed={isCollapsed}
        isAnd={isAnd}
        groupType={groupType}
        rulesCount={rules.length}
        toggleCollapse={toggleCollapse}
        handleAddRule={handleAddRule}
        onDelete={onDelete}
        actionsComponent={actionsComponent}
      />

      <GroupRuleContent
        isCollapsed={isCollapsed}
        rules={rules}
        groupType={groupType}
        renderRuleComponent={renderRuleComponent}
      />

      {!isCollapsed && (
        <div className="px-4 pb-4 flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() => handleAddRule("BASE")}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Condition
          </Button>
        </div>
      )}
    </div>
  );
};

export default GroupRuleComponent;
