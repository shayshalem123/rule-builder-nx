import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState, useMemo } from "react";
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

export const useRuleForm = (
  initialRule?: RuleWithMeta,
  onSave?: (rule: Omit<RuleWithMeta, "id" | "createdAt" | "updatedAt">) => void
) => {
  const [optionLists, setOptionLists] = useState({
    destinationOptions: defaultDestinationOptions,
    categoryOptions: defaultCategoryOptions,
  });
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const validationSchema = useMemo(() => {
    return Yup.object({
      name: Yup.string().required("Rule name is required"),
      description: Yup.string(),
      destination: Yup.string()
        .required("Destination is required")
        .oneOf(
          optionLists.destinationOptions,
          `Destination must be one of: ${optionLists.destinationOptions.join(
            ", "
          )}`
        ),
      category: Yup.string()
        .required("Category is required")
        .oneOf(
          optionLists.categoryOptions,
          `Category must be one of: ${optionLists.categoryOptions.join(", ")}`
        ),
      rule: Yup.mixed().required("Rule logic is required"),
    });
  }, [optionLists.destinationOptions, optionLists.categoryOptions]);

  const getInitialRuleLogic = (): RuleType => {
    if (!initialRule) return ruleUtils.createEmptyBaseRule();
    return initialRule.rule || ruleUtils.createEmptyBaseRule();
  };

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
      destination:
        initialRule?.destination || optionLists.destinationOptions[0] || "",
      category: initialRule?.category || optionLists.categoryOptions[0] || "",
      rule: currentRule,
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

  const updateRuleLogic = (newRule: RuleType) => {
    updateRule(newRule);
    formik.setFieldValue("rule", newRule);
  };

  useEffect(() => {
    formik.setFieldValue("rule", currentRule);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
