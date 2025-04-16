import { useState } from "react";
import { RuleType } from "../types/rule";

/**
 * Custom hook for managing rule history and providing undo/redo functionality
 * @param initialRule The initial rule state
 * @returns Object containing current rule, history state, and functions for manipulation
 */
export const useRuleHistory = (initialRule: RuleType) => {
  // Deep copy to ensure we have a clean history start
  const initialRuleCopy = JSON.parse(JSON.stringify(initialRule));

  // Current rule state
  const [rule, setRule] = useState<RuleType>(initialRuleCopy);

  // History tracking
  const [history, setHistory] = useState<RuleType[]>([initialRuleCopy]);
  const [historyIndex, setHistoryIndex] = useState(0);

  /**
   * Updates the rule and adds the new state to history
   */
  const updateRule = (newRule: RuleType) => {
    const newRuleCopy = JSON.parse(JSON.stringify(newRule));

    setRule(newRuleCopy);

    const newHistory = history.slice(0, historyIndex + 1);

    newHistory.push(newRuleCopy);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  /**
   * Move back in history
   */
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setRule(history[newIndex]);
    }
  };

  /**
   * Move forward in history
   */
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setRule(history[newIndex]);
    }
  };

  // Derived state for button disabling
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    rule,
    updateRule,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};

export default useRuleHistory;
