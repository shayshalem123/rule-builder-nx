import React, { useState } from "react";
import { CategoryInfo, DestinationInfo } from "../types/category";
import { JSONSchema7 } from "json-schema";

interface CategoryDetailProps {
  categoryName: string;
  category: CategoryInfo;
  onBack: () => void;
  onEdit: (categoryName: string) => void;
  onDelete: (categoryName: string) => void;
  onEditDestination: (categoryName: string, destinationName: string) => void;
  onDeleteDestination: (categoryName: string, destinationName: string) => void;
}

const CategoryDetail: React.FC<CategoryDetailProps> = ({
  categoryName,
  category,
  onBack,
  onEdit,
  onDelete,
  onEditDestination,
  onDeleteDestination,
}) => {
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    null
  );

  const getDestination = (name: string): DestinationInfo | null => {
    return category.destinations[name] || null;
  };

  const formatJSONSchema = (schema: JSONSchema7): string => {
    return JSON.stringify(schema, null, 2);
  };

  const selectDestination = (destName: string) => {
    setSelectedDestination(destName === selectedDestination ? null : destName);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between py-4 border-b border-border-primary mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-md hover:bg-background-dark/10 transition-colors"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-medium text-text-primary">
              {categoryName}
            </h1>
            <div className="flex items-center mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                Schema: {category.schemaId}
              </span>
              <span className="ml-2 text-sm text-text-secondary">
                {Object.keys(category.destinations).length} destination
                {Object.keys(category.destinations).length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => onEdit(categoryName)}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md border border-border-primary bg-background-secondary hover:bg-background-dark/10 transition-colors"
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
            onClick={() => onDelete(categoryName)}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
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

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-text-primary">
            Destinations
          </h2>
          <button className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-button-primary text-button-primary-foreground hover:bg-button-primary-hover transition-colors shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1.5"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Destination
          </button>
        </div>

        <div className="space-y-4">
          {Object.keys(category.destinations).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-border rounded-lg bg-background-secondary/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-text-secondary mb-3"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <path d="M12 12 3.3 7.76" />
                <path d="M12 12v9" />
                <path d="m12 12 8.7-4.24" />
              </svg>
              <p className="text-text-secondary text-center">
                No destinations configured for this pipeline.
              </p>
            </div>
          ) : (
            <div className="bg-card border border-card-border rounded-lg overflow-hidden">
              {Object.keys(category.destinations).map(
                (destName, index, array) => {
                  const dest = category.destinations[destName];
                  const isSelected = selectedDestination === destName;

                  return (
                    <div
                      key={destName}
                      className={`transition-all ${
                        index !== 0 ? "border-t border-card-border" : ""
                      }`}
                    >
                      <div
                        className={`p-4 flex justify-between items-center cursor-pointer hover:bg-background-secondary/30 transition-colors ${
                          isSelected ? "bg-background-secondary/50" : ""
                        }`}
                        onClick={() => selectDestination(destName)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-background-dark/10 flex items-center justify-center text-text-primary">
                            {destName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-medium text-text-primary">
                              {destName}
                            </h3>
                            <div className="text-sm text-text-secondary mt-0.5">
                              Field:{" "}
                              <span className="text-text-primary">
                                {dest.typeOptions.fieldName}
                              </span>
                              <span className="mx-1.5">•</span>
                              <span>
                                {dest.typeOptions.options.length} options
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditDestination(categoryName, destName);
                            }}
                            className="p-1.5 rounded-md hover:bg-background-dark/10 transition-colors text-text-secondary hover:text-text-primary"
                            aria-label="Edit destination"
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
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteDestination(categoryName, destName);
                            }}
                            className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-text-secondary hover:text-destructive"
                            aria-label="Delete destination"
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
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </button>
                          <div className="w-5 flex justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`text-text-secondary transition-transform ${
                                isSelected ? "rotate-180" : ""
                              }`}
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="p-5 bg-background-secondary/20 border-t border-card-border space-y-6">
                          <div>
                            <h4 className="text-sm font-medium mb-2 text-text-primary">
                              Field Options
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {dest.typeOptions.options.map((option) => (
                                <span
                                  key={option}
                                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-background-secondary text-text-primary"
                                >
                                  {option}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2 text-text-primary">
                              Extra Properties
                            </h4>
                            <pre className="bg-background-dark text-background-dark-foreground p-3 rounded-md text-xs overflow-x-auto">
                              {formatJSONSchema(dest.extraProperties)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
