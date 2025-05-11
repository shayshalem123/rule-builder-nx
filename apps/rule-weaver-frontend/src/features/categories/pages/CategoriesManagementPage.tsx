import React, { useState } from "react";
import { useCategoriesManager } from "../hooks/useCategoriesManager";
import CategoryList from "../components/CategoryList";
import CategoryForm from "../components/CategoryForm";
import CategoryDetail from "../components/CategoryDetail";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { DestinationInfo, FormCategory } from "../types/category";

type View = "list" | "detail" | "add" | "edit";

const CategoriesManagementPage: React.FC = () => {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    addDestination,
    updateDestination,
    deleteDestination,
    getCategoryFormData,
  } = useCategoriesManager();

  const [currentView, setCurrentView] = useState<View>("list");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const handleAddCategory = (category: FormCategory) => {
    addCategory(category);
    setCurrentView("list");
  };

  const handleUpdateCategory = (category: FormCategory) => {
    if (selectedCategory) {
      updateCategory(selectedCategory, category);
      setCurrentView("list");
      setSelectedCategory(null);
    }
  };

  const handleConfirmDeleteCategory = (categoryName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Configuration",
      message: `Are you sure you want to delete "${categoryName}"? This action cannot be undone.`,
      onConfirm: () => {
        deleteCategory(categoryName);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        setCurrentView("list");
        setSelectedCategory(null);
      },
    });
  };

  const handleConfirmDeleteDestination = (
    categoryName: string,
    destinationName: string
  ) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Destination",
      message: `Are you sure you want to delete the destination "${destinationName}"? This action cannot be undone.`,
      onConfirm: () => {
        deleteDestination(categoryName, destinationName);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "list":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center py-4 border-b border-border-primary mb-6">
              <div>
                <h1 className="text-2xl font-bold text-text-primary">
                  Configuration
                </h1>
                <p className="text-text-secondary mt-1">
                  Manage destinations and schema mappings
                </p>
              </div>
              <button
                onClick={() => setCurrentView("add")}
                className="px-4 py-2 bg-button-primary text-button-primary-foreground rounded-md hover:bg-button-primary-hover transition-colors flex items-center space-x-2 shadow-sm"
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
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Add Configuration</span>
              </button>
            </div>
            <CategoryList
              categories={categories}
              onEditCategory={(categoryName) => {
                setSelectedCategory(categoryName);
                setCurrentView("edit");
              }}
              onDeleteCategory={handleConfirmDeleteCategory}
              onViewDetails={(categoryName) => {
                setSelectedCategory(categoryName);
                setCurrentView("detail");
              }}
            />
          </div>
        );

      case "detail":
        if (!selectedCategory || !categories[selectedCategory]) {
          return <div>Configuration not found</div>;
        }
        return (
          <CategoryDetail
            categoryName={selectedCategory}
            category={categories[selectedCategory]}
            onBack={() => {
              setCurrentView("list");
              setSelectedCategory(null);
            }}
            onEdit={(categoryName) => {
              setSelectedCategory(categoryName);
              setCurrentView("edit");
            }}
            onDelete={handleConfirmDeleteCategory}
            onEditDestination={(categoryName, destinationName) => {
              // When implementing destination editing, this would navigate to a destination edit view
              const dest =
                categories[categoryName].destinations[destinationName];
              alert(
                `Edit destination functionality would be implemented here for ${destinationName}`
              );
            }}
            onDeleteDestination={handleConfirmDeleteDestination}
          />
        );

      case "add":
        return (
          <div>
            <div className="flex items-center py-4 border-b border-border-primary mb-6">
              <button
                onClick={() => setCurrentView("list")}
                className="text-sm rounded-md hover:bg-background-dark/10 p-2 mr-3"
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
              <h1 className="text-xl font-medium text-text-primary">
                Add New Configuration
              </h1>
            </div>
            <CategoryForm
              onSave={handleAddCategory}
              onCancel={() => setCurrentView("list")}
            />
          </div>
        );

      case "edit":
        if (!selectedCategory) {
          return <div>Configuration not found</div>;
        }

        const categoryData = getCategoryFormData(selectedCategory);

        if (!categoryData) {
          return <div>Configuration not found</div>;
        }

        return (
          <div>
            <div className="flex items-center py-4 border-b border-border-primary mb-6">
              <button
                onClick={() =>
                  setCurrentView(selectedCategory ? "detail" : "list")
                }
                className="text-sm rounded-md hover:bg-background-dark/10 p-2 mr-3"
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
              <h1 className="text-xl font-medium text-text-primary">
                Edit Configuration
              </h1>
            </div>
            <CategoryForm
              category={categoryData}
              onSave={handleUpdateCategory}
              onCancel={() => {
                setCurrentView(selectedCategory ? "detail" : "list");
              }}
            />
          </div>
        );

      default:
        return <div>Invalid view</div>;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      {renderCurrentView()}

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirmDialog}
        confirmButtonClass="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
      />
    </div>
  );
};

export default CategoriesManagementPage;
