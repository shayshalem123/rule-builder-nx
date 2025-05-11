import React from "react";
import { CategoriesInfoMap } from "../types/category";

interface CategoryListProps {
  categories: CategoriesInfoMap;
  onEditCategory: (categoryName: string) => void;
  onDeleteCategory: (categoryName: string) => void;
  onViewDetails: (categoryName: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onEditCategory,
  onDeleteCategory,
  onViewDetails,
}) => {
  const categoryNames = Object.keys(categories);

  if (categoryNames.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-border rounded-lg bg-background-secondary/20">
        <div className="w-16 h-16 rounded-full bg-background-secondary flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-secondary"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M12 8v8" />
            <path d="M8 12h8" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-text-primary mb-1">
          No configurations found
        </h3>
        <p className="text-text-secondary text-center max-w-md">
          Click "Add Configuration" to create your first data pipeline
          configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categoryNames.map((categoryName) => {
        const category = categories[categoryName];
        const destinationCount = Object.keys(category.destinations).length;

        return (
          <div
            key={categoryName}
            className="bg-card border border-card-border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
          >
            <div
              className="p-5 cursor-pointer"
              onClick={() => onViewDetails(categoryName)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-medium text-text-primary hover:text-button-primary-hover transition-colors">
                  {categoryName}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                  Schema: {category.schemaId}
                </span>
              </div>

              <div className="text-sm text-text-secondary mb-4">
                {destinationCount} destination
                {destinationCount !== 1 ? "s" : ""}
              </div>

              {Object.keys(category.destinations).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Object.keys(category.destinations)
                    .slice(0, 4)
                    .map((destName) => (
                      <span
                        key={destName}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-background-dark/10 text-text-primary"
                        title={`Field: ${category.destinations[destName].typeOptions.fieldName}`}
                      >
                        {destName}
                      </span>
                    ))}
                  {Object.keys(category.destinations).length > 4 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                      +{Object.keys(category.destinations).length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex border-t border-card-border divide-x divide-card-border">
              <button
                onClick={() => onEditCategory(categoryName)}
                className="flex-1 py-3 text-sm font-medium text-text-primary hover:bg-background-dark/5 transition-colors flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1.5"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => onDeleteCategory(categoryName)}
                className="flex-1 py-3 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1.5"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryList;
