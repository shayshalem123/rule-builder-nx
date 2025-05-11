import React from "react";
import { Button } from "@/shared/components/inputs/button";
import { Undo2, Redo2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/inputs/tooltip";
import { useRuleHistory } from "../../../../hooks/useRuleHistory";
import { RuleType } from "@/features/rules/types/rule";

interface HistoryControlsProps {
  ruleLogic: RuleType;
  onRuleChange: (newRule: RuleType) => void;
}

/**
 * Component for rendering undo/redo buttons with tooltips
 * Encapsulates the history management internally
 */
const HistoryControls: React.FC<HistoryControlsProps> = ({
  ruleLogic,
  onRuleChange,
}) => {
  // Use the hook with the current rule - it will automatically track changes
  const { undo, redo, canUndo, canRedo } = useRuleHistory(ruleLogic);

  // Handle undo
  const handleUndo = () => {
    const previousRule = undo();
    if (previousRule) {
      onRuleChange(previousRule);
    }
  };

  // Handle redo
  const handleRedo = () => {
    const nextRule = redo();
    if (nextRule) {
      onRuleChange(nextRule);
    }
  };

  return (
    <div className="flex space-x-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleUndo}
            disabled={!canUndo}
            className="h-8 w-8 bg-background-secondary"
            type="button"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Undo</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRedo}
            disabled={!canRedo}
            className="h-8 w-8 bg-background-secondary"
            type="button"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Redo</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default HistoryControls;
