import { useState, useCallback, useMemo, useEffect } from "react";
import { AndRule, OrRule } from "@/features/rules/types/rule";
import { isAndRule } from "@/features/rules/shared/utils/ruleUtils";

type ValidationState = Record<
  number,
  { hasError: boolean; errorCount: number }
>;

type ValidationResult = {
  hasErrors: boolean;
  errorCount: number;
};

interface UseRuleValidationOptions {
  rule: AndRule | OrRule;
}

/**
 * Hook to track validation state for rule groups
 * Only tracks errors, doesn't handle callbacks
 */
export function useRuleValidation(options: UseRuleValidationOptions) {
  const { rule } = options;

  const isAnd = useMemo(() => isAndRule(rule), [rule]);
  const rules = useMemo(() => isAnd ? (rule as AndRule).AND : (rule as OrRule).OR, [isAnd, rule]);

  const [validationState, setValidationState] = useState<ValidationState>({});

  const errorCount = useMemo(() => {
    return Object.values(validationState).reduce(
      (sum, state) => sum + state.errorCount,
      0
    );
  }, [validationState]);
  // Check if there are any errors in child rules
  const hasErrors = useMemo(() => {
    return Object.values(validationState).some((state) => state.hasError);
  }, [validationState]);

  useEffect(() => {
    setValidationState((prev) => {
      const newState = { ...prev };

      Object.keys(newState).forEach((key) => {
        const index = Number(key);
        if (index >= rules.length) {
          delete newState[index];
        }
      });

      return newState;
    });
  }, [rules.length]);

  const getValidationResult = useCallback(
    (state: ValidationState): ValidationResult => {
      const hasInvalidChildren = Object.values(state).some(
        (item) => item.hasError
      );

      const totalErrorCount = Object.values(state).reduce(
        (sum, item) => sum + item.errorCount,
        0
      );

      return {
        hasErrors: hasInvalidChildren,
        errorCount: totalErrorCount,
      };
    },
    []
  );

  const updateValidationState = useCallback(
    (
      index: number,
      hasError: boolean,
      childErrorCount: number = hasError ? 1 : 0
    ): ValidationResult => {
      let result: ValidationResult = { hasErrors: false, errorCount: 0 };

      setValidationState((prev) => {
        const existing = prev[index];
        if (
          existing &&
          existing.hasError === hasError &&
          existing.errorCount === childErrorCount
        ) {
          result = getValidationResult(prev);
          return prev;
        }

        const newState = {
          ...prev,
          [index]: { hasError, errorCount: childErrorCount },
        };

        result = getValidationResult(newState);
        return newState;
      });

      return result;
    },
    [getValidationResult]
  );

  // Function to update validation state when a rule is deleted
  const handleRuleValidationAfterDelete = useCallback(
    (index: number): ValidationResult => {
      let result: ValidationResult = { hasErrors: false, errorCount: 0 };

      setValidationState((prev) => {
        const newState = { ...prev };
        delete newState[index];

        // Adjust indices for rules that come after the deleted rule
        Object.keys(newState).forEach((key) => {
          const keyNum = Number(key);
          if (keyNum > index) {
            newState[keyNum - 1] = newState[keyNum];
            delete newState[keyNum];
          }
        });

        result = getValidationResult(newState);
        return newState;
      });

      return result;
    },
    [getValidationResult]
  );

  const handleChildValidationChange = useCallback(
    (
      index: number,
      hasError: boolean,
      childErrorCount: number = hasError ? 1 : 0
    ): ValidationResult => {
      return updateValidationState(index, hasError, childErrorCount);
    },
    [updateValidationState]
  );

  const resetValidation = useCallback((): ValidationResult => {
    const result: ValidationResult = { hasErrors: false, errorCount: 0 };
    setValidationState({});
    return result;
  }, []);

  return {
    validationState,
    errorCount,
    hasErrors,
    handleChildValidationChange,
    handleRuleValidationAfterDelete,
    resetValidation,
  };
}
