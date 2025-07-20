import { atom } from 'nanostores'
import { Edge, Connection, applyNodeChanges, applyEdgeChanges, addEdge, XYPosition, OnNodesChange, OnEdgesChange, Node } from '@xyflow/react'
import { allFunctions, getFunctionById } from '@/lib/functions/index'
import { FunctionNode } from '@/components/nodes/FunctionNode'
import { StringInputNode, NumberInputNode, BooleanInputNode } from '@/components/nodes/InputNodes'
import { StringViewerNode, BinaryViewerNode, JsonViewerNode } from '@/components/nodes/ViewerNodes'
import { getExampleById } from '@/lib/examples'

type AppNode = FunctionNode | StringInputNode | NumberInputNode | BooleanInputNode | StringViewerNode | BinaryViewerNode | JsonViewerNode;

// Stores
export const $nodes = atom<AppNode[]>([])
export const $edges = atom<Edge[]>([])
export const $commandPaletteOpen = atom(false)

// Actions
export const updateNodes: OnNodesChange<AppNode> = (changes) => {
  $nodes.set(applyNodeChanges<AppNode>(changes, $nodes.get()))
}

export const updateEdges: OnEdgesChange = (changes) => {
  $edges.set(applyEdgeChanges(changes, $edges.get()))
}

export const connectEdge = (connection: Connection) => {
  $edges.set(addEdge(connection, $edges.get()))
}

export const deleteNode = (nodeId: string) => {
  // Remove the node
  $nodes.set($nodes.get().filter(node => node.id !== nodeId))
  
  // Remove all edges connected to this node
  $edges.set($edges.get().filter(edge => 
    edge.source !== nodeId && edge.target !== nodeId
  ))
}

export const addNode = (nodeType: string, position?: XYPosition) => {
  const baseId = `${nodeType}-${Date.now()}`;
  const defaultPosition = position || { x: 100, y: 100 };

  let newNode: AppNode;

  // Create different types of nodes
  switch (nodeType) {
    case 'string-input':
      newNode = {
        type: 'string-input',
        id: baseId,
        position: defaultPosition,
        data: {
          value: '',
          onValueChange: (value: string) => {
            $nodes.set(
              $nodes.get().map((node) =>
                node.id === baseId && node.type === 'string-input'
                  ? { ...node, data: { ...node.data, value } }
                  : node
              )
            )
          },
        },
      } as StringInputNode;
      break;

    case 'number-input':
      newNode = {
        type: 'number-input',
        id: baseId,
        position: defaultPosition,
        data: {
          value: 0,
          onValueChange: (value: number) => {
            $nodes.set(
              $nodes.get().map((node) =>
                node.id === baseId && node.type === 'number-input'
                  ? { ...node, data: { ...node.data, value } }
                  : node
              )
            )
          },
        },
      } as NumberInputNode;
      break;

    case 'boolean-input':
      newNode = {
        type: 'boolean-input',
        id: baseId,
        position: defaultPosition,
        data: {
          value: false,
          onValueChange: (value: boolean) => {
            $nodes.set(
              $nodes.get().map((node) =>
                node.id === baseId && node.type === 'boolean-input'
                  ? { ...node, data: { ...node.data, value } }
                  : node
              )
            )
          },
        },
      } as BooleanInputNode;
      break;

    case 'string-viewer':
      newNode = {
        type: 'string-viewer',
        id: baseId,
        position: defaultPosition,
        data: {
          value: undefined,
        },
      } as StringViewerNode;
      break;

    case 'binary-viewer':
      newNode = {
        type: 'binary-viewer',
        id: baseId,
        position: defaultPosition,
        data: {
          value: undefined,
        },
      } as BinaryViewerNode;
      break;

    case 'json-viewer':
      newNode = {
        type: 'json-viewer',
        id: baseId,
        position: defaultPosition,
        data: {
          value: undefined,
        },
      } as JsonViewerNode;
      break;

    default:
      // Assume it's a function node
      newNode = {
        type: 'function',
        id: baseId,
        position: defaultPosition,
        data: {
          functionId: nodeType,
          outputs: {},
          validationErrors: {},
        },
      } as FunctionNode;
      break;
  }

  $nodes.set([...$nodes.get(), newNode])
}

export const logExecutionGraph = () => {
  const nodes = $nodes.get()
  const edges = $edges.get()

  console.group('Execution Graph')
  console.log('Nodes:', nodes.map(n => ({
    id: n.id,
    type: n.type,
    functionId: n.data.functionId,
    inputs: n.data.inputs,
    outputs: n.data.outputs
  })))
  console.log('Edges:', edges)
  console.groupEnd()
}

export const executeGraph = async () => {
  const nodes = $nodes.get()
  const edges = $edges.get()

  // Sort nodes based on dependencies
  const sortedNodes: string[] = []
  const visited = new Set<string>()
  const temp = new Set<string>()

  const visit = (nodeId: string) => {
    if (temp.has(nodeId)) {
      console.warn('Cycle detected in graph at node:', nodeId)
      return
    }
    if (visited.has(nodeId)) return

    temp.add(nodeId)

    // Find all outgoing edges from this node
    const outgoingEdges = edges.filter((edge) => edge.source === nodeId)
    for (const edge of outgoingEdges) {
      visit(edge.target)
    }

    temp.delete(nodeId)
    visited.add(nodeId)
    sortedNodes.push(nodeId)
  }

  // Start DFS from each unvisited node
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      visit(node.id)
    }
  }

  // Execute nodes in topological order
  for (const nodeId of sortedNodes.reverse()) {
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) {
      console.warn('Node not found:', nodeId)
      continue
    }

    // Skip non-function nodes during execution
    if (node.type !== 'function') {
      continue
    }

    const fn = getFunctionById((node.data as any).functionId)
    if (!fn) {
      console.warn('Function not found:', (node.data as any).functionId)
      continue
    }

    // Get input values from connected nodes
    const inputs: Record<string, any> = {}
    const incomingEdges = edges.filter((edge) => edge.target === nodeId)
    
    for (const edge of incomingEdges) {
      const sourceNode = nodes.find((n) => n.id === edge.source)
      if (!sourceNode) continue
      
      const sourceHandle = edge.sourceHandle
      const targetHandle = edge.targetHandle
      
      if (!sourceHandle || !targetHandle) continue
      
      let sourceValue;
      
      // Get value based on source node type
      if (sourceNode.type === 'string-input' || sourceNode.type === 'number-input' || sourceNode.type === 'boolean-input') {
        sourceValue = (sourceNode.data as any).value;
      } else if (sourceNode.type === 'function') {
        sourceValue = (sourceNode.data as any).outputs?.[sourceHandle];
      }
      
      if (sourceValue !== undefined) {
        inputs[targetHandle] = sourceValue;
      }
    }

    console.log(`Executing function "${fn.name}" (${nodeId})`, {
      inputs,
      inputFields: fn.getInputFields()
    })

    // Use the new validation system
    const result = await fn.executeWithValidation(inputs)

    if (result.success) {
      // Update the node's outputs
      $nodes.set(
        nodes.map((n) =>
          n.id === nodeId
            ? {
              ...n,
              data: {
                ...n.data,
                outputs: result.data,
                validationErrors: {}, // Clear any previous errors
              },
            }
            : n
        )
      )

      console.log(`Function "${fn.name}" completed:`, { result: result.data })
    } else {
      // Handle validation or execution errors
      console.error(`Error executing function "${fn.name}":`, result.error)
      
      // Update node with error information
      const validationErrors: Record<string, string> = {}
      
      if (result.code === 'VALIDATION_ERROR' && result.details) {
        // Extract field-level errors from Zod validation
        const details = result.details as any
        if (details.fieldErrors) {
          Object.entries(details.fieldErrors).forEach(([field, errors]) => {
            validationErrors[field] = Array.isArray(errors) ? errors[0] : String(errors)
          })
        }
      } else {
        // General error - show on the node
        validationErrors['_general'] = result.error
      }

      $nodes.set(
        nodes.map((n) =>
          n.id === nodeId
            ? {
              ...n,
              data: {
                ...n.data,
                validationErrors,
                outputs: {}, // Clear outputs on error
              },
            }
            : n
        )
      )
    }
  }

  // Update viewer nodes with data from connected function outputs
  const updatedNodes = $nodes.get()
  const viewerUpdates: AppNode[] = []

  for (const node of updatedNodes) {
    if (node.type === 'string-viewer' || node.type === 'binary-viewer' || node.type === 'json-viewer') {
      const incomingEdge = edges.find((edge) => edge.target === node.id)
      
      if (incomingEdge) {
        const sourceNode = updatedNodes.find((n) => n.id === incomingEdge.source)
        
        if (sourceNode && sourceNode.type === 'function') {
          const sourceHandle = incomingEdge.sourceHandle
          const outputValue = (sourceNode.data as any).outputs?.[sourceHandle]
          
          if (outputValue !== undefined) {
            viewerUpdates.push({
              ...node,
              data: {
                ...node.data,
                value: outputValue,
              },
            })
          }
        } else if (sourceNode && (sourceNode.type === 'string-input' || sourceNode.type === 'number-input' || sourceNode.type === 'boolean-input')) {
          const inputValue = (sourceNode.data as any).value
          
          if (inputValue !== undefined) {
            viewerUpdates.push({
              ...node,
              data: {
                ...node.data,
                value: inputValue,
              },
            })
          }
        }
      }
    }
  }

  // Apply viewer updates
  if (viewerUpdates.length > 0) {
    $nodes.set(
      updatedNodes.map((node) => {
        const update = viewerUpdates.find((u) => u.id === node.id)
        return update || node
      })
    )
  }

  // Log final state
  logExecutionGraph()
}

export const loadExample = (exampleId: string) => {
  const example = getExampleById(exampleId)
  if (!example) {
    console.warn('Example not found:', exampleId)
    return
  }

  // Clear current graph
  $nodes.set([])
  $edges.set([])

  // Create nodes with proper handlers
  const newNodes: AppNode[] = example.nodes.map((nodeData) => {
    const nodeId = nodeData.id
    
    // Create the appropriate node based on type
    switch (nodeData.type) {
      case 'string-input':
        return {
          ...nodeData,
          data: {
            ...nodeData.data,
            onValueChange: (value: string) => {
              $nodes.set(
                $nodes.get().map((node) =>
                  node.id === nodeId && node.type === 'string-input'
                    ? { ...node, data: { ...node.data, value } }
                    : node
                )
              )
            },
          },
        } as StringInputNode

      case 'number-input':
        return {
          ...nodeData,
          data: {
            ...nodeData.data,
            onValueChange: (value: number) => {
              $nodes.set(
                $nodes.get().map((node) =>
                  node.id === nodeId && node.type === 'number-input'
                    ? { ...node, data: { ...node.data, value } }
                    : node
                )
              )
            },
          },
        } as NumberInputNode

      case 'boolean-input':
        return {
          ...nodeData,
          data: {
            ...nodeData.data,
            onValueChange: (value: boolean) => {
              $nodes.set(
                $nodes.get().map((node) =>
                  node.id === nodeId && node.type === 'boolean-input'
                    ? { ...node, data: { ...node.data, value } }
                    : node
                )
              )
            },
          },
        } as BooleanInputNode

      default:
        return nodeData as AppNode
    }
  })

  // Set nodes and edges
  $nodes.set(newNodes)
  $edges.set(example.edges)

  console.log(`Loaded example: ${example.name}`)
}

// Computed values
export const $sortedFunctionsByCategory = atom(
  Object.groupBy(allFunctions, (func) => func.category)
)

// Simple store object for access
export const graphStore = {
  loadExample,
  addNode,
  executeGraph,
  deleteNode
}
