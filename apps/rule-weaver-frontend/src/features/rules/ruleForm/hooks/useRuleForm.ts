import { useFormik } from 'formik';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { RuleType, RuleWithMeta } from '@/features/rules/types/rule';
import * as ruleUtils from '@/features/rules/shared/utils/ruleUtils';
import { useCategoriesDestinations } from '../../hooks/useCategoriesDestinations';
import { useSchema } from '@/features/schemas/hooks/useSchemas';
import { useRuleValidation } from '@/features/rules/shared/hooks/useRuleValidation';
import { useCategory } from '../contexts/CategoryContext';
import { useDestination } from '../contexts/DestinationContext';

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
  onSave: (rule: Omit<RuleWithMeta, 'id' | 'createdAt' | 'updatedAt'>) => void,
  initialRule?: RuleWithMeta
) => {
  const { category, setCategory } = useCategory();
  const { destination, setDestination } = useDestination();

  const {
    categoriesDestinationsMap,
    categoryDestinationsMap,
    getSchemaIdForCategory,
  } = useCategoriesDestinations();

  const schemaId = useMemo(
    () => getSchemaIdForCategory(category),
    [getSchemaIdForCategory, category]
  );

  const { schema } = useSchema(schemaId);

  const schemaDefinition = useMemo(() => {
    return schema?.definition || null;
  }, [schema]);

  const { formikValidationSchema } = useRuleValidation({
    schema: schemaDefinition,
    categoryDestinationsMap: categoriesDestinationsMap,
    selectedDestination: destination,
    selectedCategory: category,
  });

  const formik = useFormik<RuleFormValues>({
    initialValues: {
      name: initialRule?.name || '',
      description: initialRule?.description || '',
      destination: destination,
      category: category,
      type: initialRule?.type || '',
      rule: initialRule?.rule || ruleUtils.createEmptyBaseRule(),
      extraProperties: initialRule?.extraProperties,
    },
    validate: formikValidationSchema,
    onSubmit: onSave,
    enableReinitialize: false,
  });

  useEffect(() => {
    if (formik.values.category !== category) {
      setCategory(formik.values.category);
    }
    if (formik.values.destination !== destination) {
      setDestination(formik.values.destination);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.category, formik.values.destination]);

  useEffect(() => {
    if (!categoryDestinationsMap || !formik.values.category) return;

    const newDestinations =
      categoryDestinationsMap[formik.values.category] || [];

    if (newDestinations.length > 0) {
      if (!newDestinations.includes(formik.values.destination)) {
        formik.setFieldValue('destination', newDestinations[0]);
      }
    }
  }, [formik.values.category, categoryDestinationsMap]);

  const updateRuleLogic = useCallback(
    (newRule: RuleType) => {
      formik.setFieldValue('rule', newRule);
    },
    [formik]
  );

  return {
    formik,
    schemaDefinition,
    updateRuleLogic,
  };
};
