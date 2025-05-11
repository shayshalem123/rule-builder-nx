import React from "react";
import { FormikProps } from "formik";
import { SchemaFormValues } from "../hooks/useSchemaForm";
import JsonEditor from "@/shared/components/jsonEditor/JsonEditor";
import { jsonMetaSchema } from "@/shared/jsonMetaSchema";

interface SchemaDefinitionEditorProps {
  formik: FormikProps<SchemaFormValues>;
}

const SchemaDefinitionEditor: React.FC<SchemaDefinitionEditorProps> = ({
  formik,
}) => {
  const handleJsonChange = (parsedJson: Record<string, unknown>) => {
    formik.setFieldValue("definition", parsedJson);
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="definition"
        className="block text-sm font-medium text-text-secondary"
      >
        Schema Definition (JSON)
      </label>
      <div className="[&_.absolute.top-2]:right-5">
        <JsonEditor
          value={formik.values.definition}
          jsonSchema={jsonMetaSchema}
          onChange={handleJsonChange}
          height="300px"
        />
      </div>
      {formik.touched.definition && formik.errors.definition && (
        <div className="text-red-500 text-sm mt-1">
          {formik.errors.definition.toString()}
        </div>
      )}
    </div>
  );
};

export { SchemaDefinitionEditor };
