import { useFormik } from "formik";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  RuleType,
  RuleWithMeta,
  destinationOptions as defaultDestinationOptions,
  categoryOptions as defaultCategoryOptions,
} from "@/features/rules/types/rule";
import * as ruleUtils from "@/features/rules/shared/utils/ruleUtils";
import { useCategoriesDestinations } from "../../hooks/useCategoriesDestinations";
import { useSchema } from "@/features/schemas/hooks/useSchemas";
import { useRuleValidation } from "@/features/rules/shared/hooks/useRuleValidation";

export interface RuleFormValues {
  name: string;
  description: string;
  destination: string;
  type: string;
  category: string;
  rule: RuleType;
  extraProperties?: Record<string, unknown>;
}

export const useRuleForm = (
  onSave: (rule: Omit<RuleWithMeta, "id" | "createdAt" | "updatedAt">) => void,
  initialRule?: RuleWithMeta
) => {
  const [currentCategory, setCurrentCategory] = useState<string>(
    initialRule?.category || defaultCategoryOptions[0] || ""
  );
  const [currentDestination, setCurrentDestination] = useState<string>(
    initialRule?.destination || defaultDestinationOptions[0] || ""
  );

  const {
    categoriesDestinationsMap,
    categoryDestinationsMap,
    getSchemaIdForCategory,
  } = useCategoriesDestinations();

  const schemaId = useMemo(
    () => getSchemaIdForCategory(currentCategory),
    [getSchemaIdForCategory, currentCategory]
  );

  const { schema } = useSchema(schemaId);

  const schemaDefinition = useMemo(() => {
    return schema?.definition || null;
  }, [schema]);

  const { formikValidationSchema } = useRuleValidation({
    schema: schemaDefinition,
    categoryDestinationsMap: categoriesDestinationsMap,
    selectedDestination: currentDestination,
    selectedCategory: currentCategory,
  });

  const formik = useFormik<RuleFormValues>({
    initialValues: {
      name: initialRule?.name || "",
      description: initialRule?.description || "",
      destination: currentDestination,
      category: currentCategory,
      type: initialRule?.type || "",
      rule: initialRule?.rule || ruleUtils.createEmptyBaseRule(),
      extraProperties: initialRule?.extraProperties,
    },
    validate: formikValidationSchema,
    onSubmit: onSave,
    enableReinitialize: false,
  });

  useEffect(() => {
    if (formik.values.category !== currentCategory) {
      setCurrentCategory(formik.values.category);
    }
    if (formik.values.destination !== currentDestination) {
      setCurrentDestination(formik.values.destination);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.category, formik.values.destination]);

  useEffect(() => {
    if (!categoryDestinationsMap || !formik.values.category) return;

    const newDestinations =
      categoryDestinationsMap[formik.values.category] || [];

    if (newDestinations.length > 0) {
      if (!newDestinations.includes(formik.values.destination)) {
        formik.setFieldValue("destination", newDestinations[0]);
      }
    }
  }, [formik.values.category, categoryDestinationsMap]);

  const updateRuleLogic = useCallback(
    (newRule: RuleType) => {
      formik.setFieldValue("rule", newRule);
    },
    [formik]
  );

  return {
    formik,
    schemaDefinition,
    updateRuleLogic,
  };
};
