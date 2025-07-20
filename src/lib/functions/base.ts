import { z } from 'zod';

// Function categories
export const categories = {
  STRING: 'String Operations',
  BINARY: 'Binary Data', 
  CRYPTO: 'Cryptography',
  JSON: 'JSON Processing',
  ENCODING: 'Encoding/Decoding',
  JWT: 'JWT Operations',
  COMPRESSION: 'Compression',
  FORMAT: 'Formatting',
  CONVERT: 'Conversion',
  ANALYZE: 'Analysis',
} as const;

export type FunctionCategory = typeof categories[keyof typeof categories];

// Result wrapper for execution
export type FunctionResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
};

// AI tool-call inspired function definition
export interface FunctionDefinition<
  TInputSchema extends z.ZodType,
  TOutputSchema extends z.ZodType
> {
  readonly name: string;
  readonly description: string;
  readonly category: FunctionCategory;
  readonly inputs: TInputSchema;
  readonly outputs: TOutputSchema;
  readonly tags?: readonly string[];
  execute: (
    inputs: z.infer<TInputSchema>
  ) => z.infer<TOutputSchema> | Promise<z.infer<TOutputSchema>>;
}

// Enhanced function with validation and metadata extraction
export interface EnhancedFunction<
  TInputSchema extends z.ZodType,
  TOutputSchema extends z.ZodType
> extends FunctionDefinition<TInputSchema, TOutputSchema> {
  readonly id: string;
  executeWithValidation: (
    inputs: unknown
  ) => Promise<FunctionResult<z.infer<TOutputSchema>>>;
  getInputFields: () => FieldInfo[];
  getOutputFields: () => FieldInfo[];
}

// UI field information extracted from schema
export interface FieldInfo {
  name: string;
  type: string;
  description?: string;
  optional: boolean;
  defaultValue?: unknown;
  constraints?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    enum?: unknown[];
  };
}

// Create enhanced function with validation and metadata
export function createFunction<
  TInputSchema extends z.ZodType,
  TOutputSchema extends z.ZodType
>(
  id: string,
  definition: FunctionDefinition<TInputSchema, TOutputSchema>
): EnhancedFunction<TInputSchema, TOutputSchema> {
  return {
    id,
    ...definition,
    executeWithValidation: async (inputs: unknown) => {
      try {
        // Validate inputs
        const inputValidation = definition.inputs.safeParse(inputs);
        if (!inputValidation.success) {
          return {
            success: false,
            error: 'Invalid input parameters',
            code: 'VALIDATION_ERROR',
            details: inputValidation.error.format()
          };
        }

        // Execute function
        const result = await definition.execute(inputValidation.data);

        // Validate outputs
        const outputValidation = definition.outputs.safeParse(result);
        if (!outputValidation.success) {
          return {
            success: false,
            error: 'Function returned invalid output',
            code: 'INVALID_OUTPUT',
            details: outputValidation.error.format()
          };
        }

        return { success: true, data: outputValidation.data };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
          code: 'EXECUTION_ERROR',
          details: error
        };
      }
    },
    getInputFields: () => extractFieldInfo(definition.inputs),
    getOutputFields: () => extractFieldInfo(definition.outputs)
  };
}

// Extract field information from Zod schema for UI generation
function extractFieldInfo(schema: z.ZodType): FieldInfo[] {
  const fields: FieldInfo[] = [];

  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    for (const [key, fieldSchema] of Object.entries(shape)) {
      fields.push(extractSingleFieldInfo(key, fieldSchema as z.ZodType));
    }
  }

  return fields;
}

function extractSingleFieldInfo(name: string, schema: z.ZodType): FieldInfo {
  let unwrapped = schema;
  let optional = false;
  let defaultValue: unknown = undefined;

  // Handle optional fields
  if (unwrapped instanceof z.ZodOptional) {
    optional = true;
    unwrapped = (unwrapped as any)._def.innerType;
  }

  // Handle default values
  if (unwrapped instanceof z.ZodDefault) {
    defaultValue = (unwrapped as any)._def.defaultValue();
    unwrapped = (unwrapped as any)._def.innerType;
  }

  const field: FieldInfo = {
    name,
    type: getZodTypeName(unwrapped),
    optional,
    description: unwrapped.description,
    defaultValue
  };

  // Extract constraints based on schema type
  field.constraints = extractConstraints(unwrapped);

  return field;
}

function extractConstraints(schema: z.ZodType): FieldInfo['constraints'] {
  const constraints: FieldInfo['constraints'] = {};

  if (schema instanceof z.ZodString) {
    if (schema.minLength !== null) constraints.minLength = schema.minLength;
    if (schema.maxLength !== null) constraints.maxLength = schema.maxLength;
    // Extract regex pattern if available
    const checks = (schema as any)._def.checks || [];
    for (const check of checks) {
      if (check.kind === 'regex') {
        constraints.pattern = check.regex.source;
      }
    }
  } else if (schema instanceof z.ZodNumber) {
    if (schema.minValue !== null) constraints.min = schema.minValue;
    if (schema.maxValue !== null) constraints.max = schema.maxValue;
  } else if (schema instanceof z.ZodEnum) {
    constraints.enum = schema.options;
  }

  return Object.keys(constraints).length > 0 ? constraints : undefined;
}

function getZodTypeName(schema: z.ZodType): string {
  if (schema instanceof z.ZodString) return 'string';
  if (schema instanceof z.ZodNumber) return 'number';
  if (schema instanceof z.ZodBoolean) return 'boolean';
  if (schema instanceof z.ZodArray) return 'array';
  if (schema instanceof z.ZodObject) return 'object';
  if (schema instanceof z.ZodEnum) return 'enum';
  if (schema instanceof z.ZodLiteral) return 'literal';
  return 'unknown';
}

// Common schema helpers for consistent types across functions
export const schemas = {
  // String schemas
  text: (description: string) => z.string().describe(description),
  textOptional: (description: string) => z.string().optional().describe(description),
  textWithLength: (min: number, max: number, description: string) => 
    z.string().min(min).max(max).describe(description),
  
  // Number schemas  
  number: (description: string) => z.number().describe(description),
  integer: (description: string) => z.number().int().describe(description),
  positiveNumber: (description: string) => z.number().positive().describe(description),
  range: (min: number, max: number, description: string) => 
    z.number().min(min).max(max).describe(description),
  
  // Boolean schema
  boolean: (description: string) => z.boolean().describe(description),
  
  // Array schemas
  array: <T extends z.ZodType>(itemSchema: T, description: string) => 
    z.array(itemSchema).describe(description),
  
  // Object schemas
  json: (description: string) => z.record(z.unknown()).describe(description),
  
  // Enum schemas
  enum: <T extends readonly [string, ...string[]]>(values: T, description: string) =>
    z.enum(values).describe(description),
  
  // Advanced string patterns
  email: (description: string) => z.string().email(description).describe(description),
  url: (description: string) => z.string().url(description).describe(description),
  base64: (description: string) => z.string().describe(description),
  hex: (description: string) => z.string().regex(/^[0-9a-fA-F]*$/).describe(description),
  
  // JWT token
  jwt: (description: string) => z.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/).describe(description),
};