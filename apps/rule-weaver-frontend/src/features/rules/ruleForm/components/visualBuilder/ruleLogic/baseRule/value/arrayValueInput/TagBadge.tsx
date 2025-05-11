import React from "react";
import { X } from "lucide-react";
import { Badge } from "@/shared/components/inputs/badge";

interface TagBadgeProps {
  value: string | number;
  onRemove: () => void;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ value, onRemove }) => (
  <Badge variant="outline" className="flex items-center gap-1 py-0 h-6">
    {value}
    <button
      type="button"
      className="h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-accent focus:outline-none"
      onClick={(e) => {
        e.stopPropagation();
        onRemove();
      }}
    >
      <X className="h-3 w-3" />
    </button>
  </Badge>
);
