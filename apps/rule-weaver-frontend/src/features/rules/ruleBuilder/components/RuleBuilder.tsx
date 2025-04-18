import React, { useState } from "react";
import { RuleFormValues, useRuleForm } from "../hooks/useRuleForm";
import { RuleLogicBuilder } from "./RuleLogicBuilder";
import { RuleFormFields } from "./RuleFormFields";
import { FormActions } from "./FormActions";
import { RuleWithMeta } from "@/features/rules/types/rule";
import RuleJsonEditor from "../../shared/components/RuleJsonEditor";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/inputs/tabs";

interface RuleBuilderProps {
  onSave: (
    values: Omit<RuleWithMeta, "id" | "createdAt" | "updatedAt">
  ) => void;
  onCancel: () => void;
  initialRule?: RuleWithMeta;
  isLoading?: boolean;
}

type TabId = "visual" | "json";

const RuleBuilder: React.FC<RuleBuilderProps> = ({
  onSave,
  onCancel,
  initialRule,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>("visual");

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

  const updateFormik = (values: RuleFormValues) => {
    formik.setValues(values);
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {initialRule ? "Edit Rule" : "Create Rule"}
      </h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full">
        <Tabs
          defaultValue="visual"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabId)}
          className="w-full"
        >
          <TabsList className="mb-6 grid grid-cols-2 w-full">
            <TabsTrigger value="visual" className="w-full">
              <span className="relative">Visual Builder</span>
            </TabsTrigger>
            <TabsTrigger value="json" className="w-full">
              <span className="relative">JSON Editor</span>
            </TabsTrigger>
          </TabsList>

          <form onSubmit={formik.handleSubmit} className="space-y-6 w-full">
            <TabsContent value="visual" className="w-full">
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
            </TabsContent>

            <TabsContent value="json" className="w-full">
              <RuleJsonEditor formik={formik} updateFormik={updateFormik} />
            </TabsContent>

            <FormActions
              onCancel={onCancel}
              onSubmit={formik.handleSubmit}
              isLoading={isLoading}
              isDisabled={!formik.isValid || !formik.dirty}
            />
          </form>
        </Tabs>
      </div>
    </div>
  );
};

export default RuleBuilder;
