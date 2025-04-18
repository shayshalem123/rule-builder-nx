import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import {
  RuleType,
  RuleWithMeta,
  destinationOptions as defaultDestinationOptions,
  categoryOptions as defaultCategoryOptions,
} from "@/features/rules/types/rule";
import { ruleService } from "@/features/rules/services/ruleService";
import * as ruleUtils from "@/features/rules/shared/utils/ruleUtils";
import useRuleHistory from "./useRuleHistory";

// Define our form values type to include the rule
export interface RuleFormValues {
  name: string;
  description: string;
  destination: string;
  category: string;
  rule: RuleType;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Rule name is required"),
  description: Yup.string(),
  destination: Yup.string().required("Destination is required"),
  category: Yup.string()
    .oneOf(defaultCategoryOptions)
    .required("Category is required"),
  // We could add rule validation here if needed
  rule: Yup.mixed().required("Rule logic is required"),
});

export const useRuleForm = (
  initialRule?: RuleWithMeta,
  onSave?: (rule: Omit<RuleWithMeta, "id" | "createdAt" | "updatedAt">) => void
) => {
  const [optionLists, setOptionLists] = useState({
    destinationOptions: defaultDestinationOptions,
    categoryOptions: defaultCategoryOptions,
  });
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  // Initialize the rule logic
  const getInitialRuleLogic = (): RuleType => {
    if (!initialRule) return ruleUtils.createEmptyBaseRule();
    return initialRule.rule || ruleUtils.createEmptyBaseRule();
  };

  // Use the existing useRuleHistory hook
  const {
    rule: currentRule,
    updateRule,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useRuleHistory(getInitialRuleLogic());

  const formik = useFormik<RuleFormValues>({
    initialValues: {
      name: initialRule?.name || "",
      description: initialRule?.description || "",
      destination: initialRule?.destination || "A",
      category: initialRule?.category || "partners-images",
      rule: currentRule, // Use the rule from useRuleHistory
    },
    validationSchema,
    onSubmit: (values) => {
      if (!onSave) return;

      const fullRule: Omit<RuleWithMeta, "id" | "createdAt" | "updatedAt"> = {
        ...values,
        description: values.description.trim() ? values.description : undefined,
      };

      onSave(fullRule);
    },
  });

  // Connect rule logic updates to both history management and form state
  const updateRuleLogic = (newRule: RuleType) => {
    // Update the history first
    updateRule(newRule);
    // Update the Formik state to match
    formik.setFieldValue("rule", newRule);
  };

  // Keep Formik state in sync with history changes when undo/redo are used
  useEffect(() => {
    formik.setFieldValue("rule", currentRule);
  }, [currentRule]);

  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const [fetchedDestinations, fetchedCategories] = await Promise.all([
          ruleService.getDestinations(),
          ruleService.getCategories(),
        ]);

        setOptionLists({
          destinationOptions: fetchedDestinations,
          categoryOptions: fetchedCategories,
        });
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  return {
    formik,
    optionLists,
    isLoadingOptions,
    updateRuleLogic,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
