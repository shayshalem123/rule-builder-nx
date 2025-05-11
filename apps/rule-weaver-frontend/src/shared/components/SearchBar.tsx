import React from "react";
import { Search } from "lucide-react";
import { Input } from "./inputs/input";
import { cn } from "../utils/cn";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  value,
  onChange,
  className,
}) => {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-4 py-2 w-full"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-primary hover:text-text-secondary"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default SearchBar;
