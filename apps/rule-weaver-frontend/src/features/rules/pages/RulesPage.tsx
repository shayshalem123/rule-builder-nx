import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/inputs/button";
import { PlusCircle } from "lucide-react";
import { useRules } from "../hooks/useRules";
import { getGroupedRulesByDestination } from "../utils/ruleUtils";
import RuleList from "../components/RuleList";
import RuleSearch from "../components/RuleSearch";
import { RuleWithMeta } from "../types/rule";

const RulesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: rules = [], isLoading, error, refetch } = useRules();
  const [filteredRules, setFilteredRules] = useState<RuleWithMeta[]>([]);

  const handleCreateRule = () => {
    navigate("/rules/create");
  };

  const handleEditRule = (rule: RuleWithMeta) => {
    navigate(`/rules/edit/${rule.id}`);
  };

  const handleViewRule = (rule: RuleWithMeta) => {
    navigate(`/rules/${rule.id}`);
  };

  const handleRuleDelete = () => {
    refetch();
  };

  // Group filtered rules by destination
  const groupedRules = useMemo(() => {
    return getGroupedRulesByDestination(filteredRules);
  }, [filteredRules]);

  // Set initial filtered rules when rules data loads
  useEffect(() => {
    if (rules.length > 0) {
      setFilteredRules(rules);
    }
  }, [rules]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          Error loading rules. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rules</h1>
        <Button onClick={handleCreateRule}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Rule
        </Button>
      </div>

      <div className="mb-6">
        <RuleSearch rules={rules} onFilteredRulesChange={setFilteredRules} />
      </div>

      {Object.entries(groupedRules).length === 0 && !isLoading ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No Rules Found
          </h3>
          <p className="text-gray-500 mb-4">
            {filteredRules.length !== rules.length
              ? "No rules match your search query. Try adjusting your search or clear it to see all rules."
              : "Get started by creating your first rule."}
          </p>
          {filteredRules.length === rules.length && (
            <Button onClick={handleCreateRule}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Rule
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedRules).map(
            ([destination, destinationRules]) => (
              <div key={destination}>
                <h2 className="text-xl font-semibold mb-4">
                  Destination {destination}
                </h2>
                <RuleList
                  rules={destinationRules}
                  isLoading={isLoading}
                  error={error as Error | null}
                  onCreateRule={handleCreateRule}
                  onEditRule={handleEditRule}
                  onViewRule={handleViewRule}
                  onDelete={handleRuleDelete}
                  showHeader={false}
                />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default RulesPage;
