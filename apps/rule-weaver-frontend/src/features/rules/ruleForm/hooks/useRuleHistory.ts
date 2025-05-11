import { useEffect, useMemo, useRef, useState } from "react";
import { RuleType } from "@/features/rules/types/rule";

/**
 * Custom hook for managing rule history and providing undo/redo functionality
 * @param currentRule The current rule to track
 */
export const useRuleHistory = (currentRule: RuleType) => {
  const [history, setHistory] = useState<RuleType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const isUndoRedoInProgress = useRef(false);
  const lastRuleStringRef = useRef<string | null>(null);

  const canUndo = useMemo(() => currentIndex > 0, [currentIndex]);
  const canRedo = useMemo(
    () => currentIndex < history.length - 1 && history.length > 0,
    [currentIndex, history]
  );

  useEffect(() => {
    if (isUndoRedoInProgress.current) {
      isUndoRedoInProgress.current = false;
      return;
    }

    const currentRuleString = JSON.stringify(currentRule);

    if (lastRuleStringRef.current === currentRuleString) return;

    const ruleCopy = JSON.parse(currentRuleString);

    if (history.length === 0) {
      setHistory([ruleCopy]);
      setCurrentIndex(0);

      return;
    } else {
      const newHistory = history.slice(0, currentIndex + 1);

      newHistory.push(ruleCopy);
      setHistory(newHistory);
      setCurrentIndex(newHistory.length - 1);
    }

    lastRuleStringRef.current = currentRuleString;
  }, [currentRule, currentIndex, history]);

  /**
   * Move back in history and return the previous rule
   */
  const undo = (): RuleType | null => {
    if (currentIndex > 0) {
      isUndoRedoInProgress.current = true;
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      return history[newIndex];
    }
    return null;
  };

  /**
   * Move forward in history and return the next rule
   */
  const redo = (): RuleType | null => {
    if (currentIndex < history.length - 1) {
      isUndoRedoInProgress.current = true;
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      return history[newIndex];
    }
    return null;
  };

  return {
    undo,
    redo,
    canUndo,
    canRedo,
  };
};

export default useRuleHistory;
