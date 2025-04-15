import React from "react";
import {
  AndRule,
  OrRule,
  RuleType,
  BaseRule,
  Rules,
} from "@/features/rules/types/rule";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/inputs/button";
import BaseRuleComponent from "./BaseRuleComponent";
import {
  createEmptyBaseRule,
  createEmptyAndRule,
  createEmptyOrRule,
  isBaseRule,
  isAndRule,
  isOrRule,
} from "@/features/rules/utils/ruleUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/inputs/dropdown-menu";

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
  const isAnd = isAndRule(rule);
  const rules = isAnd ? rule.AND : rule.OR;
  const groupType = isAnd ? "AND" : "OR";
  const groupColor = isAnd
    ? "bg-rule-and/10 border-rule-and/30"
    : "bg-rule-or/10 border-rule-or/30";
  const groupTextColor = isAnd ? "text-rule-and" : "text-rule-or";

  const handleAddRule = (type: "BASE" | "AND" | "OR") => {
    const newRules = [...rules, ruleMap[type]()];
    onChange(isAnd ? { ...rule, AND: newRules } : { ...rule, OR: newRules });
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

  return (
    <div className={`p-4 rounded-lg border ${groupColor} animate-fade-in`}>
      <div className="flex justify-between items-center mb-3">
        <div className={`font-medium ${groupTextColor}`}>
          {groupType} Group (all conditions {isAnd ? "must" : "can"} match)
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
        })}
      </div>

      <div className="mt-3 flex space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              Add Condition
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => handleAddRule("BASE")}>
              Condition
            </DropdownMenuItem>
            {!isAnd ? (
              <DropdownMenuItem onClick={() => handleAddRule("AND")}>
                AND Group
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => handleAddRule("OR")}>
                OR Group
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default GroupRuleComponent;
