import React, { useState, useCallback, memo, useEffect } from 'react';
import { AndRule, OrRule, RuleType, Rules } from '@/features/rules/types/rule';
import GroupRuleHeader from './GroupRuleHeader';
import { getGroupStyles } from './groupStyles';
import { Button } from '@/shared/components/inputs/button';
import { Plus } from 'lucide-react';
import {
  isBaseRule,
  isAndRule,
  isOrRule,
} from '@/features/rules/shared/utils/ruleUtils';
import { useRuleValidation } from '../../../../hooks/useRuleValidation';
import BaseRuleComponent from '../baseRule/BaseRuleComponent';
import { usePrevious } from 'react-use';
import { useGroupRuleState } from './hooks/useGroupRuleState';
import { useGroupRuleOperations } from './hooks/useGroupRuleOperations';

interface GroupRuleComponentProps {
  rule: AndRule | OrRule;
  onChange: (updatedRule: AndRule | OrRule) => void;
  category?: string;
  onDeleteGroup?: () => void;
  onValidationChange?: (hasErrors: boolean, errorCount: number) => void;
}

const GroupRuleComponent: React.FC<GroupRuleComponentProps> = memo(
  ({
    rule,
    onChange,
    onDeleteGroup,
    onValidationChange,
    category = 'partners-images',
  }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const { isAnd, rules, groupType } = useGroupRuleState(rule);

    const {
      errorCount,
      hasErrors,
      handleChildValidationChange,
      handleRuleValidationAfterDelete,
    } = useRuleValidation({
      rule,
    });

    const {
      handleRuleChange,
      handleAddRule,
      handleRuleItemDelete,
      handleGroupDelete,
    } = useGroupRuleOperations({
      rule,
      rules,
      isAnd,
      onChange,
      onDeleteGroup,
      handleRuleValidationAfterDelete,
      onValidationChange,
    });

    const prevCategory = usePrevious(category);

    useEffect(() => {
      if (prevCategory !== category) {
        onValidationChange?.(hasErrors, errorCount);
      }
    }, [category, hasErrors, errorCount, onValidationChange, prevCategory]);

    const { groupColor } = getGroupStyles(isAnd);

    const toggleCollapse = useCallback(() => {
      setIsCollapsed(!isCollapsed);
    }, [isCollapsed]);

    const handleValidationChange = useCallback(
      (index: number, hasError: boolean, childErrorCount: number) => {
        const validationResult = handleChildValidationChange(
          index,
          hasError,
          childErrorCount
        );

        onValidationChange?.(
          validationResult.hasErrors,
          validationResult.errorCount
        );
      },
      [handleChildValidationChange, onValidationChange]
    );

    return (
      <div
        className={`rounded-lg border ${groupColor} animate-fade-in w-full relative shadow-md`}
      >
        <GroupRuleHeader
          isCollapsed={isCollapsed}
          isAnd={isAnd}
          groupType={groupType}
          rulesCount={rules.length}
          errorCount={errorCount}
          toggleCollapse={toggleCollapse}
          handleAddRule={handleAddRule}
          onDelete={handleGroupDelete}
        />

        <div
          id={`group-content-${groupType}`}
          className={`transition-all duration-300 ${
            isCollapsed
              ? 'max-h-0 opacity-0 overflow-hidden pointer-events-none absolute invisible'
              : 'max-h-[5000px] opacity-100 pb-3 relative visible flex-col max-h-full'
          }`}
          aria-hidden={isCollapsed}
        >
          <div className="space-y-3 px-4">
            {(rules ?? []).map((nestedRule, index) => {
              if (isBaseRule(nestedRule)) {
                return (
                  <BaseRuleComponent
                    key={index}
                    rule={nestedRule}
                    onChange={(updatedRule) =>
                      handleRuleChange(index, updatedRule)
                    }
                    onDelete={() => handleRuleItemDelete(index)}
                    onValidationChange={(isValid) =>
                      handleValidationChange(index, !isValid, isValid ? 0 : 1)
                    }
                    parentGroupType={groupType}
                    category={category}
                  />
                );
              } else if (isAndRule(nestedRule) || isOrRule(nestedRule)) {
                return (
                  <GroupRuleComponent
                    key={index}
                    rule={nestedRule}
                    onChange={(updatedRule) =>
                      handleRuleChange(index, updatedRule)
                    }
                    onDeleteGroup={() => handleRuleItemDelete(index)}
                    onValidationChange={(hasErrors, childErrorCount) =>
                      handleValidationChange(index, hasErrors, childErrorCount)
                    }
                    category={category}
                  />
                );
              }

              return null;
            })}
          </div>
        </div>

        {!isCollapsed && (
          <div className="px-4 pb-4 flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={() => handleAddRule('BASE')}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Condition
            </Button>
          </div>
        )}
      </div>
    );
  }
);

GroupRuleComponent.displayName = 'GroupRuleComponent';
export default GroupRuleComponent;
