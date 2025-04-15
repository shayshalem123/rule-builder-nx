import React from "react";
import { RuleWithMeta } from "@/features/rules/types/rule";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/inputs/card";

import RuleLabels from "./RuleLabels";
import RuleUserInfo from "./RuleUserInfo";
import RuleCardActions from "./RuleCardActions";

interface RuleCardProps {
  rule: RuleWithMeta;
  onEdit: () => void;
  onDelete: () => void;
}

const RuleCard: React.FC<RuleCardProps> = ({ rule, onEdit, onDelete }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-1">
            {rule.name}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pb-2 flex-grow">
        {rule.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {rule.description}
          </p>
        )}

        <RuleLabels destination={rule.destination} category={rule.category} />

        <div className="mt-auto">
          <RuleUserInfo
            createdBy={rule.createdBy}
            updatedBy={rule.updatedBy}
            updatedAt={rule.updatedAt}
          />
        </div>
      </CardContent>

      <CardFooter className="mt-auto pt-2">
        <RuleCardActions onEdit={onEdit} onDelete={onDelete} />
      </CardFooter>
    </Card>
  );
};

export default RuleCard;
