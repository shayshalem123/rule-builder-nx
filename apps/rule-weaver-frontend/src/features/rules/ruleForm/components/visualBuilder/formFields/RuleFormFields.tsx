import React, { useEffect, useMemo } from "react";
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
import { RuleFormValues } from "../../../hooks/useRuleForm";
import { AlertCircle } from "lucide-react";
import { ExtraPropertiesFields } from "./ExtraPropertiesFields";
import { useCategoriesDestinations } from "@/features/rules/hooks/useCategoriesDestinations";

interface RuleFormFieldsProps {
  formik: FormikProps<RuleFormValues>;
}

export const RuleFormFields: React.FC<RuleFormFieldsProps> = ({ formik }) => {
  const {
    categoryDestinationsMap,
    categoriesDestinationsMap,
    categories: categoryOptions,
    isLoading,
  } = useCategoriesDestinations();

  const destinationOptions = useMemo(() => {
    return categoryDestinationsMap[formik.values.category] || [];
  }, [categoryDestinationsMap, formik.values.category]);

  const typeOptions = useMemo(() => {
    return (
      categoriesDestinationsMap[formik.values.category]?.destinations?.[
        formik.values.destination
      ]?.typeOptions?.options || []
    );
  }, [
    categoriesDestinationsMap,
    formik.values.category,
    formik.values.destination,
  ]);

  const typeFieldName = useMemo(() => {
    return (
      categoriesDestinationsMap[formik.values.category]?.destinations?.[
        formik.values.destination
      ]?.typeOptions?.fieldName || "type"
    );
  }, [
    categoriesDestinationsMap,
    formik.values.category,
    formik.values.destination,
  ]);

  const isValueInOptions = (value: string, options: string[]) => {
    return options.includes(value);
  };

  const handleCategoryChange = (value: string) => {
    formik.setFieldTouched("category", true);
    formik.setValues({
      ...formik.values,
      category: value,
      ...(value !== formik.values.category
        ? { extraProperties: undefined }
        : { extraProperties: {} }),
    });
  };

  const handleDestinationChange = (value: string) => {
    formik.setFieldTouched("destination", true);
    formik.setValues({
      ...formik.values,
      destination: value,
      ...(value !== formik.values.destination
        ? { extraProperties: undefined }
        : { extraProperties: {} }),
    });
  };

  const handleTypeChange = (value: string) => {
    formik.setFieldTouched("type", true);
    formik.setValues({
      ...formik.values,
      type: value,
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-text-secondary mb-1"
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
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.name}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-text-secondary mb-1"
          >
            Category *
          </label>
          <Select
            name="category"
            value={formik.values.category}
            onValueChange={handleCategoryChange}
            disabled={isLoading}
          >
            <SelectTrigger
              id="category"
              className={
                (formik.touched.category && formik.errors.category) ||
                !isValueInOptions(formik.values.category, categoryOptions)
                  ? "border-red-500"
                  : ""
              }
            >
              <SelectValue
                placeholder={isLoading ? "Loading..." : "Select category"}
              />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.length > 0 ? (
                categoryOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-categories" disabled>
                  {isLoading
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
          {!isValueInOptions(formik.values.category, categoryOptions) &&
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="destination"
            className="block text-sm font-medium text-text-secondary mb-1"
          >
            Destination *
          </label>
          <Select
            name="destination"
            value={formik.values.destination}
            onValueChange={handleDestinationChange}
            disabled={isLoading}
          >
            <SelectTrigger
              id="destination"
              className={
                (formik.touched.destination && formik.errors.destination) ||
                !isValueInOptions(formik.values.destination, destinationOptions)
                  ? "border-red-500"
                  : ""
              }
            >
              <SelectValue
                placeholder={isLoading ? "Loading..." : "Select destination"}
              />
            </SelectTrigger>
            <SelectContent>
              {destinationOptions.length > 0 ? (
                destinationOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-destinations" disabled>
                  {isLoading
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
          {!isValueInOptions(formik.values.destination, destinationOptions) &&
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

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-text-secondary mb-1"
          >
            {typeFieldName} *
          </label>
          <Select
            name="type"
            value={formik.values.type}
            onValueChange={handleTypeChange}
            disabled={isLoading}
          >
            <SelectTrigger
              id="type"
              className={
                (formik.touched.type && formik.errors.type) ||
                !isValueInOptions(formik.values.type, typeOptions)
                  ? "border-red-500"
                  : ""
              }
            >
              <SelectValue
                placeholder={isLoading ? "Loading..." : "Select type"}
              />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.length > 0 ? (
                typeOptions.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-types" disabled>
                  {isLoading ? "Loading types..." : "No types available"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {formik.touched.type && formik.errors.type && (
            <div className="text-red-500 text-sm mt-1 flex items-start">
              <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
              <span>{formik.errors.type}</span>
            </div>
          )}
          {!isValueInOptions(formik.values.type, typeOptions) &&
            !formik.errors.type &&
            formik.touched.type && (
              <div className="text-amber-500 text-sm mt-1 flex items-start">
                <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                <span>
                  Warning: Selected value '{formik.values.type}' is not in the
                  current list of available types
                </span>
              </div>
            )}
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-text-secondary mb-1"
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

      {formik.values.category && formik.values.destination && (
        <ExtraPropertiesFields formik={formik} />
      )}
    </div>
  );
};
