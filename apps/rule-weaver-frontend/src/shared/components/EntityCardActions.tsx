import React from "react";
import { Button } from "@/shared/components/inputs/button";
import { Edit, Trash2 } from "lucide-react";

export interface EntityCardActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const EntityCardActions: React.FC<EntityCardActionsProps> = ({
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex justify-end gap-2 w-full">
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
    </div>
  );
};

export default EntityCardActions;
