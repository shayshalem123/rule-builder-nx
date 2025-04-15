import React, { useState } from "react";
import { RuleType, RuleWithMeta } from "@/features/rules/types/rule";
import { Button } from "@/shared/components/inputs/button";
import { Input } from "@/shared/components/inputs/input";
import { Textarea } from "@/shared/components/inputs/textarea";
import GroupRuleComponent from "./GroupRuleComponent";
import * as ruleUtils from "@/features/rules/utils/ruleUtils";
import BaseRuleComponent from "./BaseRuleComponent";

interface RuleBuilderProps {
  initialRule?: RuleWithMeta;
  onSave: (rule: Omit<RuleWithMeta, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const RuleBuilder: React.FC<RuleBuilderProps> = ({
  initialRule,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const [name, setName] = useState(initialRule?.name || "");
  const [description, setDescription] = useState(
    initialRule?.description || ""
  );

  // Extract the rule logic part (without metadata like name, description)
  const getInitialRuleLogic = (): RuleType => {
    if (!initialRule) return ruleUtils.createEmptyBaseRule();

    const { name, description, createdAt, updatedAt, ...ruleLogic } =
      initialRule;
    return ruleLogic as RuleType;
  };

  const [rule, setRule] = useState<RuleType>(getInitialRuleLogic());

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please provide a name for the rule");
      return;
    }

    // Combine the rule logic with metadata
    const fullRule: Omit<RuleWithMeta, "id" | "createdAt" | "updatedAt"> = {
      ...rule,
      name,
      description: description.trim() ? description : undefined,
    };

    onSave(fullRule);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {initialRule ? "Edit Rule" : "Create New Rule"}
        </h2>

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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a descriptive name for this rule"
              required
            />
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose of this rule"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Rule Configuration
        </h3>
        {ruleUtils.isBaseRule(rule) ? (
          <BaseRuleComponent rule={rule as any} onChange={setRule} />
        ) : (
          <GroupRuleComponent rule={rule as any} onChange={setRule} />
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isLoading || !name.trim()}>
          {isLoading ? "Saving..." : "Save Rule"}
        </Button>
      </div>
    </div>
  );
};

export default RuleBuilder;
