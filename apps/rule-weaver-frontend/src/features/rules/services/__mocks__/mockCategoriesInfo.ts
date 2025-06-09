import { CategoriesInfoMap } from '../../types/rule';

// Mock data for categories info with schemaId and destinations with extra properties
export const mockCategoriesInfo: CategoriesInfoMap = {
  'partners-images': {
    schemaId: '1',
    destinations: {
      A: {
        destination: 'A',
        category: 'partners-images',
        typeOptions: { fieldName: 'format', options: ['json', 'xml', 'csv'] },
        validOperators: ['EQUALS'],
        extraProperties: {
          type: 'object',
          properties: {
            resolution: { type: 'string', enum: ['low', 'medium', 'high'] },
            watermark: { type: 'boolean' },
            colorProfile: { type: 'string' },
          },
          required: ['resolution', 'watermark'],
        },
      },
      B: {
        destination: 'B',
        category: 'partners-images',
        typeOptions: { fieldName: 'format', options: ['json', 'xml', 'csv'] },
        extraProperties: {
          type: 'object',
          properties: {
            compressionLevel: { type: 'number', minimum: 1, maximum: 10 },
            storageType: { type: 'string', enum: ['standard', 'premium'] },
          },
          additionalProperties: false,
        },
      },
      C: {
        destination: 'C',
        category: 'partners-images',
        typeOptions: { fieldName: 'format', options: ['json', 'xml', 'csv'] },
        extraProperties: {
          type: 'object',
          properties: {
            format: { type: 'string', enum: ['jpg', 'png', 'webp'] },
            transparencySupport: { type: 'boolean' },
          },
        },
      },
    },
  },
  'partners-algo': {
    schemaId: '2',
    destinations: {
      A: {
        destination: 'A',
        category: 'partners-algo',
        typeOptions: {
          fieldName: 'algorithm',
          options: ['json', 'xml', 'csv'],
        },
        extraProperties: {
          type: 'object',
          properties: {
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            maxExecutionTime: { type: 'number' },
          },
          required: ['priority', 'maxExecutionTime'],
        },
      },
      D: {
        destination: 'D',
        category: 'partners-algo',
        typeOptions: {
          fieldName: 'algorithm',
          options: ['json', 'xml', 'csv'],
        },
        extraProperties: {
          type: 'object',
          properties: {
            processingMode: { type: 'string', enum: ['batch', 'realtime'] },
            resourceAllocation: { type: 'number', minimum: 1, maximum: 5 },
          },
          required: ['processingMode'],
        },
      },
    },
  },
  'data-processing': {
    schemaId: '3',
    destinations: {
      B: {
        destination: 'B',
        category: 'data-processing',
        typeOptions: { fieldName: 'dataType', options: ['json', 'xml', 'csv'] },
        extraProperties: {
          type: 'object',
          properties: {
            dataFormat: { type: 'string', enum: ['json', 'xml', 'csv'] },
            compressionEnabled: { type: 'boolean' },
          },
        },
      },
      E: {
        destination: 'E',
        category: 'data-processing',
        typeOptions: { fieldName: 'dataType', options: ['json', 'xml', 'csv'] },
        extraProperties: {
          type: 'object',
          properties: {
            batchSize: { type: 'number', minimum: 100, maximum: 10000 },
            retentionPeriod: { type: 'number' },
            dataValidation: { type: 'boolean' },
          },
          required: ['batchSize', 'dataValidation'],
        },
      },
    },
  },
  'partners-content': {
    schemaId: '4',
    destinations: {
      A: {
        destination: 'A',
        category: 'partners-content',
        typeOptions: {
          fieldName: 'contentType',
          options: ['json', 'xml', 'csv'],
        },
        extraProperties: {
          type: 'object',
          properties: {
            retention: { type: 'string' },
            sensitivity: {
              type: 'string',
              enum: ['public', 'internal', 'confidential'],
            },
            distribution: { type: 'string', enum: ['internal', 'external'] },
          },
        },
      },
    },
  },
  'user-content': {
    schemaId: '5',
    destinations: {
      A: {
        destination: 'A',
        category: 'user-content',
        typeOptions: {
          fieldName: 'contentFormat',
          options: ['json', 'xml', 'csv'],
        },
        extraProperties: {
          type: 'object',
          properties: {
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            caching: { type: 'boolean' },
            replication: { type: 'number' },
          },
        },
      },
      D: {
        destination: 'D',
        category: 'user-content',
        typeOptions: {
          fieldName: 'contentFormat',
          options: ['json', 'xml', 'csv'],
        },
        extraProperties: {
          type: 'object',
          properties: {
            moderationType: { type: 'string', enum: ['manual', 'automated'] },
            queuePriority: { type: 'string', enum: ['low', 'medium', 'high'] },
          },
        },
      },
    },
  },
  'dev-resources': {
    schemaId: '6',
    destinations: {
      B: {
        destination: 'B',
        category: 'dev-resources',
        typeOptions: {
          fieldName: 'resourceFormat',
          options: ['json', 'xml', 'csv'],
        },
        extraProperties: {
          type: 'object',
          properties: {
            accessLevel: { type: 'string', enum: ['read', 'write', 'admin'] },
            environment: {
              type: 'string',
              enum: ['development', 'staging', 'production'],
            },
          },
        },
      },
    },
  },
  archive: {
    schemaId: '7',
    destinations: {
      C: {
        destination: 'C',
        category: 'archive',
        typeOptions: {
          fieldName: 'storageProvider',
          options: ['s3', 'gcs', 'azure'],
        },
        extraProperties: {
          type: 'object',
          properties: {
            storageClass: { type: 'string', enum: ['hot', 'cold', 'archive'] },
            compression: { type: 'boolean' },
          },
        },
      },
    },
  },
  compliance: {
    schemaId: '8',
    destinations: {
      C: {
        destination: 'C',
        category: 'compliance',
        typeOptions: {
          fieldName: 'storageProvider',
          options: ['s3', 'gcs', 'azure'],
        },
        extraProperties: {
          type: 'object',
          properties: {
            encryption: { type: 'string' },
            accessControl: { type: 'string', enum: ['standard', 'strict'] },
            auditLog: { type: 'boolean' },
          },
        },
      },
    },
  },
  'real-time': {
    schemaId: '9',
    destinations: {
      D: {
        destination: 'D',
        category: 'real-time',
        typeOptions: {
          fieldName: 'dataFormat',
          options: ['json', 'xml', 'csv'],
        },
        extraProperties: {
          type: 'object',
          properties: {
            latencyRequirement: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
            },
            bufferSize: { type: 'string', enum: ['small', 'medium', 'large'] },
          },
        },
      },
    },
  },
  'ml-data': {
    schemaId: '10',
    destinations: {
      D: {
        destination: 'D',
        category: 'ml-data',
        typeOptions: {
          fieldName: 'dataFormat',
          options: ['json', 'xml', 'csv'],
        },
        extraProperties: {
          type: 'object',
          properties: {
            dataQuality: { type: 'string', enum: ['low', 'medium', 'high'] },
            versioning: { type: 'boolean' },
          },
        },
      },
    },
  },
  'api-responses': {
    schemaId: '11',
    destinations: {
      D: {
        destination: 'D',
        category: 'api-responses',
        typeOptions: {
          fieldName: 'responseFormat',
          options: ['json', 'xml', 'csv'],
        },
        extraProperties: {
          type: 'object',
          properties: {
            cacheStrategy: { type: 'string', enum: ['lru', 'fifo', 'random'] },
            maxAge: { type: 'number' },
          },
        },
      },
    },
  },
};
