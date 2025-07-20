import { Edge } from '@xyflow/react';

// Type for our example workflows
export interface ExampleWorkflow {
  id: string;
  name: string;
  description: string;
  nodes: any[];
  edges: Edge[];
}

export const exampleWorkflows: ExampleWorkflow[] = [
  {
    id: 'hello-world',
    name: 'Hello World',
    description: 'Simple string input to viewer example',
    nodes: [
      {
        id: 'input-1',
        type: 'string-input',
        position: { x: 100, y: 100 },
        data: {
          value: 'Hello, World!',
          onValueChange: () => {}
        }
      },
      {
        id: 'viewer-1',
        type: 'string-viewer',
        position: { x: 400, y: 100 },
        data: {
          value: 'Hello, World!'
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'input-1',
        target: 'viewer-1',
        sourceHandle: 'value',
        targetHandle: 'input'
      }
    ]
  },

  {
    id: 'base64-encoding',
    name: 'Base64 Encoding',
    description: 'Encode text to Base64 and view results',
    nodes: [
      {
        id: 'string-input-1',
        type: 'string-input',
        position: { x: 50, y: 150 },
        data: {
          value: 'Hello, Spaghetti!',
          onValueChange: () => {}
        }
      },
      {
        id: 'base64-encode-1',
        type: 'function',
        position: { x: 350, y: 150 },
        data: {
          functionId: 'to-base64',
          outputs: {},
          validationErrors: {}
        }
      },
      {
        id: 'string-viewer-1',
        type: 'string-viewer',
        position: { x: 650, y: 100 },
        data: {
          value: undefined
        }
      },
      {
        id: 'binary-viewer-1',
        type: 'binary-viewer',
        position: { x: 650, y: 250 },
        data: {
          value: undefined
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'string-input-1',
        target: 'base64-encode-1',
        sourceHandle: 'value',
        targetHandle: 'text'
      },
      {
        id: 'e2',
        source: 'base64-encode-1',
        target: 'string-viewer-1',
        sourceHandle: 'base64',
        targetHandle: 'input'
      },
      {
        id: 'e3',
        source: 'base64-encode-1',
        target: 'binary-viewer-1',
        sourceHandle: 'base64',
        targetHandle: 'input'
      }
    ]
  },

  {
    id: 'string-processing',
    name: 'String Processing',
    description: 'Transform text through multiple operations',
    nodes: [
      {
        id: 'input-1',
        type: 'string-input',
        position: { x: 50, y: 200 },
        data: {
          value: 'hello world',
          onValueChange: () => {}
        }
      },
      {
        id: 'uppercase-1',
        type: 'function',
        position: { x: 300, y: 150 },
        data: {
          functionId: 'to-uppercase',
          outputs: {},
          validationErrors: {}
        }
      },
      {
        id: 'reverse-1',
        type: 'function',
        position: { x: 300, y: 250 },
        data: {
          functionId: 'reverse-string',
          outputs: {},
          validationErrors: {}
        }
      },
      {
        id: 'viewer-upper',
        type: 'string-viewer',
        position: { x: 550, y: 150 },
        data: {
          value: undefined
        }
      },
      {
        id: 'viewer-reverse',
        type: 'string-viewer',
        position: { x: 550, y: 250 },
        data: {
          value: undefined
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'input-1',
        target: 'uppercase-1',
        sourceHandle: 'value',
        targetHandle: 'text'
      },
      {
        id: 'e2',
        source: 'input-1',
        target: 'reverse-1',
        sourceHandle: 'value',
        targetHandle: 'text'
      },
      {
        id: 'e3',
        source: 'uppercase-1',
        target: 'viewer-upper',
        sourceHandle: 'result',
        targetHandle: 'input'
      },
      {
        id: 'e4',
        source: 'reverse-1',
        target: 'viewer-reverse',
        sourceHandle: 'result',
        targetHandle: 'input'
      }
    ]
  },

  {
    id: 'crypto-pipeline',
    name: 'Crypto Pipeline',
    description: 'Encode, hash, and decode data through multiple steps',
    nodes: [
      {
        id: 'input-1',
        type: 'string-input',
        position: { x: 50, y: 200 },
        data: {
          value: 'Secret Message',
          onValueChange: () => {}
        }
      },
      {
        id: 'base64-1',
        type: 'function',
        position: { x: 300, y: 150 },
        data: {
          functionId: 'to-base64',
          outputs: {},
          validationErrors: {}
        }
      },
      {
        id: 'hash-1',
        type: 'function',
        position: { x: 300, y: 250 },
        data: {
          functionId: 'sha-256',
          outputs: {},
          validationErrors: {}
        }
      },
      {
        id: 'decode-1',
        type: 'function',
        position: { x: 550, y: 150 },
        data: {
          functionId: 'from-base64',
          outputs: {},
          validationErrors: {}
        }
      },
      {
        id: 'viewer-decoded',
        type: 'string-viewer',
        position: { x: 800, y: 150 },
        data: {
          value: undefined
        }
      },
      {
        id: 'viewer-hash',
        type: 'string-viewer',
        position: { x: 550, y: 250 },
        data: {
          value: undefined
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'input-1',
        target: 'base64-1',
        sourceHandle: 'value',
        targetHandle: 'text'
      },
      {
        id: 'e2',
        source: 'input-1',
        target: 'hash-1',
        sourceHandle: 'value',
        targetHandle: 'text'
      },
      {
        id: 'e3',
        source: 'base64-1',
        target: 'decode-1',
        sourceHandle: 'base64',
        targetHandle: 'base64'
      },
      {
        id: 'e4',
        source: 'decode-1',
        target: 'viewer-decoded',
        sourceHandle: 'text',
        targetHandle: 'input'
      },
      {
        id: 'e5',
        source: 'hash-1',
        target: 'viewer-hash',
        sourceHandle: 'hash',
        targetHandle: 'input'
      }
    ]
  },

  {
    id: 'number-operations',
    name: 'Number Operations',
    description: 'Work with numbers and boolean values',
    nodes: [
      {
        id: 'number-input-1',
        type: 'number-input',
        position: { x: 50, y: 150 },
        data: {
          value: 42,
          onValueChange: () => {}
        }
      },
      {
        id: 'number-input-2',
        type: 'number-input',
        position: { x: 50, y: 250 },
        data: {
          value: 3,
          onValueChange: () => {}
        }
      },
      {
        id: 'caesar-1',
        type: 'function',
        position: { x: 300, y: 200 },
        data: {
          functionId: 'caesar-cipher',
          outputs: {},
          validationErrors: {}
        }
      },
      {
        id: 'string-input-1',
        type: 'string-input',
        position: { x: 50, y: 350 },
        data: {
          value: 'HELLO',
          onValueChange: () => {}
        }
      },
      {
        id: 'viewer-1',
        type: 'string-viewer',
        position: { x: 550, y: 200 },
        data: {
          value: undefined
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'string-input-1',
        target: 'caesar-1',
        sourceHandle: 'value',
        targetHandle: 'text'
      },
      {
        id: 'e2',
        source: 'number-input-2',
        target: 'caesar-1',
        sourceHandle: 'value',
        targetHandle: 'shift'
      },
      {
        id: 'e3',
        source: 'caesar-1',
        target: 'viewer-1',
        sourceHandle: 'result',
        targetHandle: 'input'
      }
    ]
  }
];

// Helper to get example by ID
export function getExampleById(id: string): ExampleWorkflow | undefined {
  return exampleWorkflows.find(example => example.id === id);
}