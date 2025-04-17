import React, { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/shared/components/inputs/input";
import { Search } from "lucide-react";

interface RuleSearchProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  placeholder?: string;
  className?: string;
}

const RuleSearch: React.FC<RuleSearchProps> = ({
  onSearch,
  initialQuery = "",
  placeholder = "Search rules...",
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  // Debounce search to avoid excessive searches while typing
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, onSearch]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleSearchChange}
        className="pl-9 w-full"
      />
    </div>
  );
};

export default RuleSearch;
