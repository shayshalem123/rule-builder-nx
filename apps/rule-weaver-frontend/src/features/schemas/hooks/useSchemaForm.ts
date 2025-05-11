import { useFormik } from "formik";
import { useState, useMemo } from "react";
import * as z from "zod";
import Ajv from "ajv";
import addFormats from "ajv-formats";
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
  definition: Record<string, unknown>;
}

export const useSchemaForm = (
  initialSchema?: Schema,
  onSave?: (schema: CreateSchema) => void
) => {
  // You could fetch these from API if needed
  const [categoryOptions] = useState(defaultCategoryOptions);

  // Initialize Ajv and compile the validator for JSON Schema
  const validateJsonSchema = useMemo(() => {
    const ajvInstance = new Ajv({ allErrors: true, validateSchema: false });
    addFormats(ajvInstance);

    return (schema: unknown): { valid: boolean; errors: string | null } => {
      try {
        if (
          !schema ||
          (typeof schema === "object" &&
            Object.keys(schema as object).length === 0)
        ) {
          return { valid: true, errors: null };
        }

        const valid = ajvInstance.validateSchema(schema as object);

        if (!valid && ajvInstance.errors) {
          const errorMessage = ajvInstance.errors
            .map((err) => `${err.instancePath} ${err.message}`)
            .join("; ");
          return { valid: false, errors: errorMessage };
        }

        return { valid: true, errors: null };
      } catch (error) {
        return {
          valid: false,
          errors: error instanceof Error ? error.message : String(error),
        };
      }
    };
  }, []);

  // Create validation schema with Zod
  const validationSchema = useMemo(() => {
    const schemaValidation = z.object({
      name: z.string().min(1, "Schema name is required"),
      description: z.string().optional(),
      category: z
        .string()
        .min(1, "Category is required")
        .refine(
          (val) => categoryOptions.includes(val),
          `Category must be one of: ${categoryOptions.join(", ")}`
        ),
      version: z.string().min(1, "Version is required"),
      definition: z.record(z.string(), z.unknown()).refine(
        (def) => {
          const result = validateJsonSchema(def);
          return result.valid;
        },
        (def) => {
          const result = validateJsonSchema(def);
          return {
            message: result.errors
              ? `Invalid JSON Schema: ${result.errors}`
              : "Invalid JSON Schema",
          };
        }
      ),
    });

    return schemaValidation;
  }, [categoryOptions, validateJsonSchema]);

  // Create a custom validation function for Formik that uses Zod
  const validateWithZod = (values: unknown) => {
    const result = validationSchema.safeParse(values);
    if (result.success) return {};

    const formikErrors: Record<string, string> = {};
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formikErrors[path]) {
          formikErrors[path] = issue.message;
        }
      });
    }

    return formikErrors;
  };

  const formik = useFormik<SchemaFormValues>({
    initialValues: {
      name: initialSchema?.name || "",
      description: initialSchema?.description || "",
      category: initialSchema?.category || categoryOptions[0] || "",
      version: initialSchema?.version || "1.0.0",
      definition: initialSchema?.definition || {},
    },
    validate: validateWithZod,
    onSubmit: onSave,
  });

  return {
    formik,
    categoryOptions,
  };
};
