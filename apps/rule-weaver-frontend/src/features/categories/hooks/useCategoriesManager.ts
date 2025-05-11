import { useState } from "react";
import { mockCategoriesInfo } from "../../rules/services/__mocks__/mockCategoriesInfo";
import {
  CategoriesInfoMap,
  CategoryInfo,
  DestinationInfo,
  FormCategory,
} from "../types/category";

export const useCategoriesManager = () => {
  const [categories, setCategories] =
    useState<CategoriesInfoMap>(mockCategoriesInfo);

  // Add a new category
  const addCategory = (category: FormCategory) => {
    const { name, schemaId, destinations } = category;

    const destinationsMap: Record<string, DestinationInfo> = {};
    destinations.forEach((dest) => {
      destinationsMap[dest.name] = {
        destination: dest.name,
        category: name,
        typeOptions: dest.typeOptions,
        extraProperties: dest.extraProperties,
      };
    });

    setCategories((prev) => ({
      ...prev,
      [name]: {
        schemaId,
        destinations: destinationsMap,
      },
    }));
  };

  // Update an existing category
  const updateCategory = (oldName: string, category: FormCategory) => {
    const { name, schemaId, destinations } = category;

    setCategories((prev) => {
      const newCategories = { ...prev };
      // Delete the old category
      delete newCategories[oldName];

      // Create the destinations map
      const destinationsMap: Record<string, DestinationInfo> = {};
      destinations.forEach((dest) => {
        destinationsMap[dest.name] = {
          destination: dest.name,
          category: name,
          typeOptions: dest.typeOptions,
          extraProperties: dest.extraProperties,
        };
      });

      // Add the updated category
      newCategories[name] = {
        schemaId,
        destinations: destinationsMap,
      };

      return newCategories;
    });
  };

  // Delete a category
  const deleteCategory = (categoryName: string) => {
    setCategories((prev) => {
      const newCategories = { ...prev };
      delete newCategories[categoryName];
      return newCategories;
    });
  };

  // Add a destination to a category
  const addDestination = (
    categoryName: string,
    destination: DestinationInfo
  ) => {
    setCategories((prev) => {
      if (!prev[categoryName]) return prev;

      return {
        ...prev,
        [categoryName]: {
          ...prev[categoryName],
          destinations: {
            ...prev[categoryName].destinations,
            [destination.destination]: destination,
          },
        },
      };
    });
  };

  // Update a destination in a category
  const updateDestination = (
    categoryName: string,
    oldDestinationName: string,
    destination: DestinationInfo
  ) => {
    setCategories((prev) => {
      if (!prev[categoryName]) return prev;

      const newDestinations = { ...prev[categoryName].destinations };
      delete newDestinations[oldDestinationName];

      return {
        ...prev,
        [categoryName]: {
          ...prev[categoryName],
          destinations: {
            ...newDestinations,
            [destination.destination]: destination,
          },
        },
      };
    });
  };

  // Delete a destination from a category
  const deleteDestination = (categoryName: string, destinationName: string) => {
    setCategories((prev) => {
      if (!prev[categoryName]) return prev;

      const newDestinations = { ...prev[categoryName].destinations };
      delete newDestinations[destinationName];

      return {
        ...prev,
        [categoryName]: {
          ...prev[categoryName],
          destinations: newDestinations,
        },
      };
    });
  };

  // Helper to convert category to form format
  const getCategoryFormData = (categoryName: string): FormCategory | null => {
    const category = categories[categoryName];

    if (!category) return null;

    const destinations = Object.values(category.destinations).map((dest) => ({
      name: dest.destination,
      typeOptions: dest.typeOptions,
      extraProperties: dest.extraProperties,
    }));

    return {
      name: categoryName,
      schemaId: category.schemaId,
      destinations,
    };
  };

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    addDestination,
    updateDestination,
    deleteDestination,
    getCategoryFormData,
  };
};
