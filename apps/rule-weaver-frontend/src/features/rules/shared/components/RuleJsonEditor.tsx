import React, { useMemo } from "react";
import { FormikProps } from "formik";
import { RuleFormValues } from "@/features/rules/ruleBuilder/hooks/useRuleForm";
import JsonEditor from "@/shared/components/json/JsonEditor";

export interface RuleFormValuesWithJson extends RuleFormValues {
  json?: string;
}

interface RuleJsonEditorProps {
  formik: FormikProps<RuleFormValuesWithJson>;
}

const RuleJsonEditor: React.FC<RuleJsonEditorProps> = ({ formik }) => {
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
    formik.setFieldValue("name", parsedJson.name);
    formik.setFieldValue("description", parsedJson.description);
    formik.setFieldValue("destination", parsedJson.destination);
    formik.setFieldValue("category", parsedJson.category);
    formik.setFieldValue("rule", parsedJson.rule);
    formik.setFieldError("json", undefined);
  };

  return <JsonEditor value={jsonObject} onChange={handleJsonChange} />;
};

export default RuleJsonEditor;
