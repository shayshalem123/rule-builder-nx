import { useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { RuleType } from "../../types/rule";

/**
 * A hook that provides a stable mapping between rule objects and unique IDs
 * This allows us to use stable keys in React components without modifying the rule objects
 */
export const useRuleIdMap = () => {
  const ruleIdMap = useRef<WeakMap<object, string>>(new WeakMap());

  const getRuleId = useCallback(
    (rule: RuleType): string => {
      if (ruleIdMap.current.has(rule)) return ruleIdMap.current.get(rule);

      const id = uuidv4();
      ruleIdMap.current.set(rule, id);

      return id;
    },
    []
  );

  return { getRuleId };
};
