import React from "react";
import { SchemaWithMeta } from "../types/schema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/inputs/card";
import { Badge } from "@/shared/components/inputs/badge";
import { Book, Tag } from "lucide-react";
import useSchemaFields from "../hooks/useSchemaFields";

interface SchemaCardProps {
  schema: SchemaWithMeta;
  onEdit: () => void;
  onDelete: () => void;
}

const SchemaCard: React.FC<SchemaCardProps> = ({
  schema,
  onEdit,
  onDelete,
}) => {
  const { leafFieldCount } = useSchemaFields(schema);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-1">
            {schema.name}
          </CardTitle>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            v{schema.version}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-2 flex-grow">
        {schema.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {schema.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-2">
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"
          >
            <Tag className="h-3 w-3" />
            {schema.category}
          </Badge>
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-purple-50 text-purple-700 border-purple-200"
          >
            <Book className="h-3 w-3" />
            {leafFieldCount} Fields
          </Badge>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          {schema.updatedAt && (
            <div>
              Last updated:{" "}
              {new Date(schema.updatedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          )}
          {schema.updatedBy && <div>By: {schema.updatedBy.name}</div>}
        </div>
      </CardContent>

      <CardFooter className="mt-auto pt-2 flex justify-end gap-2">
        <button
          onClick={onEdit}
          className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
        >
          Delete
        </button>
      </CardFooter>
    </Card>
  );
};

export default SchemaCard;
