import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { RuleWithMeta, Rule, RuleType } from "@/features/rules/types/rule";
import { FormikProps } from "formik";
import { RuleFormValues } from "@/features/rules/ruleBuilder/hooks/useRuleForm";

interface ExtendedRuleFormValues extends RuleFormValues {
  json?: string;
}

interface JsonRuleEditorProps {
  formik?: FormikProps<ExtendedRuleFormValues>;
  rule?: Partial<RuleWithMeta> | Partial<Rule> | RuleType;
  readOnly?: boolean;
}

const JsonRuleEditor: React.FC<JsonRuleEditorProps> = ({
  formik,
  rule,
  readOnly = false,
}) => {
  const [jsonText, setJsonText] = useState<string>("");

  // Update JSON text when rule prop or formik values change
  useEffect(() => {
    try {
      if (readOnly && rule) {
        // For read-only mode, use the provided rule
        setJsonText(JSON.stringify(rule, null, 2));
      } else if (formik) {
        // For edit mode, use formik values
        const formikRule = {
          name: formik.values.name,
          description: formik.values.description,
          destination: formik.values.destination,
          category: formik.values.category,
          rule: formik.values.rule,
        };
        setJsonText(JSON.stringify(formikRule, null, 2));
      }
    } catch (err) {
      console.error("Error converting rule to JSON", err);
      formik?.setFieldError("json", "Could not convert rule to JSON");
    }
  }, [rule, formik.values, readOnly, formik]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJsonText(text);

    if (!formik || readOnly) return;

    try {
      const parsedRule = JSON.parse(text);

      formik.setFieldValue("name", parsedRule.name);
      formik.setFieldValue("description", parsedRule.description);
      formik.setFieldValue("destination", parsedRule.destination);
      formik.setFieldValue("category", parsedRule.category);
      formik.setFieldValue("rule", parsedRule.rule);

      formik.setFieldError("json", undefined);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Invalid JSON format";
      formik.setFieldError("json", errorMessage);
    }
  };

  const getJsonError = () => {
    return formik?.errors.json;
  };

  const renderErrors = () => {
    const jsonError = getJsonError();
    if (!jsonError) return null;

    return (
      <div className="text-red-500 mt-2 flex items-start">
        <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
        <span>{jsonError}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md shadow-sm">
        <textarea
          className="w-full h-[60vh] p-4 font-mono text-sm bg-gray-50 rounded-md"
          value={jsonText}
          onChange={handleChange}
          readOnly={readOnly}
          style={{ resize: "none" }}
        />
      </div>

      {renderErrors()}
    </div>
  );
};

export default JsonRuleEditor;
