// Function categories for better organization
export const categories = {
  ENCODING: 'Encoding/Decoding',
  CRYPTO: 'Cryptography',
  FORMAT: 'Formatting',
  CONVERT: 'Conversion',
  ANALYZE: 'Analysis',
  STRING: 'String Operations',
} as const;

// Valid types for inputs and outputs
type ValidType = string | number | boolean;

// Function input/output types
export type FnInputType = {
  readonly name: string;
  readonly type: ValidType;
}

export type FnOutputType = {
  readonly name: string;
  readonly type: ValidType;
}

// Helper type to extract input parameters with proper type mapping
type ExtractInputs<T extends readonly FnInputType[]> = {
  [P in T[number] as P['name']]: T[number] extends { name: P['name']; type: infer Type } ? Type : never;
}

// Helper type to extract output parameters with proper type mapping
type ExtractOutputs<T extends readonly FnOutputType[]> = {
  [P in T[number] as P['name']]: T[number] extends { name: P['name']; type: infer Type } ? Type : never;
}

// Function definition type
export type FnDef<
  I extends readonly FnInputType[],
  O extends readonly FnOutputType[]
> = {
  readonly id: string;
  readonly name: string;
  readonly category: typeof categories[keyof typeof categories];
  readonly description: string;
  readonly inputs: I;
  readonly outputs: O;
  execute: (inputs: ExtractInputs<I>) => ExtractOutputs<O> | Promise<ExtractOutputs<O>>;
}

export const functions = [
  {
    id: "to-base64",
    name: "To Base64",
    category: categories.STRING,
    description: "Encode text to Base64",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "base64", type: "string" }] as const,
    execute: ({ text }) => ({
      base64: btoa(text)
    }),
  },
  {
    id: "from-base64",
    name: "From Base64",
    category: categories.STRING,
    description: "Decode Base64 to text",
    inputs: [{ name: "base64", type: "string" }] as const,
    outputs: [{ name: "text", type: "string" }] as const,
    execute: ({ base64 }) => atob(base64),
  },
  {
    id: "url-encode",
    name: "URL Encode",
    category: categories.STRING,
    description: "Encode URL components",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "encoded", type: "string" }] as const,
    execute: ({ text }) => encodeURIComponent(text),
  },
  {
    id: "url-decode",
    name: "URL Decode",
    category: categories.STRING,
    description: "Decode URL components",
    inputs: [{ name: "urlEncoded", type: "string" }] as const,
    outputs: [{ name: "decoded", type: "string" }] as const,
    execute: ({ urlEncoded }) => decodeURIComponent(urlEncoded),
  },
  {
    id: "aes-encrypt",
    name: "AES Encrypt",
    category: categories.CRYPTO,
    description: "Encrypt text using AES",
    inputs: [
      { name: "text", type: "string" },
      { name: "key", type: "string" },
    ] as const,
    outputs: [{ name: "encrypted", type: "string" }] as const,
    execute: ({ text, key }) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      // TODO: Implement AES encryption
      return btoa(String.fromCharCode(...new Uint8Array(data)));
    },
  },
  {
    id: "aes-decrypt",
    name: "AES Decrypt",
    category: categories.CRYPTO,
    description: "Decrypt AES encrypted text",
    inputs: [
      { name: "encrypted", type: "string" },
      { name: "key", type: "string" },
    ] as const,
    outputs: [{ name: "decrypted", type: "string" }] as const,
    execute: ({ encrypted, key }) => {
      const data = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
      const decoder = new TextDecoder();
      // TODO: Implement AES decryption
      return decoder.decode(data);
    },
  },
  {
    id: "rot13",
    name: "ROT13",
    category: categories.CRYPTO,
    description: "ROT13 cipher",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "result", type: "string" }] as const,
    execute: ({ text }) => text.replace(/[a-zA-Z]/g, c => String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)),
  },
  {
    id: "xor",
    name: "XOR",
    category: categories.CRYPTO,
    description: "XOR cipher",
    inputs: [
      { name: "text", type: "string" },
      { name: "key", type: "string" },
    ] as const,
    outputs: [{ name: "result", type: "string" }] as const,
    execute: ({ text, key }) => text.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))).join(''),
  },
  {
    id: "md5",
    name: "MD5",
    category: categories.ANALYZE,
    description: "Calculate MD5 hash",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "hash", type: "string" }] as const,
    execute: async ({ text }) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('MD5', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },
  },
  {
    id: "sha-1",
    name: "SHA-1",
    category: categories.ANALYZE,
    description: "Calculate SHA-1 hash",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "hash", type: "string" }] as const,
    execute: async ({ text }) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },
  },
  {
    id: "sha-256",
    name: "SHA-256",
    category: categories.ANALYZE,
    description: "Calculate SHA-256 hash",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "hash", type: "string" }] as const,
    execute: async ({ text }) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },
  },
  {
    id: "sha-512",
    name: "SHA-512",
    category: categories.ANALYZE,
    description: "Calculate SHA-512 hash",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "hash", type: "string" }] as const,
    execute: async ({ text }) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-512', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },
  },
  {
    id: "json-beautify",
    name: "JSON Beautify",
    category: categories.FORMAT,
    description: "Format JSON with proper indentation",
    inputs: [{ name: "json", type: "string" }] as const,
    outputs: [{ name: "formatted", type: "string" }] as const,
    execute: ({ json }) => JSON.stringify(JSON.parse(json), null, 2),
  },
  {
    id: "json-minify",
    name: "JSON Minify",
    category: categories.FORMAT,
    description: "Minify JSON by removing whitespace",
    inputs: [{ name: "json", type: "string" }] as const,
    outputs: [{ name: "minified", type: "string" }] as const,
    execute: ({ json }) => JSON.stringify(JSON.parse(json)),
  },
  {
    id: "xml-beautify",
    name: "XML Beautify",
    category: categories.FORMAT,
    description: "Format XML with proper indentation",
    inputs: [{ name: "xml", type: "string" }] as const,
    outputs: [{ name: "formatted", type: "string" }] as const,
    execute: ({ xml }) => {
      const parser = new DOMParser();
      const serializer = new XMLSerializer();
      const doc = parser.parseFromString(xml, "text/xml");
      return serializer.serializeToString(doc);
    },
  },
  {
    id: "html-entity-encode",
    name: "HTML Entity Encode",
    category: categories.FORMAT,
    description: "Encode HTML special characters to entities",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "encoded", type: "string" }] as const,
    execute: ({ text }) => {
      const entities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
      };
      return text.replace(/[&<>"'`=\/]/g, char => entities[char]);
    },
  },
];
