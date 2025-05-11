import { JSONSchema7 } from "json-schema";

export type TypeOptions = {
  fieldName: string;
  options: string[];
};

export type DestinationInfo = {
  destination: string;
  category: string;
  typeOptions: TypeOptions;
  extraProperties: JSONSchema7;
};

export type ConfigurationInfo = {
  schemaId: string;
  destinations: Record<string, DestinationInfo>;
};

export type ConfigurationsMap = Record<string, ConfigurationInfo>;

export type FormDestination = {
  name: string;
  typeOptions: TypeOptions;
  extraProperties: JSONSchema7;
};

export type FormConfiguration = {
  name: string;
  schemaId: string;
  destinations: FormDestination[];
};
