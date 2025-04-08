"use client"

import { useState, useEffect } from "react"
import { Activity, Cpu, Clock, BarChart2, Zap, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface PerformanceMetrics {
  responseTime: number // in ms
  tokenCount: number
  memoryUsage: number // in MB
  cpuUsage: number // percentage
  requestsPerMinute: number
}

interface PerformanceMonitorProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function PerformanceMonitor({ isOpen, onClose, className }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    responseTime: 0,
    tokenCount: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    requestsPerMinute: 0,
  })

  const [history, setHistory] = useState<PerformanceMetrics[]>([])

  // Simulate metrics collection
  useEffect(() => {
    if (!isOpen) return

    // Initial metrics
    setMetrics({
      responseTime: Math.floor(Math.random() * 500) + 200, // 200-700ms
      tokenCount: Math.floor(Math.random() * 1000) + 500, // 500-1500 tokens
      memoryUsage: Math.floor(Math.random() * 100) + 50, // 50-150MB
      cpuUsage: Math.floor(Math.random() * 30) + 10, // 10-40%
      requestsPerMinute: Math.floor(Math.random() * 10) + 1, // 1-10 requests/min
    })

    // Generate historical data
    const historicalData: PerformanceMetrics[] = []
    for (let i = 0; i < 20; i++) {
      historicalData.push({
        responseTime: Math.floor(Math.random() * 500) + 200,
        tokenCount: Math.floor(Math.random() * 1000) + 500,
        memoryUsage: Math.floor(Math.random() * 100) + 50,
        cpuUsage: Math.floor(Math.random() * 30) + 10,
        requestsPerMinute: Math.floor(Math.random() * 10) + 1,
      })
    }
    setHistory(historicalData)

    // Update metrics periodically
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        responseTime: Math.max(100, prev.responseTime + (Math.random() * 100 - 50)),
        tokenCount: Math.max(100, prev.tokenCount + (Math.random() * 200 - 100)),
        memoryUsage: Math.max(10, prev.memoryUsage + (Math.random() * 20 - 10)),
        cpuUsage: Math.min(100, Math.max(1, prev.cpuUsage + (Math.random() * 10 - 5))),
        requestsPerMinute: Math.max(1, prev.requestsPerMinute + (Math.random() * 2 - 1)),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [isOpen])

  // Get status color based on value
  const getStatusColor = (value: number, thresholds: [number, number]) => {
    const [warning, critical] = thresholds
    if (value >= critical) return "text-red-500 dark:text-red-400"
    if (value >= warning) return "text-yellow-500 dark:text-yellow-400"
    return "text-green-500 dark:text-green-400"
  }

  // Get progress color based on value
  const getProgressColor = (value: number, thresholds: [number, number]) => {
    const [warning, critical] = thresholds
    if (value >= critical) return "bg-red-500 dark:bg-red-400"
    if (value >= warning) return "bg-yellow-500 dark:bg-yellow-400"
    return "bg-green-500 dark:bg-green-400"
  }

  // Render a simple bar chart
  const renderBarChart = (data: number[], max: number, label: string) => {
    return (
      <div className="h-32">
        <div className="flex h-full items-end space-x-1">
          {data.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 dark:bg-blue-600 rounded-t"
                style={{ height: `${(value / max) * 100}%` }}
              />
              {index % 5 === 0 && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{index + 1}</div>}
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">{label}</div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={cn(
            "fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-40",
            className,
          )}
        >
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-2" />
              <h3 className="text-sm font-medium">Performance Monitor</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={onClose}
              aria-label="Close performance monitor"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Tabs defaultValue="metrics">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="metrics" className="text-xs">
                <Zap className="h-3.5 w-3.5 mr-1.5" />
                Real-time Metrics
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs">
                <BarChart2 className="h-3.5 w-3.5 mr-1.5" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="p-3 space-y-4">
              {/* Response Time */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                    <span>Response Time</span>
                  </div>
                  <div className={cn("text-sm font-medium", getStatusColor(metrics.responseTime, [400, 600]))}>
                    {metrics.responseTime.toFixed(0)} ms
                  </div>
                </div>
                <Progress
                  value={(metrics.responseTime / 1000) * 100}
                  className="h-1.5"
                  indicatorClassName={getProgressColor(metrics.responseTime, [400, 600])}
                />
              </div>

              {/* Token Count */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <svg
                      className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v20M2 12h20" />
                    </svg>
                    <span>Token Count</span>
                  </div>
                  <div className={cn("text-sm font-medium", getStatusColor(metrics.tokenCount, [800, 1200]))}>
                    {metrics.tokenCount.toFixed(0)}
                  </div>
                </div>
                <Progress
                  value={(metrics.tokenCount / 2000) * 100}
                  className="h-1.5"
                  indicatorClassName={getProgressColor(metrics.tokenCount, [800, 1200])}
                />
              </div>

              {/* Memory Usage */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <svg
                      className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <path d="M1 10h22" />
                    </svg>
                    <span>Memory Usage</span>
                  </div>
                  <div className={cn("text-sm font-medium", getStatusColor(metrics.memoryUsage, [100, 150]))}>
                    {metrics.memoryUsage.toFixed(0)} MB
                  </div>
                </div>
                <Progress
                  value={(metrics.memoryUsage / 200) * 100}
                  className="h-1.5"
                  indicatorClassName={getProgressColor(metrics.memoryUsage, [100, 150])}
                />
              </div>

              {/* CPU Usage */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Cpu className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                    <span>CPU Usage</span>
                  </div>
                  <div className={cn("text-sm font-medium", getStatusColor(metrics.cpuUsage, [30, 50]))}>
                    {metrics.cpuUsage.toFixed(0)}%
                  </div>
                </div>
                <Progress
                  value={metrics.cpuUsage}
                  className="h-1.5"
                  indicatorClassName={getProgressColor(metrics.cpuUsage, [30, 50])}
                />
              </div>

              {/* Requests Per Minute */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <svg
                      className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                      <path d="M9 12h6" />
                      <path d="M12 9v6" />
                    </svg>
                    <span>Requests/Min</span>
                  </div>
                  <div className={cn("text-sm font-medium", getStatusColor(metrics.requestsPerMinute, [5, 8]))}>
                    {metrics.requestsPerMinute.toFixed(1)}
                  </div>
                </div>
                <Progress
                  value={(metrics.requestsPerMinute / 10) * 100}
                  className="h-1.5"
                  indicatorClassName={getProgressColor(metrics.requestsPerMinute, [5, 8])}
                />
              </div>
            </TabsContent>

            <TabsContent value="history" className="p-3 space-y-4">
              {/* Response Time History */}
              <div>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Response Time (ms)</h4>
                {renderBarChart(
                  history.map((h) => h.responseTime),
                  1000,
                  "Last 20 requests",
                )}
              </div>

              {/* Token Count History */}
              <div>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Token Count</h4>
                {renderBarChart(
                  history.map((h) => h.tokenCount),
                  2000,
                  "Last 20 requests",
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
