import { test, expect } from 'bun:test';
import { stringFunctions } from '../../../src/lib/functions/string';

// Helper to find function by ID
const getFunction = (id: string) => stringFunctions.find(fn => fn.id === id)!;

test('to-uppercase: converts text to uppercase', async () => {
  const fn = getFunction('to-uppercase');
  const result = await fn.executeWithValidation({ text: 'hello world' });
  
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.result).toBe('HELLO WORLD');
  }
});

test('to-uppercase: handles empty string', async () => {
  const fn = getFunction('to-uppercase');
  const result = await fn.executeWithValidation({ text: '' });
  
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.result).toBe('');
  }
});

test('to-uppercase: validates input schema', async () => {
  const fn = getFunction('to-uppercase');
  const result = await fn.executeWithValidation({ text: 123 });
  
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.code).toBe('VALIDATION_ERROR');
  }
});

test('to-lowercase: converts text to lowercase', async () => {
  const fn = getFunction('to-lowercase');
  const result = await fn.executeWithValidation({ text: 'HELLO WORLD' });
  
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.result).toBe('hello world');
  }
});

test('reverse-string: reverses character order', async () => {
  const fn = getFunction('reverse-string');
  const result = await fn.executeWithValidation({ text: 'hello' });
  
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.result).toBe('olleh');
  }
});

test('reverse-string: handles palindromes', async () => {
  const fn = getFunction('reverse-string');
  const result = await fn.executeWithValidation({ text: 'racecar' });
  
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.result).toBe('racecar');
  }
});

test('trim-whitespace: removes leading and trailing spaces', async () => {
  const fn = getFunction('trim-whitespace');
  const result = await fn.executeWithValidation({ text: '  hello world  ' });
  
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.result).toBe('hello world');
  }
});

test('trim-whitespace: handles tabs and newlines', async () => {
  const fn = getFunction('trim-whitespace');
  const result = await fn.executeWithValidation({ text: '\t\n  hello  \n\t' });
  
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.result).toBe('hello');
  }
});

test('string-length: counts characters correctly', async () => {
  const fn = getFunction('string-length');
  const result = await fn.executeWithValidation({ text: 'hello' });
  
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.length).toBe(5);
  }
});

test('string-length: handles unicode characters', async () => {
  const fn = getFunction('string-length');
  const result = await fn.executeWithValidation({ text: '👋🌍' });
  
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.length).toBe(4); // Each emoji is 2 UTF-16 code units
  }
});

test('split-string: splits by delimiter', async () => {
  const fn = getFunction('split-string');
  const result = await fn.executeWithValidation({ 
    text: 'hello,world,test', 
    delimiter: ',' 
  });
  
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.parts).toEqual(['hello', 'world', 'test']);
    expect(result.data.count).toBe(3);
  }
});

test('split-string: uses default space delimiter', async () => {
  const fn = getFunction('split-string');
  const result = await fn.executeWithValidation({ 
    text: 'hello world test'
  });
  
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.parts).toEqual(['hello', 'world', 'test']);
    expect(result.data.count).toBe(3);
  }
});

test('replace-text: replaces all occurrences', async () => {
  const fn = getFunction('replace-text');
  const result = await fn.executeWithValidation({ 
    text: 'hello world hello', 
    search: 'hello', 
    replace: 'hi' 
  });
  
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.result).toBe('hi world hi');
    expect(result.data.replacements).toBe(2);
  }
});

test('replace-text: handles no matches', async () => {
  const fn = getFunction('replace-text');
  const result = await fn.executeWithValidation({ 
    text: 'hello world', 
    search: 'xyz', 
    replace: 'abc' 
  });
  
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.result).toBe('hello world');
    expect(result.data.replacements).toBe(0);
  }
});