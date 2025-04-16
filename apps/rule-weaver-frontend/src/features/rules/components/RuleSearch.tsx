import React, { useState, useMemo, useEffect } from "react";
import SearchBar from "@/shared/components/SearchBar";
import { RuleWithMeta } from "../types/rule";

interface RuleSearchProps {
  rules: RuleWithMeta[];
  onFilteredRulesChange: (filteredRules: RuleWithMeta[]) => void;
  className?: string;
}

const RuleSearch: React.FC<RuleSearchProps> = ({
  rules,
  onFilteredRulesChange,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter rules based on search query
  const filteredRules = useMemo(() => {
    if (!searchQuery.trim()) return rules;

    const lowerQuery = searchQuery.toLowerCase();
    return rules.filter((rule) => {
      return (
        rule.name.toLowerCase().includes(lowerQuery) ||
        (rule.description &&
          rule.description.toLowerCase().includes(lowerQuery)) ||
        rule.destination.toLowerCase().includes(lowerQuery)
      );
    });
  }, [rules, searchQuery]);

  // Update parent component with filtered results
  useEffect(() => {
    onFilteredRulesChange(filteredRules);
  }, [filteredRules, onFilteredRulesChange]);

  return (
    <SearchBar
      placeholder="Search rules by name, description, or destination..."
      value={searchQuery}
      onChange={setSearchQuery}
      className={className}
    />
  );
};

export default RuleSearch;
