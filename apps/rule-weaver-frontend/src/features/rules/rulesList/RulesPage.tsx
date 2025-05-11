import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, X } from "lucide-react";
import { useRulesList } from "./hooks/useRulesList";
import { useCategoriesDestinations } from "@/features/rules/hooks/useCategoriesDestinations";
import {
  getGroupedRulesByDestination,
  filterRulesByQuery,
} from "./utils/listingUtils";
import RuleSearch from "./components/RuleSearch";
import { RuleWithMeta } from "@/features/rules/types/rule";
import EmptyStateMessage from "@/features/rules/shared/components/EmptyStateMessage";
import ErrorMessage from "@/shared/components/ErrorMessage";
import DestinationRulesSection from "./components/DestinationRulesSection";
import { MultiSelect } from "@/shared/components/inputs/multi-select";
import { Button } from "@/shared/components/inputs/button";

const RulesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: rules = [], isLoading, error, refetch } = useRulesList();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    []
  );
  const { categories, isLoading: isLoadingCategories } =
    useCategoriesDestinations();
  const destinationOptions = ["A", "B", "C", "D", "E"]; // All possible destinations

  const handleCreateRule = () => {
    navigate("/rules/create");
  };

  const filteredRulesBySearch = useMemo(() => {
    return filterRulesByQuery(rules, searchQuery);
  }, [rules, searchQuery]);

  const filteredRules = useMemo(() => {
    let filtered = [...filteredRulesBySearch];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((rule) =>
        selectedCategories.includes(rule.category)
      );
    }

    if (selectedDestinations.length > 0) {
      filtered = filtered.filter((rule) =>
        selectedDestinations.includes(rule.destination)
      );
    }

    return filtered;
  }, [filteredRulesBySearch, selectedCategories, selectedDestinations]);

  const groupedRules = useMemo(() => {
    const grouped = getGroupedRulesByDestination(filteredRules);
    // Create a sorted version of the grouped rules
    return Object.fromEntries(
      Object.entries(grouped).sort(([destA], [destB]) =>
        destA.localeCompare(destB)
      )
    );
  }, [filteredRules]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  const handleDestinationChange = (destinations: string[]) => {
    setSelectedDestinations(destinations);
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedDestinations([]);
    setSearchQuery("");
  };

  // Determine if any filters are active or if there's a search query
  const hasActiveFiltersOrSearch =
    selectedCategories.length > 0 ||
    selectedDestinations.length > 0 ||
    searchQuery.trim() !== "";

  // Prepare options for MultiSelect
  const categoryOptions =
    categories?.map((category) => ({
      label: category,
      value: category,
    })) || [];

  const destinationSelectOptions = destinationOptions.map((destination) => ({
    label: destination,
    value: destination,
  }));

  if (error) {
    return (
      <div className="w-full px-6 py-6">
        <ErrorMessage message="Error loading rules. Please try again." />
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-6">
      {/* Custom header with integrated filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold mr-3">Rules</h1>
        </div>

        <Button
          onClick={handleCreateRule}
          className="bg-button-primary hover:bg-button-primary-hover text-button-primary-foreground font-medium shadow-sm transition-all duration-200 px-4 py-2 rounded-md"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Create Rule
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-80 bg-background-secondary">
          <MultiSelect
            options={categoryOptions}
            onValueChange={handleCategoryChange}
            placeholder="Select Categories"
            displayMode="summary"
            summaryItemLabel="category"
            summaryItemsLabel="categories"
          />
        </div>

        <div className="w-80 bg-background-secondary">
          <MultiSelect
            options={destinationSelectOptions}
            onValueChange={handleDestinationChange}
            placeholder="Select Destinations"
            displayMode="summary"
            summaryItemLabel="destination"
            summaryItemsLabel="destinations"
          />
        </div>

        {/* Search bar in its original position */}
        <div className="w-full">
          <RuleSearch
            onSearch={handleSearch}
            initialQuery={searchQuery}
            placeholder="Search rules by name or description..."
          />
        </div>

        {hasActiveFiltersOrSearch && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="h-9 px-2 text-sm"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {Object.entries(groupedRules).length === 0 && !isLoading ? (
        <EmptyStateMessage
          title="No Rules Found"
          message={
            filteredRules.length !== rules.length
              ? "No rules match your filters. Try adjusting your search or filters."
              : "Get started by creating your first rule."
          }
          actionButton={
            filteredRules.length === rules.length
              ? {
                  label: "Create Rule",
                  onClick: handleCreateRule,
                  icon: <PlusCircle className="mr-2 h-5 w-5" />,
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
                isLoading={isLoading || isLoadingCategories}
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
