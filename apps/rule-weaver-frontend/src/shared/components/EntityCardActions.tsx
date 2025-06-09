import React from 'react';
import { Button } from '@/shared/components/inputs/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import { PermittedAction } from '@/features/rules/types/rule';

export interface EntityCardActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onView?: () => void;
  permittedActions?: PermittedAction[];
}

const EntityCardActions: React.FC<EntityCardActionsProps> = ({
  onEdit,
  onDelete,
  onView,
  permittedActions = ['read', 'write', 'delete'],
}) => {
  const canRead = permittedActions.includes('read');
  const canWrite = permittedActions.includes('write');
  const canDelete = permittedActions.includes('delete');

  return (
    <div className="flex justify-end gap-2 w-full">
      {onView && canRead && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          className="h-8"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      )}
      {canWrite && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="h-8"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      )}
      {canDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="h-8 text-button-destructive hover:text-button-destructive-hover hover:bg-button-destructive-hover-bg"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      )}
    </div>
  );
};

export default EntityCardActions;
