import React from "react";
import { SchemaWithMeta } from "../types/schema";
import { Badge } from "@/shared/components/inputs/badge";
import useSchemaFields from "@/shared/hooks/useSchemaFields";
import EntityCard from "@/shared/components/EntityCard";
import EntityUserInfo from "@/shared/components/EntityUserInfo";
import EntityCardActions from "@/shared/components/EntityCardActions";
import EntityCardTags, { EntityTag } from "@/shared/components/EntityCardTags";
import { Book, Tag } from "lucide-react";

interface SchemaCardProps {
  schema: SchemaWithMeta;
  onEdit: () => void;
  onDelete: () => void;
  onView?: () => void;
}

const SchemaCard: React.FC<SchemaCardProps> = ({
  schema,
  onEdit,
  onDelete,
  onView,
}) => {
  const { fieldCount } = useSchemaFields(schema);

  const schemaTags: EntityTag[] = [
    {
      icon: <Tag className="h-3 w-3" />,
      label: schema.category,
      color: "green",
    },
    {
      icon: <Book className="h-3 w-3" />,
      label: `${fieldCount} Fields`,
      color: "purple",
    },
  ];

  return (
    <EntityCard
      title={schema.name}
      description={schema.description}
      badge={
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          v{schema.version}
        </Badge>
      }
      labels={<EntityCardTags tags={schemaTags} />}
      userInfo={
        <EntityUserInfo
          updatedBy={schema.updatedBy}
          updatedAt={schema.updatedAt}
        />
      }
      actions={
        <EntityCardActions
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      }
      onClick={onView}
    />
  );
};

export default SchemaCard;
