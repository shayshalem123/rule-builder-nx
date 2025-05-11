import { JsonSchemaProperty } from "../../../../../hooks/useExtraPropertiesSchemas";

export type SchemaPropertyValue = string | number | boolean;

export interface PropertyFieldProps {
  propName: string;
  schema: JsonSchemaProperty;
  value: SchemaPropertyValue;
  onChange: (name: string, value: SchemaPropertyValue) => void;
  required: boolean;
}
