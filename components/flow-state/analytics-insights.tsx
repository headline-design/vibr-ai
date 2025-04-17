"use client"

import type React from "react"

import { useState } from "react"
import {
  BarChartIcon,
  Calendar,
  Clock,
  MessageSquare,
  Zap,
  Brain,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
  Lightbulb,
  Search,
  Code,
  FileText,
  Image,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DataVisualization } from "./data-visualization"
import { cn } from "@/lib/utils"

interface AnalyticsInsightsProps {
  className?: string
}

export function AnalyticsInsights({ className }: AnalyticsInsightsProps) {
  const [timeRange, setTimeRange] = useState<string>("7d")
  const [activeTab, setActiveTab] = useState<string>("overview")

  // Sample data for charts
  const usageData = [
    { label: "Mon", value: 42 },
    { label: "Tue", value: 63 },
    { label: "Wed", value: 52 },
    { label: "Thu", value: 78 },
    { label: "Fri", value: 91 },
    { label: "Sat", value: 45 },
    { label: "Sun", value: 35 },
  ]

  const modelUsageData = [
    { label: "GPT-4", value: 45 },
    { label: "GPT-3.5", value: 30 },
    { label: "Claude", value: 15 },
    { label: "Llama", value: 10 },
  ]

  const queryTypesData = [
    { label: "Questions", value: 40 },
    { label: "Code", value: 25 },
    { label: "Writing", value: 20 },
    { label: "Analysis", value: 15 },
  ]

  const tokensData = [
    { label: "Mon", value: 12500 },
    { label: "Tue", value: 18700 },
    { label: "Wed", value: 15200 },
    { label: "Thu", value: 22100 },
    { label: "Fri", value: 25600 },
    { label: "Sat", value: 14300 },
    { label: "Sun", value: 9800 },
  ]

  const topQueriesTableData = {
    headers: ["Query", "Count", "Avg. Tokens", "Model"],
    rows: [
      ["How to implement authentication in Next.js?", "12", "1,245", "GPT-4"],
      ["Write a React component for a dropdown menu", "8", "980", "GPT-3.5"],
      ["Explain the difference between useState and useReducer", "7", "1,560", "Claude"],
      ["Generate a SQL query to find top customers", "6", "720", "GPT-4"],
      ["Help me debug this JavaScript code", "5", "1,890", "GPT-4"],
    ],
  }

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Get time range label
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "24h":
        return "Last 24 hours"
      case "7d":
        return "Last 7 days"
      case "30d":
        return "Last 30 days"
      case "90d":
        return "Last 90 days"
      default:
        return "Last 7 days"
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium flex items-center">
          <BarChartIcon className="h-5 w-5 mr-2 text-blue-500" />
          Analytics & Insights
        </h2>

        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] h-8">
              <Calendar className="h-4 w-4 mr-1.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="h-8">
            <Download className="h-4 w-4 mr-1.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Conversations"
          value="128"
          change={12}
          icon={<MessageSquare className="h-5 w-5 text-blue-500" />}
        />

        <StatCard
          title="Total Messages"
          value="1,245"
          change={-5}
          icon={<MessageSquare className="h-5 w-5 text-green-500" />}
        />

        <StatCard title="Tokens Used" value="118,432" change={23} icon={<Zap className="h-5 w-5 text-amber-500" />} />

        <StatCard
          title="Average Response Time"
          value="2.4s"
          change={-15}
          icon={<Clock className="h-5 w-5 text-purple-500" />}
          changeIsGood={true}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChartIcon className="h-4 w-4 mr-1.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center">
            <Zap className="h-4 w-4 mr-1.5" />
            Usage
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center">
            <Lightbulb className="h-4 w-4 mr-1.5" />
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Overview tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1.5 text-blue-500" />
                  Conversation Activity
                </CardTitle>
                <CardDescription>{getTimeRangeLabel()}</CardDescription>
              </CardHeader>
              <CardContent>
                <DataVisualization data={usageData} type="bar" title="Daily Conversations" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Brain className="h-4 w-4 mr-1.5 text-purple-500" />
                  Model Usage
                </CardTitle>
                <CardDescription>{getTimeRangeLabel()}</CardDescription>
              </CardHeader>
              <CardContent>
                <DataVisualization data={modelUsageData} type="pie" title="AI Model Distribution" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Search className="h-4 w-4 mr-1.5 text-amber-500" />
                Top Queries
              </CardTitle>
              <CardDescription>Most frequent queries in {getTimeRangeLabel().toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent>
              <DataVisualization data={topQueriesTableData} type="table" title="Frequent Queries" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage tab */}
        <TabsContent value="usage" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Zap className="h-4 w-4 mr-1.5 text-amber-500" />
                Token Usage
              </CardTitle>
              <CardDescription>{getTimeRangeLabel()}</CardDescription>
            </CardHeader>
            <CardContent>
              <DataVisualization data={tokensData} type="line" title="Daily Token Usage" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Brain className="h-4 w-4 mr-1.5 text-purple-500" />
                  Model Breakdown
                </CardTitle>
                <CardDescription>Token usage by model</CardDescription>
              </CardHeader>
              <CardContent>
                <DataVisualization data={modelUsageData} type="bar" title="Token Usage by Model" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <FileText className="h-4 w-4 mr-1.5 text-blue-500" />
                  Query Types
                </CardTitle>
                <CardDescription>Usage by query category</CardDescription>
              </CardHeader>
              <CardContent>
                <DataVisualization data={queryTypesData} type="pie" title="Query Type Distribution" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Clock className="h-4 w-4 mr-1.5 text-green-500" />
                Usage Patterns
              </CardTitle>
              <CardDescription>When you use the AI assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <p>Heatmap visualization of usage patterns by time of day</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights tab */}
        <TabsContent value="insights" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <InsightCard
              title="Most Productive Time"
              insight="Tuesdays, 10am-12pm"
              description="You tend to have the most AI interactions during this time period."
              icon={<Clock className="h-5 w-5 text-blue-500" />}
            />

            <InsightCard
              title="Favorite Topic"
              insight="React Development"
              description="25% of your queries are related to React and frontend development."
              icon={<Code className="h-5 w-5 text-purple-500" />}
            />

            <InsightCard
              title="Most Efficient Model"
              insight="GPT-3.5 Turbo"
              description="Provides the best token efficiency for your common queries."
              icon={<Zap className="h-5 w-5 text-amber-500" />}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Lightbulb className="h-4 w-4 mr-1.5 text-amber-500" />
                Personalized Recommendations
              </CardTitle>
              <CardDescription>Based on your usage patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <Brain className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Try GPT-4 for Code Generation</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your code-related queries might benefit from GPT-4's improved reasoning capabilities.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                <Image className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Use Image Analysis More Often</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    You've had great results when using image analysis features. Consider uploading more images for
                    analysis.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                <MessageSquare className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Create More Conversation Threads</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Separating your topics into different conversations can help you stay organized and find information
                    later.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" size="sm" className="ml-auto">
                <HelpCircle className="h-4 w-4 mr-1.5" />
                How are these generated?
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Stat card component
function StatCard({
  title,
  value,
  change,
  icon,
  changeIsGood = false,
}: {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  changeIsGood?: boolean
}) {
  const isPositive = change > 0
  const isNegative = change < 0

  // For some metrics like response time, negative change is good
  const isGood = changeIsGood ? isNegative : isPositive

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-muted-foreground">{title}</div>
          {icon}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        {change !== 0 && (
          <div className="flex items-center mt-2 text-xs">
            {isPositive ? (
              <ArrowUpRight className={cn("h-3.5 w-3.5 mr-1", isGood ? "text-green-500" : "text-red-500")} />
            ) : (
              <ArrowDownRight className={cn("h-3.5 w-3.5 mr-1", isGood ? "text-green-500" : "text-red-500")} />
            )}
            <span className={cn(isGood ? "text-green-500" : "text-red-500")}>
              {Math.abs(change)}% from previous period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Insight card component
function InsightCard({
  title,
  insight,
  description,
  icon,
}: {
  title: string
  insight: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          {icon}
          <h3 className="text-sm font-medium ml-2">{title}</h3>
        </div>
        <div className="text-xl font-bold mb-2">{insight}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
