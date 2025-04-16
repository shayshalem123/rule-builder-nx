import React from "react";
import { RuleType } from "../../types/rule";

interface GroupRuleViewerProps {
  rules: RuleType[];
  groupType: "AND" | "OR";
  renderRule: (rule: RuleType) => React.ReactNode;
}

const GroupRuleViewer: React.FC<GroupRuleViewerProps> = ({
  rules,
  groupType,
  renderRule,
}) => {
  // Configuration based on group type
  const config = {
    AND: {
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      description: "All conditions must match",
    },
    OR: {
      borderColor: "border-orange-200",
      bgColor: "bg-orange-50",
      textColor: "text-orange-800",
      description: "Any condition may match",
    },
  };

  const { borderColor, bgColor, textColor, description } = config[groupType];

  return (
    <div className={`p-3 bg-white rounded-md border ${borderColor} shadow-sm`}>
      <div className={`mb-2 ${bgColor} p-2 rounded ${textColor} font-medium`}>
        {groupType} Rule ({description})
      </div>
      <div className="space-y-2">
        {rules.map((rule, index) => (
          <div key={index}>{renderRule(rule)}</div>
        ))}
      </div>
    </div>
  );
};

export default GroupRuleViewer;
