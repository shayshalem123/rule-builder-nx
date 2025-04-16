import React from "react";
import { BaseRule, AndRule, OrRule } from "@/features/rules/types/rule";
import {
  createEmptyAndRule,
  createEmptyOrRule,
} from "@/features/rules/utils/ruleUtils";
import BaseRuleForm from "./BaseRuleForm";
import RuleActions from "./actions";

interface BaseRuleComponentProps {
  rule: BaseRule;
  onChange: (updatedRule: BaseRule | AndRule | OrRule) => void;
  onDelete?: () => void;
  showDelete?: boolean;
  parentGroupType?: "AND" | "OR" | null;
  category?: string;
}

const BaseRuleComponent: React.FC<BaseRuleComponentProps> = ({
  rule,
  onChange,
  onDelete,
  showDelete = true,
  parentGroupType = null,
  category = "partners-images",
}) => {
  const handleConvertToGroup = (type: "AND" | "OR") => {
    // Create a new group rule with the current rule as the first condition
    const currentRuleCopy = { ...rule };

    if (type === "AND") {
      const andRule = createEmptyAndRule();
      andRule.AND[0] = currentRuleCopy;
      onChange(andRule);
    } else {
      const orRule = createEmptyOrRule();
      orRule.OR[0] = currentRuleCopy;
      onChange(orRule);
    }
  };

  return (
    <div className="p-3 bg-white rounded-md border border-gray-200 shadow-sm animate-fade-in w-full">
      <div className="flex items-center justify-between">
        <div className="flex-grow">
          <BaseRuleForm rule={rule} onChange={onChange} category={category} />
        </div>
        <RuleActions
          onConvertToGroup={handleConvertToGroup}
          onDelete={onDelete}
          showDelete={showDelete}
          parentGroupType={parentGroupType}
        />
      </div>
    </div>
  );
};

export default BaseRuleComponent;
