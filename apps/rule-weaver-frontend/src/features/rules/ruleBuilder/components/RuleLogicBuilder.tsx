import React from "react";
import { RuleType } from "@/features/rules/types/rule";
import * as ruleUtils from "@/features/rules/shared/utils/ruleUtils";
import BaseRuleComponent from "./baseRule";
import GroupRuleComponent from "./groupRule/GroupRuleComponent";
import HistoryControls from "./ruleEditor/HistoryControls";

interface RuleLogicBuilderProps {
  ruleLogic: RuleType;
  handleRuleLogicChange: (rule: RuleType) => void;
  category: string;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const RuleLogicBuilder: React.FC<RuleLogicBuilderProps> = ({
  ruleLogic,
  handleRuleLogicChange,
  category,
  undo,
  redo,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-semibold">Rule Logic</h3>
        <HistoryControls
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      </div>

      {ruleUtils.isBaseRule(ruleLogic) ? (
        <BaseRuleComponent
          rule={ruleLogic}
          onChange={handleRuleLogicChange}
          showDelete={false}
          category={category}
        />
      ) : (
        <GroupRuleComponent
          rule={ruleLogic}
          onChange={handleRuleLogicChange}
          category={category}
        />
      )}
    </div>
  );
};
