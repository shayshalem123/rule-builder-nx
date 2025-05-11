import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RuleForm, TabId } from "./RuleForm";
import { useRuleContext } from "../contexts/RuleFormContext";
import { cn } from "@/shared/utils/cn";
import { createRuleObjectFromValues } from "../../shared";
import { RuleFormValues } from "../hooks/useRuleForm";
import { RuleWithMeta } from "../../types/rule";

const RuleBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("visual");
  const [formValues, setFormValues] = useState<RuleFormValues | null>(null);

  const navigate = useNavigate();
  const { mode, initialRule } = useRuleContext();

  // Create a preview rule object from form values for impact analysis
  const previewRule = useMemo(() => {
    if (!formValues) return initialRule;

    try {
      const ruleObject = createRuleObjectFromValues(
        formValues,
        initialRule
      ) as RuleWithMeta;
      return ruleObject;
    } catch (error) {
      console.error("Error creating preview rule:", error);
      return initialRule;
    }
  }, [formValues, initialRule]);

  const handleCancel = () => {
    navigate("/rules");
  };

  const handleFormValuesChange = (values: RuleFormValues) => {
    setFormValues(values);
  };

  return (
    <div className="space-y-6 w-full pb-20 relative min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {mode === "edit" ? "Edit Rule" : "Create Rule"}
        </h1>
      </div>

      <div className="bg-background-secondary rounded-lg shadow-sm border border-border-primary p-6">
        <RuleForm
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onCancel={handleCancel}
          onFormValuesChange={handleFormValuesChange}
          previewRule={previewRule}
        />
      </div>
    </div>
  );
};

export default RuleBuilder;
