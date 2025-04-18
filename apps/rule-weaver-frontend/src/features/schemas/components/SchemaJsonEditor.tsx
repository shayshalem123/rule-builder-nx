import React, { useMemo } from "react";
import { FormikProps } from "formik";
import { SchemaFormValues } from "../hooks/useSchemaForm";
import JsonEditor from "@/shared/components/json/JsonEditor";

interface SchemaJsonEditorProps {
  formik: FormikProps<SchemaFormValues>;
  updateFormik: (values: SchemaFormValues) => void;
}

const SchemaJsonEditor: React.FC<SchemaJsonEditorProps> = ({
  formik,
  updateFormik,
}) => {
  // Derive a comprehensive JSON object that includes all form fields
  const jsonObject = useMemo(() => {
    const { name, description, category, version, definition } = formik.values;

    return {
      name,
      description,
      category,
      version,
      definition,
    };
  }, [formik.values]);

  const handleJsonChange = (parsedJson: Record<string, unknown>) => {
    updateFormik({
      ...formik.values,
      name: parsedJson.name as string,
      description: parsedJson.description as string,
      category: parsedJson.category as string,
      version: parsedJson.version as string,
      definition: parsedJson.definition as Record<string, any>,
    });
  };

  return (
    <div className="[&_.absolute.top-2]:right-5">
      <JsonEditor
        value={jsonObject}
        onChange={handleJsonChange}
        height="500px"
      />
    </div>
  );
};

export { SchemaJsonEditor };
