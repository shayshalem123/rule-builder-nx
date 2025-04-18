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
import { RuleFormValues } from "../hooks/useRuleForm";
import { AlertCircle } from "lucide-react";

interface RuleFormFieldsProps {
  formik: FormikProps<RuleFormValues>;
  optionLists: {
    destinationOptions: string[];
    categoryOptions: string[];
  };
  isLoadingOptions: boolean;
}

export const RuleFormFields: React.FC<RuleFormFieldsProps> = ({
  formik,
  optionLists,
  isLoadingOptions,
}) => {
  // Helper function to display custom warning if the selected value is not in the options list
  const isValueInOptions = (value: string, options: string[]) => {
    return options.includes(value);
  };

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Rule Name *
        </label>
        <Input
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter a descriptive name for this rule"
          required
          className={
            formik.touched.name && formik.errors.name ? "border-red-500" : ""
          }
        />
        {formik.touched.name && formik.errors.name && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            disabled={isLoadingOptions}
          >
            <SelectTrigger
              id="category"
              className={
                (formik.touched.category && formik.errors.category) ||
                !isValueInOptions(
                  formik.values.category,
                  optionLists.categoryOptions
                )
                  ? "border-red-500"
                  : ""
              }
            >
              <SelectValue
                placeholder={
                  isLoadingOptions ? "Loading..." : "Select category"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {optionLists.categoryOptions.length > 0 ? (
                optionLists.categoryOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  {isLoadingOptions
                    ? "Loading categories..."
                    : "No categories available"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {formik.touched.category && formik.errors.category && (
            <div className="text-red-500 text-sm mt-1 flex items-start">
              <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
              <span>{formik.errors.category}</span>
            </div>
          )}
          {!isValueInOptions(
            formik.values.category,
            optionLists.categoryOptions
          ) &&
            !formik.errors.category && (
              <div className="text-amber-500 text-sm mt-1 flex items-start">
                <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                <span>
                  Warning: Selected value '{formik.values.category}' is not in
                  the current list of available categories
                </span>
              </div>
            )}
        </div>

        <div>
          <label
            htmlFor="destination"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Destination *
          </label>
          <Select
            name="destination"
            value={formik.values.destination}
            onValueChange={(value) => {
              formik.setFieldValue("destination", value);
              formik.setFieldTouched("destination", true);
            }}
            disabled={isLoadingOptions}
          >
            <SelectTrigger
              id="destination"
              className={
                (formik.touched.destination && formik.errors.destination) ||
                !isValueInOptions(
                  formik.values.destination,
                  optionLists.destinationOptions
                )
                  ? "border-red-500"
                  : ""
              }
            >
              <SelectValue
                placeholder={
                  isLoadingOptions ? "Loading..." : "Select destination"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {optionLists.destinationOptions.length > 0 ? (
                optionLists.destinationOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  {isLoadingOptions
                    ? "Loading destinations..."
                    : "No destinations available"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {formik.touched.destination && formik.errors.destination && (
            <div className="text-red-500 text-sm mt-1 flex items-start">
              <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
              <span>{formik.errors.destination}</span>
            </div>
          )}
          {!isValueInOptions(
            formik.values.destination,
            optionLists.destinationOptions
          ) &&
            !formik.errors.destination && (
              <div className="text-amber-500 text-sm mt-1 flex items-start">
                <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                <span>
                  Warning: Selected value '{formik.values.destination}' is not
                  in the current list of available destinations
                </span>
              </div>
            )}
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description (optional)
        </label>
        <Textarea
          id="description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Describe the purpose of this rule"
          rows={3}
        />
      </div>
    </div>
  );
};
