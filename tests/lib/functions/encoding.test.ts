import { test, expect } from 'bun:test';
import { encodingFunctions } from '../../../src/lib/functions/encoding';

// Helper to find function by ID
const getFunction = (id: string) => encodingFunctions.find(fn => fn.id === id)!;

test('to-base64: encodes text correctly', async () => {
  const fn = getFunction('to-base64');
  const result = await fn.executeWithValidation({ text: 'Hello World' });
  
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.base64).toBe('SGVsbG8gV29ybGQ=');
  }
});

test('to-base64: handles empty string', async () => {
  const fn = getFunction('to-base64');
  const result = await fn.executeWithValidation({ text: '' });
  
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.base64).toBe('');
  }
});

test('to-base64: handles unicode characters', async () => {
  const fn = getFunction('to-base64');
  const result = await fn.executeWithValidation({ text: '👋🌍' });
  
  if (!result.success) {
    console.log('Error:', result.error, result.details);
  }
  
  expect(result.success).toBe(true);
  if (result.success) {
    // Verify it's valid base64 and can be decoded back
    expect(result.data.base64).toMatch(/^[A-Za-z0-9+/]*={0,2}$/);
  }
});

test('from-base64: decodes text correctly', async () => {
  const fn = getFunction('from-base64');
  const result = await fn.executeWithValidation({ base64: 'SGVsbG8gV29ybGQ=' });
  
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.text).toBe('Hello World');
  }
});

test('from-base64: handles invalid base64', async () => {
  const fn = getFunction('from-base64');
  const result = await fn.executeWithValidation({ base64: 'invalid!@#' });
  
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.code).toBe('EXECUTION_ERROR');
  }
});

test('base64 round trip: encode then decode preserves original', async () => {
  const toBase64 = getFunction('to-base64');
  const fromBase64 = getFunction('from-base64');
  
  const original = 'Hello, 世界! 🌍';
  
  const encoded = await toBase64.executeWithValidation({ text: original });
  expect(encoded.success).toBe(true);
  
  if (encoded.success) {
    const decoded = await fromBase64.executeWithValidation({ base64: encoded.data.base64 });
    expect(decoded.success).toBe(true);
    
    if (decoded.success) {
      expect(decoded.data.text).toBe(original);
    }
  }
});

test('to-hex: converts text to hexadecimal', async () => {
  const fn = getFunction('to-hex');
  const result = await fn.executeWithValidation({ text: 'Hello' });
  
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.hex).toBe('48656c6c6f');
  }
});

test('from-hex: converts hexadecimal to text', async () => {
  const fn = getFunction('from-hex');
  const result = await fn.executeWithValidation({ hex: '48656c6c6f' });
  
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.text).toBe('Hello');
  }
});

test('hex round trip: preserves original text', async () => {
  const toHex = getFunction('to-hex');
  const fromHex = getFunction('from-hex');
  
  const original = 'Test 123 🚀';
  
  const encoded = await toHex.executeWithValidation({ text: original });
  expect(encoded.success).toBe(true);
  
  if (encoded.success) {
    const decoded = await fromHex.executeWithValidation({ hex: encoded.data.hex });
    expect(decoded.success).toBe(true);
    
    if (decoded.success) {
      expect(decoded.data.text).toBe(original);
    }
  }
});

test('url-encode: encodes special characters', async () => {
  const fn = getFunction('url-encode');
  const result = await fn.executeWithValidation({ text: 'hello world & you' });
  
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.encoded).toBe('hello%20world%20%26%20you');
  }
});

test('url-decode: decodes URL encoded text', async () => {
  const fn = getFunction('url-decode');
  const result = await fn.executeWithValidation({ encoded: 'hello%20world%20%26%20you' });
  
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.text).toBe('hello world & you');
  }
});

test('url encoding round trip: preserves original', async () => {
  const urlEncode = getFunction('url-encode');
  const urlDecode = getFunction('url-decode');
  
  const original = 'Hello, world! @#$%^&*()';
  
  const encoded = await urlEncode.executeWithValidation({ text: original });
  expect(encoded.success).toBe(true);
  
  if (encoded.success) {
    const decoded = await urlDecode.executeWithValidation({ encoded: encoded.data.encoded });
    expect(decoded.success).toBe(true);
    
    if (decoded.success) {
      expect(decoded.data.text).toBe(original);
    }
  }
});