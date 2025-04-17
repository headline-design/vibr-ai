"use client"

import { useState, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  LineChart,
  PieChart,
  Download,
  Maximize2,
  Minimize2,
  RefreshCw,
  TableIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface DataPoint {
  label: string
  value: number
  color?: string
}

interface TableData {
  headers: string[]
  rows: string[][]
}

interface DataVisualizationProps {
  data: DataPoint[] | TableData
  type: "bar" | "line" | "pie" | "table"
  title?: string
  description?: string
  className?: string
}

export function DataVisualization({
  data,
  type,
  title = "Data Visualization",
  description,
  className,
}: DataVisualizationProps) {
  const [activeTab, setActiveTab] = useState<string>(type)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // For pagination in table view
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // Determine if data is table data
  const isTableData = (data: any): data is TableData => {
    return "headers" in data && "rows" in data
  }

  // Get chart data
  const chartData = !isTableData(data) ? data : []

  // Get table data
  const tableData = isTableData(data)
    ? data
    : {
        headers: ["Label", "Value"],
        rows: (data as DataPoint[]).map((d) => [d.label, d.value.toString()]),
      }

  // Calculate max value for scaling
  const maxValue = !isTableData(data) ? Math.max(...data.map((d) => d.value)) : 0

  // Default colors if not provided
  const defaultColors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#f97316",
    "#6366f1",
    "#84cc16",
  ]

  // Ensure all data points have colors
  const dataWithColors = !isTableData(data)
    ? data.map((d, i) => ({ ...d, color: d.color || defaultColors[i % defaultColors.length] }))
    : []

  // Refresh data (simulate loading)
  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // Download data as CSV
  const downloadCSV = () => {
    let csv: string

    if (isTableData(data)) {
      // Convert table data to CSV
      csv = [data.headers.join(","), ...data.rows.map((row) => row.join(","))].join("\n")
    } else {
      // Convert chart data to CSV
      csv = ["Label,Value", ...data.map((d) => `${d.label},${d.value}`)].join("\n")
    }

    // Create download link
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Calculate pagination for table
  const totalPages = Math.ceil(tableData.rows.length / rowsPerPage)
  const paginatedRows = tableData.rows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  // Render bar chart
  const renderBarChart = () => (
    <div className="h-64 flex items-end justify-around p-4">
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />
        </div>
      ) : (
        dataWithColors.map((d, i) => (
          <div key={i} className="flex flex-col items-center">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.value / maxValue) * 100}%` }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="w-12 rounded-t"
              style={{ backgroundColor: d.color }}
            />
            <div className="mt-2 text-xs text-center w-16 truncate" title={d.label}>
              {d.label}
            </div>
          </div>
        ))
      )}
    </div>
  )

  // Render line chart
  const renderLineChart = () => (
    <div className="h-64 p-4">
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />
        </div>
      ) : (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="0" x2="0" y2="100" stroke="#e5e7eb" strokeWidth="0.5" />
          <line x1="0" y1="100" x2="100" y2="100" stroke="#e5e7eb" strokeWidth="0.5" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="0" y1="25" x2="100" y2="25" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,2" />

          {/* Line */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d={dataWithColors
              .map((d, i) => {
                const x = (i / (dataWithColors.length - 1)) * 100
                const y = 100 - (d.value / maxValue) * 100
                return `${i === 0 ? "M" : "L"} ${x} ${y}`
              })
              .join(" ")}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />

          {/* Data points */}
          {dataWithColors.map((d, i) => {
            const x = (i / (dataWithColors.length - 1)) * 100
            const y = 100 - (d.value / maxValue) * 100
            return (
              <motion.circle
                key={i}
                initial={{ r: 0 }}
                animate={{ r: 2 }}
                transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                cx={x}
                cy={y}
                fill="#3b82f6"
              />
            )
          })}
        </svg>
      )}
    </div>
  )

  // Render pie chart
  const renderPieChart = () => {
    // Calculate total for percentages
    const total = dataWithColors.reduce((sum, d) => sum + d.value, 0)

    // Calculate segments
    let startAngle = 0
    const segments = dataWithColors.map((d, i) => {
      const percentage = d.value / total
      const angle = percentage * 360
      const segment = {
        startAngle,
        endAngle: startAngle + angle,
        percentage,
        color: d.color,
        label: d.label,
        value: d.value,
      }
      startAngle += angle
      return segment
    })

    // Convert angle to SVG arc path
    const getArcPath = (startAngle: number, endAngle: number, radius: number) => {
      const startRad = (startAngle - 90) * (Math.PI / 180)
      const endRad = (endAngle - 90) * (Math.PI / 180)

      const x1 = 50 + radius * Math.cos(startRad)
      const y1 = 50 + radius * Math.sin(startRad)
      const x2 = 50 + radius * Math.cos(endRad)
      const y2 = 50 + radius * Math.sin(endRad)

      const largeArc = endAngle - startAngle <= 180 ? 0 : 1

      return `M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
    }

    return (
      <div className="h-64 p-4 flex flex-col items-center">
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <>
            <div className="relative w-48 h-48">
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                {segments.map((segment, i) => (
                  <motion.path
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    d={getArcPath(segment.startAngle, segment.endAngle, 40)}
                    fill={segment.color}
                    stroke="white"
                    strokeWidth="1"
                  />
                ))}
              </svg>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {segments.map((segment, i) => (
                <div key={i} className="flex items-center text-xs">
                  <div className="w-3 h-3 mr-1 rounded-sm" style={{ backgroundColor: segment.color }} />
                  <span className="truncate" title={segment.label}>
                    {segment.label} ({(segment.percentage * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  // Render table
  const renderTable = () => (
    <div className="overflow-x-auto">
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-64">
          <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />
        </div>
      ) : (
        <>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                {tableData.headers.map((header, i) => (
                  <th key={i} className="px-4 py-2 text-left font-medium text-muted-foreground">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row, i) => (
                <tr
                  key={i}
                  className={cn(
                    "border-b border-gray-100 dark:border-gray-800",
                    i % 2 === 0 ? "bg-background" : "bg-gray-50/50 dark:bg-gray-800/50",
                  )}
                >
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 dark:border-gray-800">
              <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
                {Math.min(currentPage * rowsPerPage, tableData.rows.length)} of {tableData.rows.length} entries
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs px-2">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        "border rounded-lg overflow-hidden bg-background",
        isExpanded ? "fixed inset-4 z-50" : "relative",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
        <h3 className="font-medium">{title}</h3>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={downloadCSV}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="px-3 py-2 text-xs text-muted-foreground dark:text-muted-foreground border-b border-gray-200 dark:border-gray-800">
          {description}
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start px-3 pt-2 bg-transparent border-b border-gray-200 dark:border-gray-800">
          <TabsTrigger value="bar" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800">
            <BarChart className="h-4 w-4 mr-1.5" />
            Bar
          </TabsTrigger>
          <TabsTrigger value="line" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800">
            <LineChart className="h-4 w-4 mr-1.5" />
            Line
          </TabsTrigger>
          <TabsTrigger value="pie" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800">
            <PieChart className="h-4 w-4 mr-1.5" />
            Pie
          </TabsTrigger>
          <TabsTrigger value="table" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800">
            <TableIcon className="h-4 w-4 mr-1.5" />
            Table
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bar" className="mt-0">
          {renderBarChart()}
        </TabsContent>

        <TabsContent value="line" className="mt-0">
          {renderLineChart()}
        </TabsContent>

        <TabsContent value="pie" className="mt-0">
          {renderPieChart()}
        </TabsContent>

        <TabsContent value="table" className="mt-0">
          {renderTable()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
