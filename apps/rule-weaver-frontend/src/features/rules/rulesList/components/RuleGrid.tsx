import React from "react";
import { RuleWithMeta } from "@/features/rules/types/rule";
import RuleCard from "./ruleCard/RuleCard";

interface RuleGridProps {
  rules: RuleWithMeta[];
  onEdit: (rule: RuleWithMeta) => void;
  onDelete: (rule: RuleWithMeta) => void;
  onView?: (rule: RuleWithMeta) => void;
}

const RuleGrid: React.FC<RuleGridProps> = ({
  rules,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <div className="flex flex-wrap gap-6 w-full">
      {rules.map((rule) => (
        <div
          key={rule.id}
          className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
        >
          <RuleCard
            rule={rule}
            onEdit={() => onEdit(rule)}
            onDelete={() => onDelete(rule)}
            onView={onView ? () => onView(rule) : undefined}
          />
        </div>
      ))}
    </div>
  );
};

export default RuleGrid;
