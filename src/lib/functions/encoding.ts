import { z } from 'zod';
import { createFunction, categories, schemas } from './base';

export const encodingFunctions = [
  createFunction('to-base64', {
    name: 'To Base64',
    description: 'Encode text to Base64 format',
    category: categories.ENCODING,
    inputs: z.object({
      text: schemas.text('Text to encode')
    }),
    outputs: z.object({
      base64: schemas.base64('Base64 encoded result')
    }),
    tags: ['encoding', 'base64'],
    execute: ({ text }) => ({
      base64: btoa(unescape(encodeURIComponent(text)))
    })
  }),

  createFunction('from-base64', {
    name: 'From Base64',
    description: 'Decode Base64 text back to original format',
    category: categories.ENCODING,
    inputs: z.object({
      base64: schemas.base64('Base64 encoded text to decode')
    }),
    outputs: z.object({
      text: schemas.text('Decoded text result')
    }),
    tags: ['decoding', 'base64'],
    execute: ({ base64 }) => ({
      text: decodeURIComponent(escape(atob(base64)))
    })
  }),

  createFunction('to-hex', {
    name: 'To Hex',
    description: 'Convert text to hexadecimal representation',
    category: categories.ENCODING,
    inputs: z.object({
      text: schemas.text('Text to convert to hex')
    }),
    outputs: z.object({
      hex: schemas.hex('Hexadecimal representation of the text')
    }),
    tags: ['encoding', 'hex', 'hexadecimal'],
    execute: ({ text }) => ({
      hex: Array.from(new TextEncoder().encode(text))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    })
  }),

  createFunction('from-hex', {
    name: 'From Hex',
    description: 'Convert hexadecimal back to text',
    category: categories.ENCODING,
    inputs: z.object({
      hex: schemas.hex('Hexadecimal string to decode')
    }),
    outputs: z.object({
      text: schemas.text('Decoded text from hex')
    }),
    tags: ['decoding', 'hex', 'hexadecimal'],
    execute: ({ hex }) => ({
      text: new TextDecoder().decode(
        new Uint8Array(hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || [])
      )
    })
  }),

  createFunction('url-encode', {
    name: 'URL Encode',
    description: 'Encode text for safe use in URLs',
    category: categories.ENCODING,
    inputs: z.object({
      text: schemas.text('Text to URL encode')
    }),
    outputs: z.object({
      encoded: schemas.text('URL encoded text')
    }),
    tags: ['encoding', 'url'],
    execute: ({ text }) => ({
      encoded: encodeURIComponent(text)
    })
  }),

  createFunction('url-decode', {
    name: 'URL Decode',
    description: 'Decode URL encoded text back to original format',
    category: categories.ENCODING,
    inputs: z.object({
      encoded: schemas.text('URL encoded text to decode')
    }),
    outputs: z.object({
      text: schemas.text('Decoded text from URL encoding')
    }),
    tags: ['decoding', 'url'],
    execute: ({ encoded }) => ({
      text: decodeURIComponent(encoded)
    })
  })
] as const;