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
import RuleDiffModal from "./RuleDiffModal";
import DiffViewButton from "@/shared/components/diff/DiffViewButton";
import RuleTestSimulator from "./RuleTestSimulator";

interface RuleBuilderProps {
  onSave: (
    values: Omit<RuleWithMeta, "id" | "createdAt" | "updatedAt">
  ) => void;
  onCancel: () => void;
  initialRule?: RuleWithMeta;
  isLoading?: boolean;
}

type TabId = "visual" | "json" | "test";

const RuleBuilder: React.FC<RuleBuilderProps> = ({
  onSave,
  onCancel,
  initialRule,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>("visual");
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);

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

  const showDiffModal = () => {
    setIsDiffModalOpen(true);
  };

  const closeDiffModal = () => {
    setIsDiffModalOpen(false);
  };

  const hasChanges = formik.dirty;
  const isEditMode = !!initialRule;

  // Create a rule object that includes the current form values
  const currentRule: RuleWithMeta = {
    id: initialRule?.id || "",
    name: formik.values.name,
    description: formik.values.description,
    destination: formik.values.destination,
    category: formik.values.category,
    rule: formik.values.rule,
    createdAt: initialRule?.createdAt,
    updatedAt: initialRule?.updatedAt,
    createdBy: initialRule?.createdBy,
    updatedBy: initialRule?.updatedBy,
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Rule" : "Create Rule"}
        </h1>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full">
        <Tabs
          defaultValue="visual"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabId)}
          className="w-full"
        >
          <TabsList className="mb-6 grid grid-cols-3 w-full">
            <TabsTrigger value="visual" className="w-full">
              <span className="relative">Visual Builder</span>
            </TabsTrigger>
            <TabsTrigger value="json" className="w-full">
              <span className="relative">JSON Editor</span>
            </TabsTrigger>
            <TabsTrigger value="test" className="w-full">
              <span className="relative">Test Simulator</span>
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

            <TabsContent value="test" className="w-full">
              <RuleTestSimulator rule={currentRule} />
            </TabsContent>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              {isEditMode ? (
                <DiffViewButton
                  onClick={showDiffModal}
                  disabled={!hasChanges}
                />
              ) : (
                <div></div>
              )}

              <div>
                <FormActions
                  onCancel={onCancel}
                  onSubmit={formik.handleSubmit}
                  isLoading={isLoading}
                  isDisabled={!formik.isValid || !formik.dirty}
                />
              </div>
            </div>
          </form>
        </Tabs>
      </div>

      {isEditMode && (
        <RuleDiffModal
          isOpen={isDiffModalOpen}
          onClose={closeDiffModal}
          initialRule={initialRule}
          currentValues={formik.values}
        />
      )}
    </div>
  );
};

export default RuleBuilder;
