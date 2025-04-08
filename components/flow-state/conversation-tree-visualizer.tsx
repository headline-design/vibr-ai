"use client"

import { useState } from "react"
import { conversationNodes, ProximityCategory } from "./conversation-nodes"
import { useMetaSession } from "./meta-session-provider"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Zap, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ConversationTreeVisualizerProps {
  className?: string
}

export function ConversationTreeVisualizer({ className }: ConversationTreeVisualizerProps) {
  const { metaSession } = useMetaSession()
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({})
  const [filter, setFilter] = useState<"all" | "high" | "low">("all")

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Helper to determine if a category is high proximity
  const isHighProximity = (category?: ProximityCategory) => {
    if (!category) return false
    return (
      category === ProximityCategory.APP_SPECIFIC ||
      category === ProximityCategory.USER_SPECIFIC ||
      category === ProximityCategory.SESSION_SPECIFIC ||
      category === ProximityCategory.INTERACTION_SPECIFIC
    )
  }

  // Filter nodes based on proximity
  const filteredNodes = conversationNodes.filter((node) => {
    if (filter === "all") return true
    if (filter === "high") return isHighProximity(node.category)
    if (filter === "low") return !isHighProximity(node.category)
    return true
  })

  const renderNode = (node: any, depth = 0) => {
    const isExpanded = expandedNodes[node.id] || false
    const hasChildren = node.children && node.children.length > 0
    const highProximity = isHighProximity(node.category)

    // Evaluate if node conditions match current meta session
    const conditionsMatch =
      !node.conditions ||
      node.conditions.every((condition: any) => {
        const { key, operator, value } = condition
        const sessionValue = metaSession[key]

        switch (operator) {
          case "equals":
            return sessionValue === value
          case "contains":
            return Array.isArray(sessionValue) && sessionValue.includes(value)
          case "greaterThan":
            return sessionValue > value
          case "lessThan":
            return sessionValue < value
          default:
            return false
        }
      })

    return (
      <div key={node.id} className="mb-1">
        <div
          className={`flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            conditionsMatch ? "border-l-4 border-green-500" : "border-l-4 border-gray-300"
          }`}
          style={{ marginLeft: `${depth * 20}px` }}
        >
          {hasChildren && (
            <Button variant="ghost" size="icon" className="h-5 w-5 mr-1" onClick={() => toggleNode(node.id)}>
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </Button>
          )}
          <div className="flex-1">
            <div className="font-medium flex items-center">
              {node.id}
              {highProximity ? (
                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                  <Zap className="h-3 w-3 mr-1" />
                  Client
                </Badge>
              ) : (
                <Badge variant="outline" className="ml-2 bg-purple-50 text-purple-700 border-purple-200">
                  <Globe className="h-3 w-3 mr-1" />
                  LLM
                </Badge>
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {node.category || "Uncategorized"}
              {node.conditions && node.conditions.length > 0 && " • Has conditions"}
            </div>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="ml-4">{node.children.map((child: any) => renderNode(child, depth + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All
          </Button>
          <Button variant={filter === "high" ? "default" : "outline"} size="sm" onClick={() => setFilter("high")}>
            <Zap className="h-3.5 w-3.5 mr-1.5" />
            High Proximity
          </Button>
          <Button variant={filter === "low" ? "default" : "outline"} size="sm" onClick={() => setFilter("low")}>
            <Globe className="h-3.5 w-3.5 mr-1.5" />
            Low Proximity
          </Button>
        </div>
      </div>
      <div className="border rounded p-2 bg-white dark:bg-gray-900 overflow-auto max-h-96">
        {filteredNodes.map((node) => renderNode(node))}
      </div>
    </div>
  )
}
