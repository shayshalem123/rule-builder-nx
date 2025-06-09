import React from 'react';
import { RuleWithMeta } from '@/features/rules/types/rule';
import EntityCard from '@/shared/components/EntityCard';
import EntityUserInfo from '@/shared/components/EntityUserInfo';
import EntityCardActions from '@/shared/components/EntityCardActions';
import EntityCardTags, { EntityTag } from '@/shared/components/EntityCardTags';
import { MapPin, Tag } from 'lucide-react';

interface RuleCardProps {
  rule: RuleWithMeta;
  onEdit: () => void;
  onDelete: () => void;
  onView?: () => void;
}

const RuleCard: React.FC<RuleCardProps> = ({
  rule,
  onEdit,
  onDelete,
  onView,
}) => {
  const ruleTags: EntityTag[] = [
    {
      icon: <MapPin className="h-3 w-3" />,
      label: `Destination ${rule.destination}`,
      color: 'amber',
    },
    {
      icon: <Tag className="h-3 w-3" />,
      label: rule.category,
      color: 'green',
    },
  ];

  return (
    <EntityCard
      title={rule.name}
      description={rule.description}
      labels={<EntityCardTags tags={ruleTags} />}
      userInfo={
        <EntityUserInfo
          createdBy={rule.createdBy}
          updatedBy={rule.updatedBy}
          updatedAt={rule.updatedAt}
        />
      }
      actions={
        <EntityCardActions
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          permittedActions={rule.permittedActions}
        />
      }
      onClick={onView}
    />
  );
};

export default RuleCard;
