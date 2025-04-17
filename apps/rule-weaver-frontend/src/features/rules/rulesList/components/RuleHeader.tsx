import React from "react";
import { Button } from "@/shared/components/inputs/button";
import { Plus } from "lucide-react";

interface RuleHeaderProps {
  title: string;
  onCreateRule: () => void;
}

const RuleHeader: React.FC<RuleHeaderProps> = ({ title, onCreateRule }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <Button onClick={onCreateRule} className="flex items-center">
        <Plus className="h-4 w-4 mr-1" />
        Create Rule
      </Button>
    </div>
  );
};

export default RuleHeader;
