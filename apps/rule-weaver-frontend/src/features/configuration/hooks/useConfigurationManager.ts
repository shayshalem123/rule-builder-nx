import { useState } from "react";
import { mockCategoriesInfo } from "../../rules/services/__mocks__/mockCategoriesInfo";
import {
  ConfigurationsMap,
  ConfigurationInfo,
  DestinationInfo,
  FormConfiguration,
} from "../types/configuration";

export const useConfigurationManager = () => {
  // Convert mockCategoriesInfo to use our new types
  const initialConfigurations: ConfigurationsMap = mockCategoriesInfo;

  const [configurations, setConfigurations] = useState<ConfigurationsMap>(
    initialConfigurations
  );

  // Add a new configuration
  const addConfiguration = (configuration: FormConfiguration) => {
    const { name, schemaId, destinations } = configuration;

    const destinationsMap: Record<string, DestinationInfo> = {};
    destinations.forEach((dest) => {
      destinationsMap[dest.name] = {
        destination: dest.name,
        category: name, // We're keeping the "category" field in DestinationInfo for backward compatibility
        typeOptions: dest.typeOptions,
        extraProperties: dest.extraProperties,
      };
    });

    setConfigurations((prev) => ({
      ...prev,
      [name]: {
        schemaId,
        destinations: destinationsMap,
      },
    }));
  };

  // Update an existing configuration
  const updateConfiguration = (
    oldName: string,
    configuration: FormConfiguration
  ) => {
    const { name, schemaId, destinations } = configuration;

    setConfigurations((prev) => {
      const newConfigurations = { ...prev };
      // Delete the old configuration
      delete newConfigurations[oldName];

      // Create the destinations map
      const destinationsMap: Record<string, DestinationInfo> = {};
      destinations.forEach((dest) => {
        destinationsMap[dest.name] = {
          destination: dest.name,
          category: name, // We're keeping the "category" field in DestinationInfo for backward compatibility
          typeOptions: dest.typeOptions,
          extraProperties: dest.extraProperties,
        };
      });

      // Add the updated configuration
      newConfigurations[name] = {
        schemaId,
        destinations: destinationsMap,
      };

      return newConfigurations;
    });
  };

  // Delete a configuration
  const deleteConfiguration = (configName: string) => {
    setConfigurations((prev) => {
      const newConfigurations = { ...prev };
      delete newConfigurations[configName];
      return newConfigurations;
    });
  };

  // Add a destination to a configuration
  const addDestination = (configName: string, destination: DestinationInfo) => {
    setConfigurations((prev) => {
      if (!prev[configName]) return prev;

      return {
        ...prev,
        [configName]: {
          ...prev[configName],
          destinations: {
            ...prev[configName].destinations,
            [destination.destination]: destination,
          },
        },
      };
    });
  };

  // Update a destination in a configuration
  const updateDestination = (
    configName: string,
    oldDestinationName: string,
    destination: DestinationInfo
  ) => {
    setConfigurations((prev) => {
      if (!prev[configName]) return prev;

      const newDestinations = { ...prev[configName].destinations };
      delete newDestinations[oldDestinationName];

      return {
        ...prev,
        [configName]: {
          ...prev[configName],
          destinations: {
            ...newDestinations,
            [destination.destination]: destination,
          },
        },
      };
    });
  };

  // Delete a destination from a configuration
  const deleteDestination = (configName: string, destinationName: string) => {
    setConfigurations((prev) => {
      if (!prev[configName]) return prev;

      const newDestinations = { ...prev[configName].destinations };
      delete newDestinations[destinationName];

      return {
        ...prev,
        [configName]: {
          ...prev[configName],
          destinations: newDestinations,
        },
      };
    });
  };

  // Helper to convert configuration to form format
  const getConfigurationFormData = (
    configName: string
  ): FormConfiguration | null => {
    const configuration = configurations[configName];

    if (!configuration) return null;

    const destinations = Object.values(configuration.destinations).map(
      (dest) => ({
        name: dest.destination,
        typeOptions: dest.typeOptions,
        extraProperties: dest.extraProperties,
      })
    );

    return {
      name: configName,
      schemaId: configuration.schemaId,
      destinations,
    };
  };

  return {
    configurations,
    addConfiguration,
    updateConfiguration,
    deleteConfiguration,
    addDestination,
    updateDestination,
    deleteDestination,
    getConfigurationFormData,
  };
};
