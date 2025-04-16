import React from "react";
import HistoryControls from "./HistoryControls";

interface RuleBuilderHeaderProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

/**
 * Component for the rule builder header with title, description and history controls
 */
const RuleBuilderHeader: React.FC<RuleBuilderHeaderProps> = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Rule Logic</h3>
        <p className="text-sm text-gray-600">
          Define the conditions that determine when this rule should be applied.
        </p>
      </div>
      <HistoryControls
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
    </div>
  );
};

export default RuleBuilderHeader;
