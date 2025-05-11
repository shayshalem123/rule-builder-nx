import React from "react";
import { RuleType } from "@/features/rules/types/rule";
import HistoryControls from "./fullscreen/HistoryControls";
import FullScreenToggle from "./fullscreen/FullScreenToggle";
import { cn } from "@/shared/utils/cn";

interface RuleLogicHeaderProps {
  ruleLogic: RuleType;
  onRuleChange: (rule: RuleType) => void;
  isFullScreen: boolean;
  onFullScreenChange: (isFullScreen: boolean) => void;
  className?: string;
}

export const RuleLogicHeader: React.FC<RuleLogicHeaderProps> = ({
  ruleLogic,
  onRuleChange,
  isFullScreen,
  onFullScreenChange,
  className,
}) => {
  return (
    <div className={cn("flex justify-between items-center", className)}>
      <h3 className="text-lg font-semibold">Rule Logic</h3>
      <div className="flex items-center">
        <FullScreenToggle
          isFullScreen={isFullScreen}
          onToggle={() => {
            onFullScreenChange(!isFullScreen);
          }}
        />
        <HistoryControls ruleLogic={ruleLogic} onRuleChange={onRuleChange} />
      </div>
    </div>
  );
};
