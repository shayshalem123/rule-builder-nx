import React, { ReactNode } from "react";
import { Button } from "./inputs/button";

interface PageHeaderProps {
  title: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, actionButton }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      {actionButton && (
        <Button onClick={actionButton.onClick}>
          {actionButton.icon}
          {actionButton.label}
        </Button>
      )}
    </div>
  );
};

export default PageHeader;
