// Function categories for better organization
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
  // ENCODING/DECODING
  {
    id: "to-base64",
    name: "To Base64",
    category: categories.ENCODING,
    description: "Encode text to Base64",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "base64", type: "string" }] as const,
    execute: ({ text }: { text: string }) => ({
      base64: btoa(text)
    }),
  },
  {
    id: "from-base64",
    name: "From Base64",
    category: categories.ENCODING,
    description: "Decode Base64 to text",
    inputs: [{ name: "base64", type: "string" }] as const,
    outputs: [{ name: "text", type: "string" }] as const,
    execute: ({ base64 }: { base64: string }) => ({
      text: atob(base64)
    }),
  },
  {
    id: "to-hex",
    name: "To Hex",
    category: categories.ENCODING,
    description: "Convert text to hexadecimal",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "hex", type: "string" }] as const,
    execute: ({ text }: { text: string }) => ({
      hex: Array.from(new TextEncoder().encode(text))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    }),
  },
  {
    id: "from-hex",
    name: "From Hex",
    category: categories.ENCODING,
    description: "Convert hexadecimal to text",
    inputs: [{ name: "hex", type: "string" }] as const,
    outputs: [{ name: "text", type: "string" }] as const,
    execute: ({ hex }: { hex: string }) => ({
      text: new TextDecoder().decode(
        new Uint8Array(hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || [])
      )
    }),
  },
  {
    id: "url-encode",
    name: "URL Encode",
    category: categories.ENCODING,
    description: "Encode URL components",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "encoded", type: "string" }] as const,
    execute: ({ text }: { text: string }) => ({
      encoded: encodeURIComponent(text)
    }),
  },
  {
    id: "url-decode",
    name: "URL Decode",
    category: categories.ENCODING,
    description: "Decode URL components",
    inputs: [{ name: "urlEncoded", type: "string" }] as const,
    outputs: [{ name: "decoded", type: "string" }] as const,
    execute: ({ urlEncoded }: { urlEncoded: string }) => ({
      decoded: decodeURIComponent(urlEncoded)
    }),
  },

  // STRING OPERATIONS
  {
    id: "to-uppercase",
    name: "To Uppercase",
    category: categories.STRING,
    description: "Convert text to uppercase",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "result", type: "string" }] as const,
    execute: ({ text }: { text: string }) => ({
      result: text.toUpperCase()
    }),
  },
  {
    id: "to-lowercase",
    name: "To Lowercase",
    category: categories.STRING,
    description: "Convert text to lowercase",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "result", type: "string" }] as const,
    execute: ({ text }: { text: string }) => ({
      result: text.toLowerCase()
    }),
  },
  {
    id: "reverse-string",
    name: "Reverse String",
    category: categories.STRING,
    description: "Reverse the order of characters",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "result", type: "string" }] as const,
    execute: ({ text }: { text: string }) => ({
      result: text.split('').reverse().join('')
    }),
  },
  {
    id: "trim-whitespace",
    name: "Trim Whitespace",
    category: categories.STRING,
    description: "Remove leading and trailing whitespace",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "result", type: "string" }] as const,
    execute: ({ text }: { text: string }) => ({
      result: text.trim()
    }),
  },
  {
    id: "string-length",
    name: "String Length",
    category: categories.STRING,
    description: "Get the length of a string",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "length", type: "number" }] as const,
    execute: ({ text }: { text: string }) => ({
      length: text.length
    }),
  },
  {
    id: "split-string",
    name: "Split String",
    category: categories.STRING,
    description: "Split string by delimiter",
    inputs: [
      { name: "text", type: "string" },
      { name: "delimiter", type: "string" },
    ] as const,
    outputs: [{ name: "result", type: "string" }] as const,
    execute: ({ text, delimiter }: { text: string; delimiter: string }) => ({
      result: text.split(delimiter).join('\n')
    }),
  },
  {
    id: "replace-text",
    name: "Replace Text",
    category: categories.STRING,
    description: "Replace all occurrences of a substring",
    inputs: [
      { name: "text", type: "string" },
      { name: "search", type: "string" },
      { name: "replace", type: "string" },
    ] as const,
    outputs: [{ name: "result", type: "string" }] as const,
    execute: ({ text, search, replace }: { text: string; search: string; replace: string }) => ({
      result: text.replaceAll(search, replace)
    }),
  },

  // BINARY DATA
  {
    id: "text-to-binary",
    name: "Text to Binary",
    category: categories.BINARY,
    description: "Convert text to binary representation",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "binary", type: "string" }] as const,
    execute: ({ text }: { text: string }) => ({
      binary: Array.from(new TextEncoder().encode(text))
        .map(byte => byte.toString(2).padStart(8, '0'))
        .join(' ')
    }),
  },
  {
    id: "binary-to-text",
    name: "Binary to Text",
    category: categories.BINARY,
    description: "Convert binary to text",
    inputs: [{ name: "binary", type: "string" }] as const,
    outputs: [{ name: "text", type: "string" }] as const,
    execute: ({ binary }: { binary: string }) => ({
      text: new TextDecoder().decode(
        new Uint8Array(binary.split(/\s+/).map(b => parseInt(b, 2)))
      )
    }),
  },
  {
    id: "bytes-count",
    name: "Byte Count",
    category: categories.BINARY,
    description: "Count bytes in text",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "bytes", type: "number" }] as const,
    execute: ({ text }: { text: string }) => ({
      bytes: new TextEncoder().encode(text).length
    }),
  },

  // CRYPTOGRAPHY
  {
    id: "rot13",
    name: "ROT13",
    category: categories.CRYPTO,
    description: "ROT13 cipher",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "result", type: "string" }] as const,
    execute: ({ text }: { text: string }) => ({
      result: text.replace(/[a-zA-Z]/g, (c: string) => {
        const code = c.charCodeAt(0) + 13;
        return String.fromCharCode((c <= 'Z' ? 90 : 122) >= code ? code : code - 26);
      })
    }),
  },
  {
    id: "caesar-cipher",
    name: "Caesar Cipher",
    category: categories.CRYPTO,
    description: "Caesar cipher with custom shift",
    inputs: [
      { name: "text", type: "string" },
      { name: "shift", type: "number" },
    ] as const,
    outputs: [{ name: "result", type: "string" }] as const,
    execute: ({ text, shift }: { text: string; shift: number }) => ({
      result: text.replace(/[a-zA-Z]/g, (c: string) => {
        const start = c <= 'Z' ? 65 : 97;
        return String.fromCharCode(((c.charCodeAt(0) - start + shift) % 26) + start);
      })
    }),
  },
  {
    id: "xor-cipher",
    name: "XOR Cipher",
    category: categories.CRYPTO,
    description: "XOR cipher with key",
    inputs: [
      { name: "text", type: "string" },
      { name: "key", type: "string" },
    ] as const,
    outputs: [{ name: "result", type: "string" }] as const,
    execute: ({ text, key }: { text: string; key: string }) => ({
      result: text.split('').map((c: string, i: number) => 
        String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
      ).join('')
    }),
  },

  // HASHING (using WebCrypto)
  {
    id: "sha-1",
    name: "SHA-1",
    category: categories.ANALYZE,
    description: "Calculate SHA-1 hash",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "hash", type: "string" }] as const,
    execute: async ({ text }: { text: string }) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return {
        hash: hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      };
    },
  },
  {
    id: "sha-256",
    name: "SHA-256",
    category: categories.ANALYZE,
    description: "Calculate SHA-256 hash",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "hash", type: "string" }] as const,
    execute: async ({ text }: { text: string }) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return {
        hash: hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      };
    },
  },
  {
    id: "sha-512",
    name: "SHA-512",
    category: categories.ANALYZE,
    description: "Calculate SHA-512 hash",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "hash", type: "string" }] as const,
    execute: async ({ text }: { text: string }) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-512', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return {
        hash: hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      };
    },
  },

  // JSON PROCESSING
  {
    id: "json-beautify",
    name: "JSON Beautify",
    category: categories.JSON,
    description: "Format JSON with proper indentation",
    inputs: [{ name: "json", type: "string" }] as const,
    outputs: [{ name: "formatted", type: "string" }] as const,
    execute: ({ json }: { json: string }) => ({
      formatted: JSON.stringify(JSON.parse(json), null, 2)
    }),
  },
  {
    id: "json-minify",
    name: "JSON Minify",
    category: categories.JSON,
    description: "Minify JSON by removing whitespace",
    inputs: [{ name: "json", type: "string" }] as const,
    outputs: [{ name: "minified", type: "string" }] as const,
    execute: ({ json }: { json: string }) => ({
      minified: JSON.stringify(JSON.parse(json))
    }),
  },
  {
    id: "json-validate",
    name: "JSON Validate",
    category: categories.JSON,
    description: "Validate JSON syntax",
    inputs: [{ name: "json", type: "string" }] as const,
    outputs: [{ name: "valid", type: "boolean" }, { name: "error", type: "string" }] as const,
    execute: ({ json }: { json: string }) => {
      try {
        JSON.parse(json);
        return { valid: true, error: "" };
      } catch (e) {
        return { valid: false, error: e instanceof Error ? e.message : "Invalid JSON" };
      }
    },
  },
  {
    id: "json-extract-keys",
    name: "Extract JSON Keys",
    category: categories.JSON,
    description: "Extract all keys from JSON object",
    inputs: [{ name: "json", type: "string" }] as const,
    outputs: [{ name: "keys", type: "string" }] as const,
    execute: ({ json }: { json: string }) => {
      const obj = JSON.parse(json);
      const extractKeys = (obj: any, prefix = ""): string[] => {
        let keys: string[] = [];
        for (const key in obj) {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          keys.push(fullKey);
          if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            keys = keys.concat(extractKeys(obj[key], fullKey));
          }
        }
        return keys;
      };
      return { keys: extractKeys(obj).join('\n') };
    },
  },

  // JWT OPERATIONS  
  {
    id: "jwt-decode",
    name: "JWT Decode",
    category: categories.JWT,
    description: "Decode JWT token (header and payload only)",
    inputs: [{ name: "token", type: "string" }] as const,
    outputs: [{ name: "decoded", type: "string" }] as const,
    execute: ({ token }: { token: string }) => {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT token');
      }
      
      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      
      return {
        decoded: JSON.stringify({ header, payload }, null, 2)
      };
    },
  },

  // COMPRESSION (using built-in compression streams)
  {
    id: "gzip-compress",
    name: "GZIP Compress",
    category: categories.COMPRESSION,
    description: "Compress text using GZIP",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "compressed", type: "string" }] as const,
    execute: async ({ text }: { text: string }) => {
      const stream = new CompressionStream('gzip');
      const writer = stream.writable.getWriter();
      const reader = stream.readable.getReader();
      
      writer.write(new TextEncoder().encode(text));
      writer.close();
      
      const chunks: Uint8Array[] = [];
      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) chunks.push(value);
      }
      
      const compressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        compressed.set(chunk, offset);
        offset += chunk.length;
      }
      
      return { compressed: btoa(String.fromCharCode(...compressed)) };
    },
  },
  {
    id: "gzip-decompress",
    name: "GZIP Decompress",
    category: categories.COMPRESSION,
    description: "Decompress GZIP compressed text",
    inputs: [{ name: "compressed", type: "string" }] as const,
    outputs: [{ name: "text", type: "string" }] as const,
    execute: async ({ compressed }: { compressed: string }) => {
      const compressedData = Uint8Array.from(atob(compressed), c => c.charCodeAt(0));
      
      const stream = new DecompressionStream('gzip');
      const writer = stream.writable.getWriter();
      const reader = stream.readable.getReader();
      
      writer.write(compressedData);
      writer.close();
      
      const chunks: Uint8Array[] = [];
      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) chunks.push(value);
      }
      
      const decompressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        decompressed.set(chunk, offset);
        offset += chunk.length;
      }
      
      return { text: new TextDecoder().decode(decompressed) };
    },
  },

  // FORMATTING
  {
    id: "html-entity-encode",
    name: "HTML Entity Encode",
    category: categories.FORMAT,
    description: "Encode HTML special characters to entities",
    inputs: [{ name: "text", type: "string" }] as const,
    outputs: [{ name: "encoded", type: "string" }] as const,
    execute: ({ text }: { text: string }) => {
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
      return {
        encoded: text.replace(/[&<>"'`=\/]/g, (char: string) => entities[char])
      };
    },
  },
  {
    id: "html-entity-decode",
    name: "HTML Entity Decode",
    category: categories.FORMAT,
    description: "Decode HTML entities to characters",
    inputs: [{ name: "encoded", type: "string" }] as const,
    outputs: [{ name: "text", type: "string" }] as const,
    execute: ({ encoded }: { encoded: string }) => {
      const entities: Record<string, string> = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&#x2F;': '/',
        '&#x60;': '`',
        '&#x3D;': '='
      };
      let result = encoded;
      for (const [entity, char] of Object.entries(entities)) {
        result = result.replaceAll(entity, char);
      }
      return { text: result };
    },
  },
  {
    id: "xml-beautify",
    name: "XML Beautify",
    category: categories.FORMAT,
    description: "Format XML with proper indentation",
    inputs: [{ name: "xml", type: "string" }] as const,
    outputs: [{ name: "formatted", type: "string" }] as const,
    execute: ({ xml }: { xml: string }) => {
      const parser = new DOMParser();
      const serializer = new XMLSerializer();
      const doc = parser.parseFromString(xml, "text/xml");
      return {
        formatted: serializer.serializeToString(doc)
      };
    },
  },

  // CONVERSION
  {
    id: "number-to-words",
    name: "Number to Words",
    category: categories.CONVERT,
    description: "Convert number to words (simple implementation)",
    inputs: [{ name: "number", type: "number" }] as const,
    outputs: [{ name: "words", type: "string" }] as const,
    execute: ({ number }: { number: number }) => {
      const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
      const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
      const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
      
      if (number === 0) return { words: 'zero' };
      if (number < 0) {
        // Simple handling for negative numbers  
        return { words: 'negative number' };
      }
      
      let result = '';
      if (number >= 1000) {
        result += ones[Math.floor(number / 1000)] + ' thousand ';
        number %= 1000;
      }
      if (number >= 100) {
        result += ones[Math.floor(number / 100)] + ' hundred ';
        number %= 100;
      }
      if (number >= 20) {
        result += tens[Math.floor(number / 10)] + ' ';
        number %= 10;
      } else if (number >= 10) {
        result += teens[number - 10] + ' ';
        number = 0;
      }
      if (number > 0) {
        result += ones[number] + ' ';
      }
      
      return { words: result.trim() };
    },
  },
  {
    id: "unix-timestamp",
    name: "Unix Timestamp",
    category: categories.CONVERT,
    description: "Get current Unix timestamp",
    inputs: [] as const,
    outputs: [{ name: "timestamp", type: "number" }] as const,
    execute: () => ({
      timestamp: Math.floor(Date.now() / 1000)
    }),
  },
  {
    id: "timestamp-to-date",
    name: "Timestamp to Date",
    category: categories.CONVERT,
    description: "Convert Unix timestamp to human readable date",
    inputs: [{ name: "timestamp", type: "number" }] as const,
    outputs: [{ name: "date", type: "string" }] as const,
    execute: ({ timestamp }: { timestamp: number }) => ({
      date: new Date(timestamp * 1000).toISOString()
    }),
  },
];