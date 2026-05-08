'use client'

import { useCallback, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useFlowzStore, workflowToReactFlow } from '@/lib/store'
import { StepNode } from './nodes/StepNode'
import { AnimatedEdge } from './edges/AnimatedEdge'

const nodeTypes = { stepNode: StepNode }
const edgeTypes = { animatedEdge: AnimatedEdge }

export function FlowCanvas() {
  const activeWorkflow = useFlowzStore((s) => s.activeWorkflow())
  const updateStep = useFlowzStore((s) => s.updateStep)
  const selectNode = useFlowzStore((s) => s.selectNode)

  const { nodes: initial, edges: initialEdges } = activeWorkflow
    ? workflowToReactFlow(activeWorkflow)
    : { nodes: [], edges: [] }

  const [nodes, setNodes, onNodesChange] = useNodesState(initial)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    if (!activeWorkflow) return
    const { nodes: n, edges: e } = workflowToReactFlow(activeWorkflow)
    setNodes(n)
    setEdges(e)
  }, [activeWorkflow, setNodes, setEdges])

  const onConnect = useCallback(
    (c: Connection) => setEdges((eds) => addEdge({ ...c, type: 'animatedEdge' }, eds)),
    [setEdges]
  )

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === 'stepNode') updateStep(node.id, { position: node.position })
    },
    [updateStep]
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === 'stepNode') selectNode(node.id)
    },
    [selectNode]
  )

  const onPaneClick = useCallback(() => selectNode(null), [selectNode])

  if (!activeWorkflow) {
    return (
      <div className="flex-1 flex items-center justify-center bg-ink-950 text-slate-600 text-sm">
        Select or create a workflow to get started
      </div>
    )
  }

  return (
    <div className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{ type: 'animatedEdge' }}
        style={{ background: '#08090D' }}
      >
        <Background variant={BackgroundVariant.Dots} gap={32} size={1} color="#2A2F3D" />
        <Controls style={{ bottom: 16, left: 16, top: 'auto' }} />
        <MiniMap
          nodeColor={() => '#7C5CFF'}
          maskColor="rgba(8,9,13,0.7)"
          style={{ bottom: 16, right: 16 }}
        />
      </ReactFlow>
    </div>
  )
}
