"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import ReactFlow, { Background, Controls, useNodesState, useEdgesState, Panel } from "reactflow"
import "reactflow/dist/style.css"

export default function CompactAIDiagram() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only render the component after it's mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine if we're in dark mode
  const isDarkMode = mounted && resolvedTheme === "dark"

  // Define colors based on theme - Vercel-inspired aesthetic
  const colors = {
    // Vercel uses a monochromatic palette with strategic accent colors
    // Light mode: Clean whites and grays with vibrant accents
    // Dark mode: True blacks and dark grays with bright accents
    userInterface: isDarkMode ? "#0070F3" : "#0070F3", // Vercel blue
    aiPipeline: isDarkMode ? "#7928CA" : "#7928CA", // Purple
    dataSources: isDarkMode ? "#FF4D4D" : "#FF4D4D", // Red
    security: isDarkMode ? "#50E3C2" : "#50E3C2", // Teal
    nodeBorder: isDarkMode ? "#333333" : "#EAEAEA",
    nodeBg: isDarkMode ? "#111111" : "#FFFFFF",
    nodeText: isDarkMode ? "#FFFFFF" : "#000000",
    primaryEdge: isDarkMode ? "#888888" : "#666666",
    secondaryEdge: isDarkMode ? "#666666" : "#888888",
    tertiaryEdge: isDarkMode ? "#444444" : "#AAAAAA",
    edgeText: isDarkMode ? "#FFFFFF" : "#000000",
    edgeLabelBg: isDarkMode ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)",
    background: isDarkMode ? "#000000" : "#FAFAFA",
    panelBg: isDarkMode ? "#111111" : "#FFFFFF",
    panelBorder: isDarkMode ? "#333333" : "#EAEAEA",
  }

  // Define node style with fixed border properties
  const getNodeStyle = (accentColor) => ({
    background: colors.nodeBg,
    color: colors.nodeText,
    padding: "8px",
    borderRadius: "4px",
    // Fix: Replace shorthand border with individual properties
    borderTop: `1px solid ${colors.nodeBorder}`,
    borderRight: `1px solid ${colors.nodeBorder}`,
    borderBottom: `1px solid ${colors.nodeBorder}`,
    borderLeft: `3px solid ${accentColor}`,
    fontSize: "12px",
    fontWeight: "500",
    width: "100px",
    boxShadow: isDarkMode ? "none" : "0 2px 4px rgba(0,0,0,0.05)",
  })

  // Define nodes with Vercel-inspired styling
  const initialNodes = [
    // User Interface nodes - top row
    {
      id: "user",
      position: { x: 50, y: 50 },
      data: { label: "User" },
      style: getNodeStyle(colors.userInterface),
    },
    {
      id: "chatInterface",
      position: { x: 200, y: 50 },
      data: { label: "Chat Interface" },
      style: getNodeStyle(colors.userInterface),
    },

    // AI Pipeline nodes - middle row
    {
      id: "intentDetection",
      position: { x: 50, y: 130 },
      data: { label: "Intent Detection" },
      style: getNodeStyle(colors.aiPipeline),
    },
    {
      id: "contextualEngine",
      position: { x: 200, y: 130 },
      data: { label: "Contextual Engine" },
      style: getNodeStyle(colors.aiPipeline),
    },
    {
      id: "llm",
      position: { x: 350, y: 130 },
      data: { label: "LLM (GPT-4o)" },
      style: getNodeStyle(colors.aiPipeline),
    },
    {
      id: "responseFormatting",
      position: { x: 500, y: 130 },
      data: { label: "Response Formatting" },
      style: {
        ...getNodeStyle(colors.aiPipeline),
        width: "120px",
      },
    },

    // Data Sources nodes - bottom left
    {
      id: "projectData",
      position: { x: 50, y: 210 },
      data: { label: "Project Data" },
      style: getNodeStyle(colors.dataSources),
    },
    {
      id: "knowledgeBase",
      position: { x: 200, y: 210 },
      data: { label: "Knowledge Base" },
      style: getNodeStyle(colors.dataSources),
    },
    {
      id: "userProfile",
      position: { x: 350, y: 210 },
      data: { label: "User Profile" },
      style: getNodeStyle(colors.dataSources),
    },

    // Security nodes - bottom right
    {
      id: "authentication",
      position: { x: 200, y: 290 },
      data: { label: "Authentication" },
      style: getNodeStyle(colors.security),
    },
    {
      id: "authorization",
      position: { x: 350, y: 290 },
      data: { label: "Authorization" },
      style: getNodeStyle(colors.security),
    },
    {
      id: "dataEncryption",
      position: { x: 500, y: 290 },
      data: { label: "Data Encryption" },
      style: {
        ...getNodeStyle(colors.security),
        width: "120px",
      },
    },
  ]

  // Custom edge label style with Vercel-inspired styling
  const createEdgeLabelStyle = (color) => ({
    fill: color,
    fontSize: 10,
    fontWeight: 500,
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, sans-serif",
    paintOrder: "stroke",
    stroke: colors.edgeLabelBg,
    strokeWidth: 4,
    strokeLinecap: "butt",
    strokeLinejoin: "round",
  })

  // Define edges with Vercel-inspired styling
  const initialEdges = [
    // User Interface connections
    {
      id: "e-user-chat",
      source: "user",
      target: "chatInterface",
      label: "Interacts",
      style: { stroke: colors.primaryEdge, strokeWidth: 1.5 },
      labelStyle: createEdgeLabelStyle(colors.edgeText),
      labelBgStyle: { fill: colors.edgeLabelBg },
      labelBgPadding: [4, 2],
      labelBgBorderRadius: 2,
      animated: true,
    },

    // AI Pipeline connections
    {
      id: "e-chat-intent",
      source: "chatInterface",
      target: "intentDetection",
      label: "Intent",
      style: { stroke: colors.primaryEdge, strokeWidth: 1.5 },
      labelStyle: createEdgeLabelStyle(colors.edgeText),
      labelBgStyle: { fill: colors.edgeLabelBg },
      labelBgPadding: [4, 2],
      labelBgBorderRadius: 2,
      animated: true,
    },
    {
      id: "e-intent-context",
      source: "intentDetection",
      target: "contextualEngine",
      label: "Context",
      style: { stroke: colors.primaryEdge, strokeWidth: 1.5 },
      labelStyle: createEdgeLabelStyle(colors.edgeText),
      labelBgStyle: { fill: colors.edgeLabelBg },
      labelBgPadding: [4, 2],
      labelBgBorderRadius: 2,
      animated: true,
    },
    {
      id: "e-context-llm",
      source: "contextualEngine",
      target: "llm",
      label: "Request",
      style: { stroke: colors.primaryEdge, strokeWidth: 1.5 },
      labelStyle: createEdgeLabelStyle(colors.edgeText),
      labelBgStyle: { fill: colors.edgeLabelBg },
      labelBgPadding: [4, 2],
      labelBgBorderRadius: 2,
      animated: true,
    },
    {
      id: "e-llm-response",
      source: "llm",
      target: "responseFormatting",
      label: "Response",
      style: { stroke: colors.primaryEdge, strokeWidth: 1.5 },
      labelStyle: createEdgeLabelStyle(colors.edgeText),
      labelBgStyle: { fill: colors.edgeLabelBg },
      labelBgPadding: [4, 2],
      labelBgBorderRadius: 2,
      animated: true,
    },

    // Data Sources connections
    {
      id: "e-intent-project",
      source: "intentDetection",
      target: "projectData",
      label: "Project Data",
      style: { stroke: colors.secondaryEdge, strokeWidth: 1.5 },
      labelStyle: createEdgeLabelStyle(colors.edgeText),
      labelBgStyle: { fill: colors.edgeLabelBg },
      labelBgPadding: [4, 2],
      labelBgBorderRadius: 2,
    },
    {
      id: "e-intent-knowledge",
      source: "intentDetection",
      target: "knowledgeBase",
      label: "Knowledge",
      style: { stroke: colors.secondaryEdge, strokeWidth: 1.5 },
      labelStyle: createEdgeLabelStyle(colors.edgeText),
      labelBgStyle: { fill: colors.edgeLabelBg },
      labelBgPadding: [4, 2],
      labelBgBorderRadius: 2,
    },
    {
      id: "e-intent-user",
      source: "intentDetection",
      target: "userProfile",
      label: "User Info",
      style: { stroke: colors.secondaryEdge, strokeWidth: 1.5 },
      labelStyle: createEdgeLabelStyle(colors.edgeText),
      labelBgStyle: { fill: colors.edgeLabelBg },
      labelBgPadding: [4, 2],
      labelBgBorderRadius: 2,
    },

    // Security connections
    {
      id: "e-chat-auth",
      source: "chatInterface",
      target: "authentication",
      label: "Auth",
      style: { stroke: colors.secondaryEdge, strokeWidth: 1.5 },
      labelStyle: createEdgeLabelStyle(colors.edgeText),
      labelBgStyle: { fill: colors.edgeLabelBg },
      labelBgPadding: [4, 2],
      labelBgBorderRadius: 2,
    },
    {
      id: "e-llm-authz",
      source: "llm",
      target: "authorization",
      label: "Permissions",
      style: { stroke: colors.secondaryEdge, strokeWidth: 1.5 },
      labelStyle: createEdgeLabelStyle(colors.edgeText),
      labelBgStyle: { fill: colors.edgeLabelBg },
      labelBgPadding: [4, 2],
      labelBgBorderRadius: 2,
    },
    {
      id: "e-response-encrypt",
      source: "responseFormatting",
      target: "dataEncryption",
      label: "Encrypt",
      style: { stroke: colors.secondaryEdge, strokeWidth: 1.5 },
      labelStyle: createEdgeLabelStyle(colors.edgeText),
      labelBgStyle: { fill: colors.edgeLabelBg },
      labelBgPadding: [4, 2],
      labelBgBorderRadius: 2,
    },

    // Additional connections
    {
      id: "e-context-project",
      source: "contextualEngine",
      target: "projectData",
      label: "Uses",
      style: { stroke: colors.tertiaryEdge, strokeWidth: 1.5, strokeDasharray: "3,3" },
      labelStyle: createEdgeLabelStyle(colors.edgeText),
      labelBgStyle: { fill: colors.edgeLabelBg },
      labelBgPadding: [4, 2],
      labelBgBorderRadius: 2,
    },
    {
      id: "e-context-knowledge",
      source: "contextualEngine",
      target: "knowledgeBase",
      label: "Uses",
      style: { stroke: colors.tertiaryEdge, strokeWidth: 1.5, strokeDasharray: "3,3" },
      labelStyle: createEdgeLabelStyle(colors.edgeText),
      labelBgStyle: { fill: colors.edgeLabelBg },
      labelBgPadding: [4, 2],
      labelBgBorderRadius: 2,
    },
    {
      id: "e-context-user",
      source: "contextualEngine",
      target: "userProfile",
      label: "Uses",
      style: { stroke: colors.tertiaryEdge, strokeWidth: 1.5, strokeDasharray: "3,3" },
      labelStyle: createEdgeLabelStyle(colors.edgeText),
      labelBgStyle: { fill: colors.edgeLabelBg },
      labelBgPadding: [4, 2],
      labelBgBorderRadius: 2,
    },
  ]

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges as any)

  // Define node groups for the legend with Vercel-inspired styling
  const nodeGroups = [
    { name: "User Interface", color: colors.userInterface },
    { name: "AI Pipeline", color: colors.aiPipeline },
    { name: "Data Sources", color: colors.dataSources },
    { name: "Security", color: colors.security },
  ]

  // Force re-render when theme changes
  useEffect(() => {
    if (mounted) {
      setNodes([...initialNodes])
      setEdges([...initialEdges as any])
    }
  }, [isDarkMode, mounted])

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) return null

  return (
    <div className="w-full h-[400px] border rounded-lg bg-white dark:bg-black">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        attributionPosition="bottom-right"
        defaultEdgeOptions={{
          type: "default",
          style: { strokeWidth: 1.5 },
        }}
      >
        <Background color={colors.background} gap={12} size={1} />
        <Controls
          showInteractive={false}
          position="bottom-right"
          style={{
            background: colors.panelBg,
            borderTop: `1px solid ${colors.panelBorder}`,
            borderRight: `1px solid ${colors.panelBorder}`,
            borderBottom: `1px solid ${colors.panelBorder}`,
            borderLeft: `1px solid ${colors.panelBorder}`,
            borderRadius: "4px",
          }}
        />

        {/* Compact Legend with Vercel styling */}
        <Panel
          position="top-right"
          className="p-2 rounded text-xs"
          style={{
            background: colors.panelBg,
            borderTop: `1px solid ${colors.panelBorder}`,
            borderRight: `1px solid ${colors.panelBorder}`,
            borderBottom: `1px solid ${colors.panelBorder}`,
            borderLeft: `1px solid ${colors.panelBorder}`,
            borderRadius: "4px",
          }}
        >
          <div className="flex flex-wrap gap-2">
            {nodeGroups.map((group) => (
              <div key={group.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: group.color }}></div>
                <span
                  className="text-[10px]"
                  style={{
                    color: colors.nodeText,
                    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, sans-serif",
                  }}
                >
                  {group.name}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}
