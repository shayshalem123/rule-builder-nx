import React, { useState } from "react";
import { RuleType } from "@/features/rules/types/rule";
import { RULE_DESCRIPTIONS } from "@/features/rules/shared/constants/ruleDescriptions";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/inputs/tooltip";

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
  const [collapsed, setCollapsed] = useState(false);

  // Configuration based on group type
  const config = {
    AND: {
      borderColor: "border-blue-300",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      description: RULE_DESCRIPTIONS.AND.FULL,
      headerBg: "bg-blue-100",
      hoverBg: "hover:bg-blue-200",
      gradientFrom: "from-blue-100",
      gradientTo: "to-blue-50",
    },
    OR: {
      borderColor: "border-orange-300",
      bgColor: "bg-orange-50",
      textColor: "text-orange-800",
      description: RULE_DESCRIPTIONS.OR.FULL,
      headerBg: "bg-orange-100",
      hoverBg: "hover:bg-orange-200",
      gradientFrom: "from-orange-100",
      gradientTo: "to-orange-50",
    },
  };

  const {
    borderColor,
    bgColor,
    textColor,
    description,
    headerBg,
    hoverBg,
    gradientFrom,
    gradientTo,
  } = config[groupType];

  return (
    <div
      className={`rounded-md border ${borderColor} shadow-sm overflow-hidden`}
    >
      <div
        className={`${headerBg} p-3 flex justify-between items-center cursor-pointer ${hoverBg} transition-colors`}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center">
          <span className={`font-bold ${textColor} text-base mr-2`}>
            {groupType} Group
          </span>
          <span className={`${textColor} text-sm`}>
            ({rules.length} rule{rules.length !== 1 ? "s" : ""})
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="ml-2 flex items-center justify-center">
                <Info className={`h-4 w-4 ${textColor} opacity-70`} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div>
          {collapsed ? (
            <ChevronDown className={`h-5 w-5 ${textColor}`} />
          ) : (
            <ChevronUp className={`h-5 w-5 ${textColor}`} />
          )}
        </div>
      </div>

      {!collapsed && (
        <div className={`${bgColor} p-4 space-y-3`}>
          {rules.map((rule, index) => (
            <div key={index} className="relative px-1">
              {renderRule(rule)}
              {index < rules.length - 1 && (
                <div className="flex justify-center my-2 relative">
                  <div className="absolute left-0 right-0 h-px bg-accent/90 top-1/2 -z-10"></div>
                  <div
                    className={`px-3 py-1 rounded-md font-medium text-xs shadow-sm 
                      ${textColor} bg-gradient-to-r ${gradientFrom} ${gradientTo} 
                      border ${borderColor.replace("border-", "border-")} z-10`}
                  >
                    {groupType}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupRuleViewer;
