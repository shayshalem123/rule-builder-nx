import React, { ReactNode } from "react";
import { Badge } from "@/shared/components/inputs/badge";
import { cn } from "@/shared/utils/cn";

export type TagColor =
  | "amber"
  | "green"
  | "purple"
  | "blue"
  | "red"
  | "gray"
  | "yellow"
  | "indigo"
  | "pink"
  | "teal";

export interface EntityTag {
  icon: ReactNode;
  label: string;
  color: TagColor;
  // Optional custom classes
  customClasses?: string;
}

interface EntityCardTagsProps {
  tags: EntityTag[];
}

const EntityCardTags: React.FC<EntityCardTagsProps> = ({ tags }) => {
  const getColorClasses = (color: TagColor, customClasses?: string) => {
    if (customClasses) {
      return customClasses;
    }

    switch (color) {
      case "amber":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "green":
        return "bg-green-50 text-green-700 border-green-200";
      case "purple":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "blue":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "red":
        return "bg-red-50 text-red-700 border-red-200";
      case "gray":
        return "bg-background-primary text-text-secondary border-border-primary";
      case "yellow":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "indigo":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "pink":
        return "bg-pink-50 text-pink-700 border-pink-200";
      case "teal":
        return "bg-teal-50 text-teal-700 border-teal-200";
      default:
        return "bg-background-primary text-text-secondary border-border-primary";
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {tags.map((tag, index) => (
        <Badge
          key={index}
          variant="outline"
          className={cn(
            "flex items-center gap-1",
            getColorClasses(tag.color, tag.customClasses)
          )}
        >
          {tag.icon}
          {tag.label}
        </Badge>
      ))}
    </div>
  );
};

export default EntityCardTags;
