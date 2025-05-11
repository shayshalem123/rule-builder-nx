import React, { createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { RuleWithMeta } from "@/features/rules/types/rule";
import { useCreateRule, useUpdateRule } from "../hooks/useRuleBuilder";

type RuleFormContextType = {
  isSavingRule: boolean;
  mode: "create" | "edit";
  onSave: (rule: Omit<RuleWithMeta, "id" | "createdAt" | "updatedAt">) => void;
  initialRule?: RuleWithMeta;
};

const RuleFormContext = createContext<RuleFormContextType | undefined>(
  undefined
);

interface RuleFormProviderProps {
  children: ReactNode;
  initialRule?: RuleWithMeta;
  mode: "create" | "edit";
  ruleId?: string;
}

export const RuleFormProvider: React.FC<RuleFormProviderProps> = ({
  children,
  initialRule,
  mode,
  ruleId,
}) => {
  const navigate = useNavigate();
  const createRuleMutation = useCreateRule();
  const updateRuleMutation = useUpdateRule();

  const isSavingRule =
    mode === "create"
      ? createRuleMutation.isPending
      : updateRuleMutation.isPending;

  const handleSave = (
    rule: Omit<RuleWithMeta, "id" | "createdAt" | "updatedAt">
  ) => {
    if (mode === "create") {
      createRuleMutation.mutate(rule, {
        onSuccess: () => {
          navigate("/rules");
        },
      });
    } else if (mode === "edit" && ruleId) {
      updateRuleMutation.mutate(
        { id: ruleId, rule },
        {
          onSuccess: () => {
            navigate("/rules");
          },
        }
      );
    }
  };

  return (
    <RuleFormContext.Provider
      value={{
        initialRule,
        isSavingRule,
        onSave: handleSave,
        mode,
      }}
    >
      {children}
    </RuleFormContext.Provider>
  );
};

export const useRuleContext = (): RuleFormContextType => {
  const context = useContext(RuleFormContext);

  if (context === undefined) {
    throw new Error("useRuleForm must be used within a RuleFormProvider");
  }
  return context;
};
