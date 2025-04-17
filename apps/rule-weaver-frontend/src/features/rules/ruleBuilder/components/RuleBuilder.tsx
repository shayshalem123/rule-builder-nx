import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  RuleType,
  RuleWithMeta,
  destinationOptions as defaultDestinationOptions,
  categoryOptions as defaultCategoryOptions,
} from "@/features/rules/types/rule";
import { Button } from "@/shared/components/inputs/button";
import { Input } from "@/shared/components/inputs/input";
import { Textarea } from "@/shared/components/inputs/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/inputs/select";
import GroupRuleComponent from "../components/groupRule/GroupRuleComponent";
import * as ruleUtils from "@/features/rules/shared/utils/ruleUtils";
import BaseRuleComponent from "../components/baseRule";
import { ruleService } from "@/features/rules/services/ruleService";
import useRuleHistory from "../hooks/useRuleHistory";
import RuleBuilderHeader from "./ruleEditor/RuleBuilderHeader";

interface RuleBuilderProps {
  initialRule?: RuleWithMeta;
  onSave: (rule: Omit<RuleWithMeta, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Form validation schema
const validationSchema = Yup.object({
  name: Yup.string().required("Rule name is required"),
  description: Yup.string(),
  destination: Yup.string().required("Destination is required"),
  category: Yup.string().required("Category is required"),
});

const RuleBuilder: React.FC<RuleBuilderProps> = ({
  initialRule,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const [optionLists, setOptionLists] = useState({
    destinationOptions: defaultDestinationOptions,
    categoryOptions: defaultCategoryOptions,
  });
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const getInitialRuleLogic = (): RuleType => {
    if (!initialRule) return ruleUtils.createEmptyBaseRule();
    return initialRule.rule || ruleUtils.createEmptyBaseRule();
  };

  const {
    rule: ruleLogic,
    updateRule: handleRuleLogicChange,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useRuleHistory(getInitialRuleLogic());

  const formik = useFormik({
    initialValues: {
      name: initialRule?.name || "",
      description: initialRule?.description || "",
      destination: initialRule?.destination || "A",
      category: initialRule?.category || "partners-images",
    },
    validationSchema,
    onSubmit: (values) => {
      // Combine form values with rule logic
      const fullRule: Omit<RuleWithMeta, "id" | "createdAt" | "updatedAt"> = {
        ...values,
        description: values.description.trim() ? values.description : undefined,
        rule: ruleLogic,
      };

      onSave(fullRule);
    },
  });

  // Fetch option lists
  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoadingOptions(true);

      try {
        const [fetchedDestinations, fetchedCategories] = await Promise.all([
          ruleService.getDestinations(),
          ruleService.getCategories(),
        ]);

        setOptionLists({
          destinationOptions: fetchedDestinations,
          categoryOptions: fetchedCategories,
        });
      } catch (error) {
        console.error("Error fetching options:", error);
        // Fallback to defaults is handled by initial state
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {initialRule ? "Edit Rule" : "Create New Rule"}
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-3">
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
                formik.touched.name && formik.errors.name
                  ? "border-red-500"
                  : ""
              }
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.name}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                onValueChange={(value) =>
                  formik.setFieldValue("destination", value)
                }
                disabled={isLoadingOptions}
              >
                <SelectTrigger
                  id="destination"
                  className={
                    formik.touched.destination && formik.errors.destination
                      ? "border-red-500"
                      : ""
                  }
                >
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {optionLists.destinationOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.destination && formik.errors.destination && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.destination}
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
                onValueChange={(value) =>
                  formik.setFieldValue("category", value)
                }
                disabled={isLoadingOptions}
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
                  {optionLists.categoryOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.category && formik.errors.category && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.category}
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
        </form>
      </div>

      <div className="mt-8 space-y-4">
        <RuleBuilderHeader
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />

        {ruleUtils.isBaseRule(ruleLogic) ? (
          <BaseRuleComponent
            rule={ruleLogic}
            onChange={handleRuleLogicChange}
            showDelete={false}
            category={formik.values.category}
          />
        ) : (
          <GroupRuleComponent
            rule={ruleLogic}
            onChange={handleRuleLogicChange}
            category={formik.values.category}
          />
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading || isLoadingOptions}
          type="button"
        >
          Cancel
        </Button>
        <Button
          onClick={() => formik.handleSubmit()}
          disabled={
            isLoading || isLoadingOptions || !formik.isValid || !formik.dirty
          }
          type="button"
        >
          {isLoading ? "Saving..." : "Save Rule"}
        </Button>
      </div>
    </div>
  );
};

export default RuleBuilder;
