import React, { useState } from "react";
import { FormConfiguration, FormDestination } from "../types/configuration";
import DestinationForm from "./DestinationForm";

interface ConfigurationFormProps {
  configuration?: FormConfiguration;
  onSave: (configuration: FormConfiguration) => void;
  onCancel: () => void;
}

const ConfigurationForm: React.FC<ConfigurationFormProps> = ({
  configuration,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(configuration?.name || "");
  const [schemaId, setSchemaId] = useState(configuration?.schemaId || "");
  const [destinations, setDestinations] = useState<FormDestination[]>(
    configuration?.destinations || []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAddingDestination, setIsAddingDestination] = useState(false);
  const [editingDestinationIndex, setEditingDestinationIndex] = useState<
    number | null
  >(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Configuration name is required";
    }

    if (!schemaId.trim()) {
      newErrors.schemaId = "Schema ID is required";
    }

    if (destinations.length === 0) {
      newErrors.destinations = "At least one destination is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSave({
      name,
      schemaId,
      destinations,
    });
  };

  const handleSaveDestination = (destination: FormDestination) => {
    if (editingDestinationIndex !== null) {
      // Update existing destination
      const updatedDestinations = [...destinations];
      updatedDestinations[editingDestinationIndex] = destination;
      setDestinations(updatedDestinations);
      setEditingDestinationIndex(null);
    } else {
      // Add new destination
      setDestinations([...destinations, destination]);
    }
    setIsAddingDestination(false);
  };

  const handleEditDestination = (index: number) => {
    setEditingDestinationIndex(index);
    setIsAddingDestination(true);
  };

  const handleDeleteDestination = (index: number) => {
    setDestinations(destinations.filter((_, i) => i !== index));
  };

  const cancelDestinationForm = () => {
    setIsAddingDestination(false);
    setEditingDestinationIndex(null);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {isAddingDestination ? (
        <div className="bg-card border border-card-border rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4 text-text-primary">
            {editingDestinationIndex !== null
              ? "Edit Destination"
              : "Add Destination"}
          </h3>
          <DestinationForm
            destination={
              editingDestinationIndex !== null
                ? destinations[editingDestinationIndex]
                : undefined
            }
            onSave={handleSaveDestination}
            onCancel={cancelDestinationForm}
          />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-card border border-card-border rounded-lg shadow-sm p-6"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Configuration Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-button-primary/30 ${
                  errors.name ? "border-destructive" : "border-border"
                }`}
                placeholder="e.g. partners-images"
              />
              {errors.name && (
                <div className="text-destructive text-sm mt-1">
                  {errors.name}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Schema ID
              </label>
              <input
                type="text"
                value={schemaId}
                onChange={(e) => setSchemaId(e.target.value)}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-button-primary/30 ${
                  errors.schemaId ? "border-destructive" : "border-border"
                }`}
                placeholder="e.g. schema-123"
              />
              {errors.schemaId && (
                <div className="text-destructive text-sm mt-1">
                  {errors.schemaId}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-text-primary">
                Destinations
              </label>
              <button
                type="button"
                onClick={() => setIsAddingDestination(true)}
                className="flex items-center text-sm px-3 py-1.5 rounded-md bg-button-primary text-button-primary-foreground hover:bg-button-primary-hover transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
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

            {errors.destinations && (
              <div className="text-destructive text-sm mb-2">
                {errors.destinations}
              </div>
            )}

            {destinations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-border rounded-lg bg-background-secondary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
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
                <p className="text-text-secondary text-center mb-1">
                  No destinations added yet
                </p>
                <p className="text-sm text-text-muted text-center">
                  Click "Add Destination" to configure your data flow
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {destinations.map((dest, index) => (
                  <div
                    key={index}
                    className="border border-border rounded-md flex justify-between items-center overflow-hidden"
                  >
                    <div className="p-3 flex-1">
                      <div className="font-medium text-text-primary">
                        {dest.name}
                      </div>
                      <div className="text-sm text-text-secondary">
                        Field: {dest.typeOptions.fieldName} •
                        <span className="ml-1">
                          {dest.typeOptions.options.length} options
                        </span>
                      </div>
                    </div>
                    <div className="flex border-l border-border divide-x divide-border h-full">
                      <button
                        type="button"
                        onClick={() => handleEditDestination(index)}
                        className="py-3 px-4 hover:bg-background-dark/5 transition-colors text-text-primary"
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
                        type="button"
                        onClick={() => handleDeleteDestination(index)}
                        className="py-3 px-4 hover:bg-destructive/5 transition-colors text-destructive"
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-border rounded-md hover:bg-background-dark/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-button-primary text-button-primary-foreground rounded-md hover:bg-button-primary-hover transition-colors"
            >
              {configuration ? "Update Configuration" : "Save Configuration"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ConfigurationForm;
