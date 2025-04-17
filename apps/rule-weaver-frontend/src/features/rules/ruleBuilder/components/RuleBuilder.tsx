import React, { useState, useEffect } from "react";
import {
  RuleType,
  RuleWithMeta,
  destinationOptions,
  categoryOptions,
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
import GroupRuleComponent from "@/features/rules/components/groupRule/GroupRuleComponent";
import * as ruleUtils from "@/features/rules/shared/utils/ruleUtils";
import BaseRuleComponent from "@/features/rules/components/baseRule";
import { ruleService } from "@/features/rules/services/ruleService";
import { RuleBuilderHeader } from "./ruleEditor";
import useRuleHistory from "../hooks/useRuleHistory";

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
  const [destination, setDestination] = useState(
    initialRule?.destination || "A"
  );
  const [category, setCategory] = useState(
    initialRule?.category || "partners-images"
  );

  const [destinations, setDestinations] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

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

  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const [fetchedDestinations, fetchedCategories] = await Promise.all([
          ruleService.getDestinations(),
          ruleService.getCategories(),
        ]);

        setDestinations(fetchedDestinations);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching options:", error);
        // Fallback to hardcoded options
        setDestinations(destinationOptions);
        setCategories(categoryOptions);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please provide a name for the rule");
      return;
    }

    if (!destination) {
      alert("Please select a destination");
      return;
    }

    if (!category) {
      alert("Please select a category");
      return;
    }

    // Combine the rule logic with metadata
    const fullRule: Omit<RuleWithMeta, "id" | "createdAt" | "updatedAt"> = {
      name,
      description: description.trim() ? description : undefined,
      destination,
      category,
      rule: ruleLogic,
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="destination"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Destination *
              </label>
              <Select
                value={destination}
                onValueChange={setDestination}
                disabled={isLoadingOptions}
              >
                <SelectTrigger id="destination">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category *
              </label>
              <Select
                value={category}
                onValueChange={setCategory}
                disabled={isLoadingOptions}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose of this rule"
              rows={3}
            />
          </div>
        </div>
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
            category={category}
          />
        ) : (
          <GroupRuleComponent
            rule={ruleLogic}
            onChange={handleRuleLogicChange}
            category={category}
          />
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading || isLoadingOptions}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={
            isLoading ||
            isLoadingOptions ||
            !name.trim() ||
            !destination ||
            !category
          }
        >
          {isLoading ? "Saving..." : "Save Rule"}
        </Button>
      </div>
    </div>
  );
};

export default RuleBuilder;
