import React from "react";
import { RuleFormValues, useRuleForm } from "../hooks/useRuleForm";
import { RuleLogicBuilder } from "./RuleLogicBuilder";
import { RuleFormFields } from "./RuleFormFields";
import { FormActions } from "./FormActions";
import { RuleWithMeta } from "@/features/rules/types/rule";

interface RuleBuilderProps {
  onSave: (
    values: Omit<RuleWithMeta, "id" | "createdAt" | "updatedAt">
  ) => void;
  onCancel: () => void;
  initialRule?: RuleWithMeta;
  isLoading?: boolean;
}

const RuleBuilder: React.FC<RuleBuilderProps> = ({
  onSave,
  onCancel,
  initialRule,
  isLoading = false,
}) => {
  const {
    formik,
    optionLists,
    isLoadingOptions,
    updateRuleLogic,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useRuleForm(initialRule, onSave);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">
        {initialRule ? "Edit Rule" : "Create Rule"}
      </h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Rule Properties</h2>
            <RuleFormFields
              formik={formik}
              optionLists={optionLists}
              isLoadingOptions={isLoadingOptions}
            />
          </div>

          <div className="mb-6">
            <RuleLogicBuilder
              ruleLogic={formik.values.rule}
              handleRuleLogicChange={updateRuleLogic}
              category={formik.values.category}
              undo={undo}
              redo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
            />
          </div>

          <FormActions
            onCancel={onCancel}
            onSubmit={formik.handleSubmit}
            isLoading={isLoading}
            isDisabled={!formik.isValid || !formik.dirty}
          />
        </form>
      </div>
    </div>
  );
};

export default RuleBuilder;
