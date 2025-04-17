import React from "react";
import { useNavigate } from "react-router-dom";
import { RuleBuilder } from "./components";
import { useCreateRule } from "./hooks/useRuleBuilder";
import { Rule } from "@/features/rules/types/rule";

const CreateRulePage: React.FC = () => {
  const navigate = useNavigate();
  const createRuleMutation = useCreateRule();

  const handleSave = (rule: Omit<Rule, "id">) => {
    createRuleMutation.mutate(rule, {
      onSuccess: () => {
        navigate("/rules");
      },
    });
  };

  const handleCancel = () => {
    navigate("/rules");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <RuleBuilder
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={createRuleMutation.isPending}
      />
    </div>
  );
};

export default CreateRulePage;
