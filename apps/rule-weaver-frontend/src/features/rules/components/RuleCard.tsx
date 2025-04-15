import React from "react";
import { RuleWithMeta } from "@/features/rules/types/rule";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/inputs/card";
import { Button } from "@/shared/components/inputs/button";
import { Edit, Trash2, MapPin, Tag } from "lucide-react";
import {
  isBaseRule,
  isAndRule,
  isOrRule,
} from "@/features/rules/utils/ruleUtils";
import { Badge } from "@/shared/components/inputs/badge";
import { formatDistanceToNow } from "date-fns";

interface RuleCardProps {
  rule: RuleWithMeta;
  onEdit: () => void;
  onDelete: () => void;
}

const RuleCard: React.FC<RuleCardProps> = ({ rule, onEdit, onDelete }) => {
  const getRuleTypeBadge = () => {
    if (isBaseRule(rule.rule)) {
      return (
        <Badge variant="outline" className="bg-gray-100">
          Simple Rule
        </Badge>
      );
    } else if (isAndRule(rule.rule)) {
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          AND Rule
        </Badge>
      );
    } else if (isOrRule(rule.rule)) {
      return (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200"
        >
          OR Rule
        </Badge>
      );
    }
    return null;
  };

  const getUpdatedTime = () => {
    if (!rule.updatedAt) return null;
    try {
      return formatDistanceToNow(new Date(rule.updatedAt), { addSuffix: true });
    } catch (e) {
      return null;
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-1">
            {rule.name}
          </CardTitle>
          {getRuleTypeBadge()}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {rule.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {rule.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-2">
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200"
          >
            <MapPin className="h-3 w-3" />
            Destination {rule.destination}
          </Badge>

          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"
          >
            <Tag className="h-3 w-3" />
            {rule.category}
          </Badge>
        </div>

        <div className="text-xs text-gray-500">
          {getUpdatedTime() && `Updated ${getUpdatedTime()}`}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" size="sm" onClick={onEdit} className="h-8">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RuleCard;
