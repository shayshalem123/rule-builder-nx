import React from "react";
import { Badge } from "@/shared/components/inputs/badge";
import { MapPin, Tag } from "lucide-react";

interface RuleLabelsProps {
  destination: string;
  category: string;
}

const RuleLabels: React.FC<RuleLabelsProps> = ({ destination, category }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <Badge
        variant="outline"
        className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200"
      >
        <MapPin className="h-3 w-3" />
        Destination {destination}
      </Badge>

      <Badge
        variant="outline"
        className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"
      >
        <Tag className="h-3 w-3" />
        {category}
      </Badge>
    </div>
  );
};

export default RuleLabels;
