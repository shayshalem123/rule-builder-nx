import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { useRules } from "../hooks/useRules";
import { getGroupedRulesByDestination } from "../utils/ruleUtils";
import RuleSearch from "../components/RuleSearch";
import { RuleWithMeta } from "../types/rule";
import PageHeader from "@/shared/components/PageHeader";
import EmptyStateMessage from "../components/EmptyStateMessage";
import ErrorMessage from "@/shared/components/ErrorMessage";
import DestinationRulesSection from "../components/DestinationRulesSection";

const RulesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: rules = [], isLoading, error, refetch } = useRules();
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateRule = () => {
    navigate("/rules/create");
  };

  const filteredRules = useMemo(() => {
    if (!searchQuery.trim()) return rules;

    const lowerQuery = searchQuery.toLowerCase();
    return rules.filter((rule) => {
      const searchableValues = [
        rule.name,
        rule.description || "",
        rule.category,
        rule.destination,
      ].map((value) => value.toLowerCase());

      return searchableValues.some((value) => value.includes(lowerQuery));
    });
  }, [rules, searchQuery]);

  const groupedRules = useMemo(() => {
    return getGroupedRulesByDestination(filteredRules);
  }, [filteredRules]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <ErrorMessage message="Error loading rules. Please try again." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Rules"
        actionButton={{
          label: "Create Rule",
          onClick: handleCreateRule,
          icon: <PlusCircle className="mr-2 h-4 w-4" />,
        }}
      />

      <div className="mb-6">
        <RuleSearch
          onSearch={handleSearch}
          initialQuery={searchQuery}
          placeholder="Search rules by name, description, category, or destination..."
        />
      </div>

      {Object.entries(groupedRules).length === 0 && !isLoading ? (
        <EmptyStateMessage
          title="No Rules Found"
          message={
            filteredRules.length !== rules.length
              ? "No rules match your search query. Try adjusting your search or clear it to see all rules."
              : "Get started by creating your first rule."
          }
          actionButton={
            filteredRules.length === rules.length
              ? {
                  label: "Create Rule",
                  onClick: handleCreateRule,
                  icon: <PlusCircle className="mr-2 h-4 w-4" />,
                }
              : undefined
          }
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedRules).map(
            ([destination, destinationRules]) => (
              <DestinationRulesSection
                key={destination}
                destination={destination}
                rules={destinationRules}
                isLoading={isLoading}
                error={error as Error | null}
                onCreateRule={handleCreateRule}
                refetch={refetch}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default RulesPage;
