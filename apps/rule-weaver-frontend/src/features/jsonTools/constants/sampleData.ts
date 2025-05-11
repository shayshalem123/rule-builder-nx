import { JsonData, JsonSchema } from "../types";

// JSON Schema Example
export const SAMPLE_SCHEMA: JsonSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Product",
  description: "A product from the catalog",
  type: "object",
  required: ["productId", "productName", "price"],
  properties: {
    productId: {
      type: "integer",
      description: "The unique identifier for a product",
      minimum: 1,
    },
    productName: {
      type: "string",
      description: "Name of the product",
      minLength: 2,
      maxLength: 100,
    },
    price: {
      type: "number",
      description: "The price of the product",
      exclusiveMinimum: 0,
    },
    tags: {
      type: "array",
      items: {
        type: "string",
      },
      minItems: 1,
      uniqueItems: true,
    },
    dimensions: {
      type: "object",
      properties: {
        length: {
          type: "number",
          minimum: 0,
        },
        width: {
          type: "number",
          minimum: 0,
        },
        height: {
          type: "number",
          minimum: 0,
        },
        unit: {
          type: "string",
          enum: ["cm", "in"],
        },
      },
      required: ["length", "width", "height", "unit"],
    },
    inStock: {
      type: "boolean",
      description: "Whether the product is in stock",
    },
  },
  additionalProperties: false,
};

// Valid data sample - matching the Product schema
export const VALID_SAMPLE: JsonData = {
  productId: 1,
  productName: "Wireless Keyboard",
  price: 29.99,
  tags: ["computer", "wireless", "accessories"],
  dimensions: {
    length: 40.2,
    width: 12.8,
    height: 2.5,
    unit: "cm",
  },
  inStock: true,
};

// Invalid data sample - contains errors that violate the schema
export const INVALID_SAMPLE = {
  productId: "ABC123", // Should be an integer
  productName: "X", // Too short
  price: 0, // Should be > 0
  tags: ["electronics", "electronics"], // Duplicated tag
  dimensions: {
    length: -5, // Negative value
    width: 15.5,
    height: 3.2,
    unit: "meters", // Not in enum
  },
  color: "black", // Additional property not allowed
};
