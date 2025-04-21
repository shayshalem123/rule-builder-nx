import React, { useState, useMemo, useEffect } from "react";
import SearchBar from "@/shared/components/SearchBar";
import { SchemaWithMeta } from "../types/schema";

interface SchemaSearchProps {
  schemas: SchemaWithMeta[];
  onFilteredSchemasChange: (filteredSchemas: SchemaWithMeta[]) => void;
  className?: string;
}

const SchemaSearch: React.FC<SchemaSearchProps> = ({
  schemas,
  onFilteredSchemasChange,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter schemas based on search query
  const filteredSchemas = useMemo(() => {
    if (!searchQuery.trim()) return schemas;

    const lowerQuery = searchQuery.toLowerCase();
    return schemas.filter((schema) => {
      return (
        schema.name.toLowerCase().includes(lowerQuery) ||
        (schema.description &&
          schema.description.toLowerCase().includes(lowerQuery)) ||
        schema.category.toLowerCase().includes(lowerQuery)
      );
    });
  }, [schemas, searchQuery]);

  // Update parent component with filtered results
  useEffect(() => {
    onFilteredSchemasChange(filteredSchemas);
  }, [filteredSchemas, onFilteredSchemasChange]);

  return (
    <SearchBar
      placeholder="Search schemas by name, description, or category..."
      value={searchQuery}
      onChange={setSearchQuery}
      className={className}
    />
  );
};

export default SchemaSearch;
