import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FormikProps } from "formik";
import { RuleFormValues } from "../../../hooks/useRuleForm";
import { JsonSchemaProperty } from "../../../../hooks/useExtraPropertiesSchemas";
import { useCategoriesDestinations } from "@/features/rules/hooks/useCategoriesDestinations";
import { BooleanPropertyField } from "./extraPropertiesFields/BooleanPropertyField";
import { NumberPropertyField } from "./extraPropertiesFields/NumberPropertyField";
import { EnumPropertyField } from "./extraPropertiesFields/EnumPropertyField";
import { StringPropertyField } from "./extraPropertiesFields/StringPropertyField";
import { SchemaPropertyValue } from "./extraPropertiesFields/types";
import { Card, CardContent } from "@/shared/components/inputs/card";

interface ExtraPropertiesFieldsProps {
  formik: FormikProps<RuleFormValues>;
}

export const ExtraPropertiesFields: React.FC<ExtraPropertiesFieldsProps> = ({
  formik,
}) => {
  const { getExtraPropertiesSchema } = useCategoriesDestinations();

  const currentExtraPropertiesSchema = getExtraPropertiesSchema(
    formik.values.category,
    formik.values.destination
  );

  const schemaProperties = useMemo(
    () => currentExtraPropertiesSchema?.properties || {},
    [currentExtraPropertiesSchema]
  );

  const requiredProperties = useMemo(
    () => currentExtraPropertiesSchema?.required || [],
    [currentExtraPropertiesSchema]
  );

  const isRequired = useCallback(
    (propName: string) => requiredProperties.includes(propName),
    [requiredProperties]
  );

  const handleExtraPropChange = useCallback(
    (name: string, value: SchemaPropertyValue) => {
      const updatedProps = { ...formik.values.extraProperties, [name]: value };
      formik.setFieldValue("extraProperties", updatedProps);
    },
    [formik]
  );

  if (
    !currentExtraPropertiesSchema ||
    Object.keys(schemaProperties).length === 0
  )
    return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-text-secondary mb-2">
        Extra Properties
      </h3>
      <Card className="bg-background-secondary border-border-secondary shadow-sm">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(schemaProperties).map(([propName, propSchema]) => {
              const schema = propSchema as JsonSchemaProperty;
              const value = formik.values.extraProperties?.[propName] ?? "";
              const required = isRequired(propName);

              if (schema.type === "boolean") {
                return (
                  <BooleanPropertyField
                    key={propName}
                    propName={propName}
                    schema={schema}
                    value={value as boolean}
                    onChange={handleExtraPropChange}
                    required={required}
                  />
                );
              } else if (schema.type === "number") {
                return (
                  <NumberPropertyField
                    key={propName}
                    propName={propName}
                    schema={schema}
                    value={value as number}
                    onChange={handleExtraPropChange}
                    required={required}
                  />
                );
              } else if (schema.type === "string" && schema.enum) {
                return (
                  <EnumPropertyField
                    key={propName}
                    propName={propName}
                    schema={schema}
                    value={value as string}
                    onChange={handleExtraPropChange}
                    required={required}
                  />
                );
              } else {
                return (
                  <StringPropertyField
                    key={propName}
                    propName={propName}
                    schema={schema}
                    value={value as string}
                    onChange={handleExtraPropChange}
                    required={required}
                  />
                );
              }
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
