import React from "react";
import { RuleType } from "@/features/rules/types/rule";

interface GroupRuleContentProps {
  isCollapsed: boolean;
  rules: RuleType[];
  groupType: string;
  renderRuleComponent: (rule: RuleType, index: number) => React.ReactNode;
}

const GroupRuleContent: React.FC<GroupRuleContentProps> = ({
  isCollapsed,
  rules,
  groupType,
  renderRuleComponent,
}) => {
  return (
    <div
      id={`group-content-${groupType}`}
      className={`transition-all duration-300 ${
        isCollapsed
          ? "max-h-0 opacity-0 overflow-hidden pointer-events-none absolute invisible"
          : "max-h-[5000px] opacity-100 pb-3 relative visible"
      }`}
      aria-hidden={isCollapsed}
    >
      <div className="space-y-3 px-4">
        {rules && rules.length > 0 ? (
          rules.map((rule, index) => renderRuleComponent(rule, index))
        ) : (
          <div className="text-sm text-gray-500 italic p-3">
            No conditions added yet. Click the "Add" button above to add a
            condition.
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupRuleContent;
