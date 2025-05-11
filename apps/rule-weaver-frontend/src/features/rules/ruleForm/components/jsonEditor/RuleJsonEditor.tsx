import React, { useMemo, useState } from "react";
import { FormikProps } from "formik";
import { RuleFormValues } from "@/features/rules/ruleForm/hooks/useRuleForm";
import JsonEditor from "@/shared/components/jsonEditor/JsonEditor";
import { RuleType } from "../../../types/rule";
import { SchemaDefinition } from "@/features/schemas/types/schema";
import { createRuleObjectFromValues } from "../../../shared/utils/ruleUtils";
import { useCategoriesDestinations } from "@/features/rules/hooks/useCategoriesDestinations";
import { useRuleJsonValidation } from "./hooks/useRuleJsonValidation";

export interface RuleFormValuesWithJson extends RuleFormValues {
  json?: string;
}

interface RuleJsonEditorProps {
  formik: FormikProps<RuleFormValuesWithJson>;
  updateFormik: (values: RuleFormValuesWithJson) => void;
  schema?: SchemaDefinition | null;
}

const RuleJsonEditor: React.FC<RuleJsonEditorProps> = ({
  formik,
  updateFormik,
  schema = null,
}) => {
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    formik.values.destination
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    formik.values.category
  );

  const { categoryDestinationsMap, categories: categoryOptions } =
    useCategoriesDestinations();

  const destinationOptions = useMemo(() => {
    if (!selectedCategory) return [];
    return categoryDestinationsMap[selectedCategory] || [];
  }, [categoryDestinationsMap, selectedCategory]);

  const { ruleJsonSchema } = useRuleJsonValidation({
    categoryDestinationsMap,
    schema,
    selectedDestination,
    selectedCategory,
  });

  const jsonObject = useMemo(() => {
    return createRuleObjectFromValues(formik.values);
  }, [formik.values]);

  const handleJsonChange = async (parsedJson: Record<string, unknown>) => {
    const newValues = {
      ...formik.values,
      name: parsedJson.name as string,
      description: parsedJson.description as string,
      destination: parsedJson.destination as string,
      category: parsedJson.category as string,
      type: parsedJson.type as string,
      rule: parsedJson.rule as RuleType,
      extraProperties: parsedJson.extraProperties as Record<string, unknown>,
    };

    if (
      selectedCategory !== newValues.category &&
      categoryOptions.includes(newValues.category)
    ) {
      setSelectedCategory(newValues.category);
    }

    if (
      selectedDestination !== newValues.destination &&
      destinationOptions.includes(newValues.destination)
    ) {
      setSelectedDestination(newValues.destination);
    }

    const errors = await formik.validateForm(newValues);

    if (Object.keys(errors).length === 0) {
      updateFormik(newValues);
    }
  };

  return (
    <div className="space-y-2 h-full">
      <JsonEditor
        value={jsonObject}
        onChange={handleJsonChange}
        jsonSchema={ruleJsonSchema}
      />
    </div>
  );
};

export default RuleJsonEditor;
