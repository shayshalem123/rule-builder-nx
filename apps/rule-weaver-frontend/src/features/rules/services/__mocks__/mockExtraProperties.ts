// Extra properties schemas for category-destination combinations
export const mockExtraPropertiesSchemas: Record<
  string,
  Record<string, object>
> = {
  // Categories as top-level properties, destinations nested inside
  "partners-images": {
    A: {
      type: "object",
      properties: {
        resolution: { type: "string", enum: ["low", "medium", "high"] },
        watermark: { type: "boolean" },
        colorProfile: { type: "string" },
      },
      required: ["resolution", "watermark"],
    },
    B: {
      type: "object",
      properties: {
        compressionLevel: { type: "number", minimum: 1, maximum: 10 },
        storageType: { type: "string", enum: ["standard", "premium"] },
      },
    },
  },
  "partners-algo": {
    A: {
      type: "object",
      properties: {
        priority: { type: "string", enum: ["low", "medium", "high"] },
        maxExecutionTime: { type: "number" },
      },
      required: ["priority", "maxExecutionTime"],
    }
  },
};
