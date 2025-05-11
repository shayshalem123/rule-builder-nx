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

export type CategoryInfo = {
  schemaId: string;
  destinations: Record<string, DestinationInfo>;
};

export type CategoriesInfoMap = Record<string, CategoryInfo>;

export type FormCategoryDestination = {
  name: string;
  typeOptions: TypeOptions;
  extraProperties: JSONSchema7;
};

export type FormCategory = {
  name: string;
  schemaId: string;
  destinations: FormCategoryDestination[];
};
