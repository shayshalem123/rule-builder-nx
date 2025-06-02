import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Rules } from '@/features/rules/types/rule';
import { getGroupStyles } from './groupStyles';
import { RULE_DESCRIPTIONS } from '@/features/rules/shared/constants/ruleDescriptions';
import GroupRuleActions from './GroupRuleActions';

interface GroupRuleHeaderProps {
  isCollapsed: boolean;
  isAnd: boolean;
  groupType: 'AND' | 'OR';
  rulesCount: number;
  errorCount?: number;
  toggleCollapse: () => void;
  handleAddRule: (type: Rules) => void;
  onDelete?: () => void;
}

const GroupRuleHeader: React.FC<GroupRuleHeaderProps> = ({
  isCollapsed,
  isAnd,
  groupType,
  rulesCount,
  errorCount = 0,
  toggleCollapse,
  handleAddRule,
  onDelete,
}) => {
  const { groupTextColor, groupHighlightColor } = getGroupStyles(isAnd);
  const ruleTypeDescription = isAnd
    ? RULE_DESCRIPTIONS.AND.FULL
    : RULE_DESCRIPTIONS.OR.FULL;

  const hasErrors = errorCount > 0;

  return (
    <div
      className={`flex justify-between items-center p-3 cursor-pointer transition-colors duration-200 group
        ${isCollapsed ? groupHighlightColor : ''}
        ${hasErrors ? 'border-l-4 border-l-red-400' : ''}`}
      onClick={toggleCollapse}
      aria-expanded={!isCollapsed}
      aria-controls={`group-content-${groupType}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
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
            {' '}
            ({ruleTypeDescription})
          </span>
          <span className="ml-2 text-xs text-text-primary font-normal pointer-events-none">
            {rulesCount} condition{rulesCount !== 1 ? 's' : ''}
          </span>
          {hasErrors && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 shadow-sm pointer-events-none">
              {errorCount} invalid
            </span>
          )}
          {isCollapsed && (
            <span className="ml-2 text-xs text-text-primary italic pointer-events-none">
              Click to expand
            </span>
          )}
        </div>
      </div>

      <div
        className="flex items-center space-x-2"
        onClick={(e) => e.stopPropagation()}
      >
        <GroupRuleActions
          isCollapsed={isCollapsed}
          isAnd={isAnd}
          groupType={groupType}
          onAddRule={handleAddRule}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default GroupRuleHeader;
