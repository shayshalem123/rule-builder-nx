import React from "react";
import { RuleWithMeta } from "@/features/rules/types/rule";
import RuleCard from "./ruleCard/RuleCard";

interface RuleGridProps {
  rules: RuleWithMeta[];
  onEdit: (rule: RuleWithMeta) => void;
  onDelete: (rule: RuleWithMeta) => void;
  onView?: (rule: RuleWithMeta) => void;
  columns?: 1 | 2 | 3 | 4;
}

const RuleGrid: React.FC<RuleGridProps> = ({
  rules,
  onEdit,
  onDelete,
  onView,
  columns = 3,
}) => {
  const gridCols =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : columns === 3
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid ${gridCols} gap-6`}>
      {rules.map((rule) => (
        <RuleCard
          key={rule.id}
          rule={rule}
          onEdit={() => onEdit(rule)}
          onDelete={() => onDelete(rule)}
          onView={onView ? () => onView(rule) : undefined}
        />
      ))}
    </div>
  );
};

export default RuleGrid;
