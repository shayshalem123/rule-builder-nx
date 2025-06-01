import React, { useState, useCallback, memo, useEffect } from "react";
import {
  AndRule,
  OrRule,
  RuleType,
  BaseRule,
  Rules,
} from "@/features/rules/types/rule";
import GroupRuleHeader from "./GroupRuleHeader";
import GroupRuleContent from "./GroupRuleContent";
import GroupRuleActions from "./GroupRuleActions";
import { getGroupStyles } from "./groupStyles";
import { Button } from "@/shared/components/inputs/button";
import { Plus } from "lucide-react";
import {
  createEmptyBaseRule,
  createEmptyAndRule,
  createEmptyOrRule,
  isBaseRule,
  isAndRule,
  isOrRule,
} from "@/features/rules/shared/utils/ruleUtils";
import { useRuleValidation } from "../../../../hooks/useRuleValidation";
import BaseRuleComponent from "../baseRule/BaseRuleComponent";
import { usePrevious } from "react-use";
import { useRuleIdMap } from "@/features/rules/shared/hooks/useRuleIdMap";

interface GroupRuleComponentProps {
  rule: AndRule | OrRule;
  onChange: (updatedRule: AndRule | OrRule) => void;
  category?: string;
  onDeleteGroup?: () => void;
  onValidationChange?: (hasErrors: boolean, errorCount: number) => void;
}

const ruleMap: Record<Rules, () => RuleType> = {
  BASE: createEmptyBaseRule,
  AND: createEmptyAndRule,
  OR: createEmptyOrRule,
};

const GroupRuleComponent: React.FC<GroupRuleComponentProps> = memo(
  ({
    rule,
    onChange,
    onDeleteGroup,
    onValidationChange,
    category = "partners-images",
  }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const isAnd = isAndRule(rule);
    const rules = isAnd ? rule.AND : rule.OR;
    const groupType = isAnd ? "AND" : "OR";

    const {
      errorCount,
      hasErrors,
      handleChildValidationChange,
      handleRuleValidationAfterDelete,
    } = useRuleValidation({
      rule,
    });

    const prevCategory = usePrevious(category);

    const { getRuleId } = useRuleIdMap();

    useEffect(() => {
      if (prevCategory !== category) {
        onValidationChange?.(hasErrors, errorCount);
      }
    }, [category, hasErrors, errorCount, onValidationChange, prevCategory]);

    const { groupColor } = getGroupStyles(isAnd);

    const handleRuleChange = useCallback(
      (index: number, updatedRule: RuleType) => {
        const newRules = [...rules];
        newRules[index] = updatedRule;
        onChange(
          isAnd ? { ...rule, AND: newRules } : { ...rule, OR: newRules }
        );
      },
      [isAnd, onChange, rule, rules]
    );

    const handleAddRule = useCallback(
      (type: Rules, creator: () => RuleType) => {
        const newRules = [...rules];
        newRules.push(creator());
        onChange(
          isAnd ? { ...rule, AND: newRules } : { ...rule, OR: newRules }
        );
      },
      [isAnd, onChange, rule, rules]
    );

    const handleRuleDelete = useCallback(
      (index: number) => {
        const newRules = [...rules];
        newRules.splice(index, 1);

        const validationResult = handleRuleValidationAfterDelete(index);

        onValidationChange?.(
          validationResult.hasErrors,
          validationResult.errorCount
        );

        onChange(
          isAnd ? { ...rule, AND: newRules } : { ...rule, OR: newRules }
        );
      },
      [
        isAnd,
        onChange,
        rule,
        rules,
        handleRuleValidationAfterDelete,
        onValidationChange,
      ]
    );

    const handleRuleItemDelete = useCallback(
      (index: number) => {
        if (rules.length <= 1) return onDeleteGroup?.();

        handleRuleDelete(index);
      },
      [rules.length, onDeleteGroup, handleRuleDelete]
    );

    const handleGroupDelete = useCallback(() => {
      onDeleteGroup?.();
    }, [onDeleteGroup]);

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

    const renderRuleComponent = useCallback(
      (nestedRule: RuleType, index: number) => {
        if (isBaseRule(nestedRule)) {
          return (
            <BaseRuleComponent
              rule={nestedRule}
              onChange={(updatedRule: BaseRule) =>
                handleRuleChange(index, updatedRule)
              }
              onDelete={() => handleRuleItemDelete(index)}
              onValidationChange={(isValid) =>
                handleValidationChange(index, !isValid, isValid ? 0 : 1)
              }
              parentGroupType={groupType as "AND" | "OR"}
              category={category}
            />
          );
        } else if (isAndRule(nestedRule) || isOrRule(nestedRule)) {
          return (
            <GroupRuleComponent
              rule={nestedRule}
              onChange={(updatedRule) => handleRuleChange(index, updatedRule)}
              onDeleteGroup={() => handleRuleItemDelete(index)}
              onValidationChange={(hasErrors, childErrorCount) =>
                handleValidationChange(index, hasErrors, childErrorCount)
              }
              category={category}
            />
          );
        }
        return null;
      },
      [
        category,
        groupType,
        handleRuleChange,
        handleRuleItemDelete,
        handleValidationChange,
        getRuleId,
      ]
    );

    const actionsComponent = (
      <GroupRuleActions
        isCollapsed={isCollapsed}
        isAnd={isAnd}
        groupType={groupType}
        onAddRule={(type) => handleAddRule(type, ruleMap[type])}
        ruleMap={ruleMap}
        onDelete={handleGroupDelete}
      />
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
          handleAddRule={(type) => handleAddRule(type, ruleMap[type])}
          onDelete={handleGroupDelete}
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
              onClick={() => handleAddRule("BASE", ruleMap.BASE)}
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

export default GroupRuleComponent;
