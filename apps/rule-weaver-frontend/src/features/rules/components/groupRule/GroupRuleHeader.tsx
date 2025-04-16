import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Rules } from "@/features/rules/types/rule";
import { getGroupStyles } from "./groupStyles";
import { RULE_DESCRIPTIONS } from "../../constants/ruleDescriptions";

interface GroupRuleHeaderProps {
  isCollapsed: boolean;
  isAnd: boolean;
  groupType: "AND" | "OR";
  rulesCount: number;
  toggleCollapse: () => void;
  handleAddRule: (type: Rules) => void;
  onDelete?: () => void;
  actionsComponent: React.ReactNode;
}

const GroupRuleHeader: React.FC<GroupRuleHeaderProps> = ({
  isCollapsed,
  isAnd,
  groupType,
  rulesCount,
  toggleCollapse,
  actionsComponent,
}) => {
  const { groupTextColor, groupHighlightColor } = getGroupStyles(isAnd);
  const ruleTypeDescription = isAnd
    ? RULE_DESCRIPTIONS.AND.SHORT
    : RULE_DESCRIPTIONS.OR.SHORT;

  return (
    <div
      className={`flex justify-between items-center p-3 cursor-pointer transition-colors duration-200 group ${
        isCollapsed ? groupHighlightColor : ""
      }`}
      onClick={toggleCollapse}
      aria-expanded={!isCollapsed}
      aria-controls={`group-content-${groupType}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleCollapse();
        }
      }}
    >
      <div className="flex items-center">
        {isCollapsed ? (
          <ChevronRight
            className={`h-4 w-4 mr-2 ${groupTextColor} transition-transform duration-200`}
          />
        ) : (
          <ChevronDown
            className={`h-4 w-4 mr-2 ${groupTextColor} transition-transform duration-200`}
          />
        )}
        <div className={`font-medium ${groupTextColor} pointer-events-none`}>
          {groupType} Group
          <span className="hidden sm:inline pointer-events-none">
            {" "}
            (all conditions {ruleTypeDescription} match)
          </span>
          <span className="ml-2 text-xs text-gray-500 font-normal pointer-events-none">
            {rulesCount} condition{rulesCount !== 1 ? "s" : ""}
          </span>
          {isCollapsed && (
            <span className="ml-2 text-xs text-gray-500 italic pointer-events-none">
              Click to expand
            </span>
          )}
        </div>
      </div>

      <div
        className="flex items-center space-x-2"
        onClick={(e) => e.stopPropagation()}
      >
        {actionsComponent}
      </div>
    </div>
  );
};

export default GroupRuleHeader;
