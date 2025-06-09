import React, { memo } from 'react';
import { RuleType } from '@/features/rules/types/rule';
import { RuleLogicHeader } from './RuleLogicHeader';
import { RuleLogicContent } from './RuleLogicContent';

interface RuleLogicBuilderProps {
  ruleLogic: RuleType;
  category: string;
  handleRuleLogicChange: (rule: RuleType) => void;
  isFullScreen: boolean;
  onFullScreenChange: (isFullScreen: boolean) => void;
}

export const RuleLogicBuilder: React.FC<RuleLogicBuilderProps> = memo(
  ({
    ruleLogic,
    handleRuleLogicChange,
    category,
    isFullScreen,
    onFullScreenChange,
  }) => {
    return (
      <div className="space-y-4">
        <RuleLogicHeader
          ruleLogic={ruleLogic}
          onRuleChange={handleRuleLogicChange}
          isFullScreen={isFullScreen}
          onFullScreenChange={onFullScreenChange}
        />

        <RuleLogicContent
          ruleLogic={ruleLogic}
          onRuleChange={handleRuleLogicChange}
          category={category}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      JSON.stringify(prevProps.ruleLogic) ===
        JSON.stringify(nextProps.ruleLogic) &&
      prevProps.category === nextProps.category
    );
  }
);
