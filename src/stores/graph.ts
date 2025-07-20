import { atom } from 'nanostores'
import { Edge, Connection, applyNodeChanges, applyEdgeChanges, addEdge, XYPosition, OnNodesChange, OnEdgesChange } from '@xyflow/react'
import { functions } from '@/lib/functions'
import { FunctionNode } from '@/components/nodes/FunctionNode'

// Stores
export const $nodes = atom<FunctionNode[]>([])
export const $edges = atom<Edge[]>([])
export const $commandPaletteOpen = atom(false)

// Actions
export const updateNodes: OnNodesChange<FunctionNode> = (changes) => {
  $nodes.set(applyNodeChanges<FunctionNode>(changes, $nodes.get()))
}

export const updateEdges: OnEdgesChange = (changes) => {
  $edges.set(applyEdgeChanges(changes, $edges.get()))
}

export const connectEdge = (connection: Connection) => {
  $edges.set(addEdge(connection, $edges.get()))
}

export const addNode = (functionId: string, position?: XYPosition) => {
  const newNode: FunctionNode = {
    type: 'function',
    id: `${functionId}-${$nodes.get().length}`,
    position: position || { x: 100, y: 100 },
    data: {
      functionId: functionId,
      inputs: {},
      outputs: {},
      onInputChange: (inputId: string, value: string) => {
        $nodes.set(
          $nodes.get().map((node) =>
            node.id === newNode.id
              ? {
                ...node,
                data: {
                  ...node.data,
                  inputs: {
                    ...node.data.inputs,
                    [inputId]: value,
                  },
                },
              }
              : node
          )
        )
      },
    },
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

    const fn = functions.find((f) => f.id === node.data.functionId)
    if (!fn) {
      console.warn('Function not found:', node.data.functionId)
      continue
    }

    // Get input values from connected nodes and node's own inputs
    const inputs: Record<string, any> = { ...node.data.inputs }
    const incomingEdges = edges.filter((edge) => edge.target === nodeId)
    
    for (const edge of incomingEdges) {
      const sourceNode = nodes.find((n) => n.id === edge.source)
      if (!sourceNode?.data.outputs) continue
      
      // Use the source node's output as input for the target handle
      const sourceOutput = sourceNode.data.outputs.output
      if (sourceOutput !== undefined) {
        const targetHandle = edge.targetHandle || fn.inputs[0]?.id || 'input'
        inputs[targetHandle] = sourceOutput
      }
    }

    console.log(`Executing function "${fn.name}" (${nodeId})`, {
      inputs,
      inputDefinitions: fn.inputs
    })

    try {
      const result = await fn.execute(inputs)

      // Update the node's outputs
      $nodes.set(
        nodes.map((n) =>
          n.id === nodeId
            ? {
              ...n,
              data: {
                ...n.data,
                outputs: {
                  output: result,
                },
              },
            }
            : n
        )
      )

      console.log(`Function "${fn.name}" completed:`, { result })
    } catch (error) {
      console.error(`Error executing function "${fn.name}":`, error)
    }
  }

  // Log final state
  logExecutionGraph()
}

// Computed values
export const $sortedFunctionsByCategory = atom(
  Object.groupBy(Object.entries(functions), (entry) => entry[1].category)
)
