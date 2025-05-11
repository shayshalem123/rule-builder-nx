import React from "react";
import { FormikProps } from "formik";
import { Input } from "@/shared/components/inputs/input";
import { Textarea } from "@/shared/components/inputs/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/inputs/select";
import { SchemaFormValues } from "../hooks/useSchemaForm";
import { AlertCircle } from "lucide-react";

interface SchemaFormFieldsProps {
  formik: FormikProps<SchemaFormValues>;
  categoryOptions: string[];
}

export const SchemaFormFields: React.FC<SchemaFormFieldsProps> = ({
  formik,
  categoryOptions,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name *
          </label>
          <Input
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Schema name"
            className={
              formik.touched.name && formik.errors.name ? "border-red-500" : ""
            }
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm mt-1 flex items-start">
              <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
              <span>{formik.errors.name}</span>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="version"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Version *
          </label>
          <Input
            id="version"
            name="version"
            value={formik.values.version}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="1.0.0"
            className={
              formik.touched.version && formik.errors.version
                ? "border-red-500"
                : ""
            }
          />
          {formik.touched.version && formik.errors.version && (
            <div className="text-red-500 text-sm mt-1 flex items-start">
              <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
              <span>{formik.errors.version}</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Describe the purpose of this schema"
          className="min-h-[80px]"
        />
        {formik.touched.description && formik.errors.description && (
          <div className="text-red-500 text-sm mt-1 flex items-start">
            <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
            <span>{formik.errors.description}</span>
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category *
        </label>
        <Select
          name="category"
          value={formik.values.category}
          onValueChange={(value) => {
            formik.setFieldValue("category", value);
            formik.setFieldTouched("category", true);
          }}
        >
          <SelectTrigger
            id="category"
            className={
              formik.touched.category && formik.errors.category
                ? "border-red-500"
                : ""
            }
          >
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formik.touched.category && formik.errors.category && (
          <div className="text-red-500 text-sm mt-1 flex items-start">
            <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
            <span>{formik.errors.category}</span>
          </div>
        )}
      </div>
    </div>
  );
};
