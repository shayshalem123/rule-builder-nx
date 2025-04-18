import React, { useMemo } from "react";
import { FormikProps } from "formik";
import { RuleFormValues } from "@/features/rules/ruleBuilder/hooks/useRuleForm";
import JsonEditor from "@/shared/components/json/JsonEditor";
import { RuleType } from "../../types/rule";

export interface RuleFormValuesWithJson extends RuleFormValues {
  json?: string;
}

interface RuleJsonEditorProps {
  formik: FormikProps<RuleFormValuesWithJson>;
  updateFormik: (values: RuleFormValuesWithJson) => void;
}

const RuleJsonEditor: React.FC<RuleJsonEditorProps> = ({
  formik,
  updateFormik,
}) => {
  const jsonObject = useMemo(() => {
    const { name, description, destination, category, rule } = formik.values;

    return {
      name,
      description,
      destination,
      category,
      rule,
    };
  }, [formik]);

  const handleJsonChange = (parsedJson: Record<string, unknown>) => {
    updateFormik({
      ...formik.values,
      name: parsedJson.name as string,
      description: parsedJson.description as string,
      destination: parsedJson.destination as string,
      category: parsedJson.category as string,
      rule: parsedJson.rule as RuleType,
    });
  };

  return <JsonEditor value={jsonObject} onChange={handleJsonChange} />;
};

export default RuleJsonEditor;
