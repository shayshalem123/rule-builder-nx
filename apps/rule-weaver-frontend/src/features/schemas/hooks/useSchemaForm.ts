import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import {
  Schema,
  CreateSchema,
  categoryOptions as defaultCategoryOptions,
} from "../types/schema";

// Define the form values type
export interface SchemaFormValues {
  name: string;
  description: string;
  category: string;
  version: string;
  definition: Record<string, any>;
}

export const useSchemaForm = (
  initialSchema?: Schema,
  onSave?: (schema: CreateSchema) => void
) => {
  // You could fetch these from API if needed
  const [categoryOptions] = useState(defaultCategoryOptions);

  const validationSchema = Yup.object({
    name: Yup.string().required("Schema name is required"),
    description: Yup.string(),
    category: Yup.string()
      .required("Category is required")
      .oneOf(
        categoryOptions,
        `Category must be one of: ${categoryOptions.join(", ")}`
      ),
    version: Yup.string().required("Version is required"),
    definition: Yup.object().required("Schema definition is required"),
  });

  const formik = useFormik<SchemaFormValues>({
    initialValues: {
      name: initialSchema?.name || "",
      description: initialSchema?.description || "",
      category: initialSchema?.category || categoryOptions[0] || "",
      version: initialSchema?.version || "1.0.0",
      definition: initialSchema?.definition,
    },
    validationSchema,
    onSubmit: (values) => {
      if (!onSave) return;

      const schemaData: CreateSchema = {
        ...values,
        description: values.description.trim() ? values.description : undefined,
      };

      onSave(schemaData);
    },
  });

  return {
    formik,
    categoryOptions,
  };
};
