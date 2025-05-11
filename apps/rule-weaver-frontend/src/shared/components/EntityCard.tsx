import React, { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/inputs/card";

export interface EntityCardProps {
  title: string;
  description?: string;
  badge?: ReactNode;
  labels?: ReactNode;
  userInfo?: ReactNode;
  actions?: ReactNode;
  onClick?: () => void;
}

const EntityCard: React.FC<EntityCardProps> = ({
  title,
  description,
  badge,
  labels,
  userInfo,
  actions,
  onClick,
}) => {
  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-md flex flex-col h-full ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-text-secondary line-clamp-1">
            {title}
          </CardTitle>
          {badge}
        </div>
      </CardHeader>

      <CardContent className="pb-2 flex-grow">
        {description && (
          <p className="text-sm text-text-primary mb-2 line-clamp-2">
            {description}
          </p>
        )}

        {labels}

        <div className="mt-auto">{userInfo}</div>
      </CardContent>

      <CardFooter className="mt-auto pt-2">{actions}</CardFooter>
    </Card>
  );
};

export default EntityCard;
