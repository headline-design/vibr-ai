"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  LineChart,
  PieChart,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Line,
  Pie,
  Area,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart2,
  PieChartIcon,
  TrendingUp,
  Clock,
  Download,
  RefreshCw,
  Filter,
  Share2,
  HelpCircle,
} from "lucide-react"

// Sample data for charts
const usageData = [
  { date: "2023-01", messages: 245, tokens: 12500, cost: 2.5 },
  { date: "2023-02", messages: 312, tokens: 15800, cost: 3.16 },
  { date: "2023-03", messages: 480, tokens: 24000, cost: 4.8 },
  { date: "2023-04", messages: 520, tokens: 26000, cost: 5.2 },
  { date: "2023-05", messages: 610, tokens: 30500, cost: 6.1 },
  { date: "2023-06", messages: 590, tokens: 29500, cost: 5.9 },
  { date: "2023-07", messages: 730, tokens: 36500, cost: 7.3 },
  { date: "2023-08", messages: 820, tokens: 41000, cost: 8.2 },
  { date: "2023-09", messages: 940, tokens: 47000, cost: 9.4 },
  { date: "2023-10", messages: 1050, tokens: 52500, cost: 10.5 },
  { date: "2023-11", messages: 1180, tokens: 59000, cost: 11.8 },
  { date: "2023-12", messages: 1320, tokens: 66000, cost: 13.2 },
]

const modelUsageData = [
  { name: "GPT-4o", value: 45 },
  { name: "GPT-3.5", value: 30 },
  { name: "Claude 3", value: 15 },
  { name: "Llama 3", value: 10 },
]

const topicDistributionData = [
  { name: "Code Generation", value: 35 },
  { name: "Data Analysis", value: 25 },
  { name: "Content Creation", value: 20 },
  { name: "Research", value: 15 },
  { name: "Other", value: 5 },
]

const hourlyUsageData = [
  { hour: "00:00", messages: 15 },
  { hour: "01:00", messages: 8 },
  { hour: "02:00", messages: 5 },
  { hour: "03:00", messages: 3 },
  { hour: "04:00", messages: 2 },
  { hour: "05:00", messages: 4 },
  { hour: "06:00", messages: 10 },
  { hour: "07:00", messages: 25 },
  { hour: "08:00", messages: 45 },
  { hour: "09:00", messages: 80 },
  { hour: "10:00", messages: 95 },
  { hour: "11:00", messages: 110 },
  { hour: "12:00", messages: 105 },
  { hour: "13:00", messages: 115 },
  { hour: "14:00", messages: 120 },
  { hour: "15:00", messages: 110 },
  { hour: "16:00", messages: 95 },
  { hour: "17:00", messages: 85 },
  { hour: "18:00", messages: 70 },
  { hour: "19:00", messages: 60 },
  { hour: "20:00", messages: 50 },
  { hour: "21:00", messages: 40 },
  { hour: "22:00", messages: 30 },
  { hour: "23:00", messages: 20 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function DataVisualizationDashboard() {
  const [timeRange, setTimeRange] = useState("year")
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1200)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 3 months</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,602</div>
            <p className="text-xs text-muted-foreground">+20.1% from last {timeRange}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Token Usage</CardTitle>
            <TokenIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">430.2K</div>
            <p className="text-xs text-muted-foreground">+15.3% from last {timeRange}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.8s</div>
            <p className="text-xs text-muted-foreground">-0.3s from last {timeRange}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
            <CostIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$87.50</div>
            <p className="text-xs text-muted-foreground">+12.4% from last {timeRange}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList className=" h-auto grid grid-cols-2 md:inline-flex ">
          <TabsTrigger value="usage" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Usage Trends
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Model Distribution
          </TabsTrigger>
          <TabsTrigger value="topics" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Topic Analysis
          </TabsTrigger>
          <TabsTrigger value="time" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Time Patterns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Over Time</CardTitle>
              <CardDescription>Message count and token usage over the selected time period</CardDescription>
            </CardHeader>
            <CardContent className="pl-2 overflow-auto scrollbrar-thin scroll-bar-thumb-rounded-full scroll-bar-track-rounded-full">
              <ChartContainer
                config={{
                  messages: {
                    label: "Messages",
                    color: "hsl(var(--chart-1))",
                  },
                  tokens: {
                    label: "Tokens (hundreds)",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return date.toLocaleDateString("en-US", { month: "short" })
                      }}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="messages"
                      stroke="var(--color-messages)"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="tokens"
                      stroke="var(--color-tokens)"
                      activeDot={{ r: 8 }}
                      // Divide by 100 to show in hundreds
                      // @ts-ignore - recharts types are not complete
                      formatter={(value) => (value / 100).toFixed(0)}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
              <CardDescription>Estimated cost based on token usage</CardDescription>
            </CardHeader>
            <CardContent className="pl-2 overflow-auto scrollbrar-thin scroll-bar-thumb-rounded-full scroll-bar-track-rounded-full">
              <ChartContainer
                config={{
                  cost: {
                    label: "Cost (USD)",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[300px] "
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return date.toLocaleDateString("en-US", { month: "short" })
                      }}
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="cost"
                      stroke="var(--color-cost)"
                      fill="var(--color-cost)"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Model Usage Distribution</CardTitle>
                <CardDescription>Percentage of usage by AI model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={modelUsageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {modelUsageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Performance</CardTitle>
                <CardDescription>Response time and accuracy by model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium">GPT-4o</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">2.1s</span>
                        </div>
                        <Badge variant="outline">98.5% accuracy</Badge>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: "98.5%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium">GPT-3.5</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">1.2s</span>
                        </div>
                        <Badge variant="outline">94.2% accuracy</Badge>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: "94.2%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm font-medium">Claude 3</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">1.8s</span>
                        </div>
                        <Badge variant="outline">96.8% accuracy</Badge>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-yellow-500" style={{ width: "96.8%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                        <span className="text-sm font-medium">Llama 3</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">1.5s</span>
                        </div>
                        <Badge variant="outline">92.1% accuracy</Badge>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-orange-500" style={{ width: "92.1%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Topic Distribution</CardTitle>
                <CardDescription>Most common conversation topics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topicDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {topicDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Keywords</CardTitle>
                <CardDescription>Most frequently used terms in conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 text-sm">
                    React <span className="ml-1 text-xs opacity-70">428</span>
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 text-sm">
                    TypeScript <span className="ml-1 text-xs opacity-70">356</span>
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 px-3 py-1 text-sm">
                    Next.js <span className="ml-1 text-xs opacity-70">312</span>
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 px-3 py-1 text-sm">
                    API <span className="ml-1 text-xs opacity-70">287</span>
                  </Badge>
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 text-sm">
                    Database <span className="ml-1 text-xs opacity-70">245</span>
                  </Badge>
                  <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1 text-sm">
                    Authentication <span className="ml-1 text-xs opacity-70">218</span>
                  </Badge>
                  <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-900/30 dark:text-pink-400 px-3 py-1 text-sm">
                    CSS <span className="ml-1 text-xs opacity-70">201</span>
                  </Badge>
                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 text-sm">
                    Tailwind <span className="ml-1 text-xs opacity-70">189</span>
                  </Badge>
                  <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200 dark:bg-teal-900/30 dark:text-teal-400 px-3 py-1 text-sm">
                    Redux <span className="ml-1 text-xs opacity-70">176</span>
                  </Badge>
                  <Badge className="bg-cyan-100 text-cyan-800 hover:bg-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 px-3 py-1 text-sm">
                    GraphQL <span className="ml-1 text-xs opacity-70">165</span>
                  </Badge>
                  <Badge className="bg-lime-100 text-lime-800 hover:bg-lime-200 dark:bg-lime-900/30 dark:text-lime-400 px-3 py-1 text-sm">
                    Docker <span className="ml-1 text-xs opacity-70">152</span>
                  </Badge>
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 text-sm">
                    Testing <span className="ml-1 text-xs opacity-70">143</span>
                  </Badge>
                  <Badge className="bg-sky-100 text-sky-800 hover:bg-sky-200 dark:bg-sky-900/30 dark:text-sky-400 px-3 py-1 text-sm">
                    Deployment <span className="ml-1 text-xs opacity-70">138</span>
                  </Badge>
                  <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 px-3 py-1 text-sm">
                    Performance <span className="ml-1 text-xs opacity-70">126</span>
                  </Badge>
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1 text-sm">
                    Security <span className="ml-1 text-xs opacity-70">119</span>
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Topic Trends Over Time</CardTitle>
              <CardDescription>How conversation topics have evolved</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer
                config={{
                  code: {
                    label: "Code Generation",
                    color: "hsl(var(--chart-1))",
                  },
                  data: {
                    label: "Data Analysis",
                    color: "hsl(var(--chart-2))",
                  },
                  content: {
                    label: "Content Creation",
                    color: "hsl(var(--chart-3))",
                  },
                  research: {
                    label: "Research",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: "Jan", code: 30, data: 20, content: 15, research: 10 },
                      { month: "Feb", code: 32, data: 22, content: 16, research: 12 },
                      { month: "Mar", code: 35, data: 23, content: 18, research: 13 },
                      { month: "Apr", code: 33, data: 25, content: 17, research: 14 },
                      { month: "May", code: 36, data: 24, content: 19, research: 15 },
                      { month: "Jun", code: 34, data: 26, content: 20, research: 14 },
                      { month: "Jul", code: 37, data: 25, content: 21, research: 16 },
                      { month: "Aug", code: 38, data: 27, content: 22, research: 15 },
                      { month: "Sep", code: 36, data: 28, content: 20, research: 17 },
                      { month: "Oct", code: 39, data: 26, content: 23, research: 16 },
                      { month: "Nov", code: 40, data: 29, content: 22, research: 18 },
                      { month: "Dec", code: 42, data: 30, content: 24, research: 19 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="code" stroke="var(--color-code)" />
                    <Line type="monotone" dataKey="data" stroke="var(--color-data)" />
                    <Line type="monotone" dataKey="content" stroke="var(--color-content)" />
                    <Line type="monotone" dataKey="research" stroke="var(--color-research)" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Usage Pattern</CardTitle>
              <CardDescription>Message volume by hour of day</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer
                config={{
                  messages: {
                    label: "Messages",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyUsageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="messages" fill="var(--color-messages)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Usage patterns by day of week</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    messages: {
                      label: "Messages",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { day: "Mon", messages: 145 },
                        { day: "Tue", messages: 180 },
                        { day: "Wed", messages: 195 },
                        { day: "Thu", messages: 205 },
                        { day: "Fri", messages: 185 },
                        { day: "Sat", messages: 120 },
                        { day: "Sun", messages: 95 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="messages" fill="var(--color-messages)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Duration</CardTitle>
                <CardDescription>Average conversation length over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    duration: {
                      label: "Duration (minutes)",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "Jan", duration: 8.2 },
                        { month: "Feb", duration: 8.5 },
                        { month: "Mar", duration: 9.1 },
                        { month: "Apr", duration: 9.4 },
                        { month: "May", duration: 10.2 },
                        { month: "Jun", duration: 10.8 },
                        { month: "Jul", duration: 11.5 },
                        { month: "Aug", duration: 12.3 },
                        { month: "Sep", duration: 12.8 },
                        { month: "Oct", duration: 13.5 },
                        { month: "Nov", duration: 14.2 },
                        { month: "Dec", duration: 15.0 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="duration" stroke="var(--color-duration)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between">
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Advanced Filters
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share Report
          </Button>
          <Button variant="outline" size="icon">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Custom icons
function MessageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function TokenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  )
}

function CostIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )
}
