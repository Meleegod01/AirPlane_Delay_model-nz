"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Plane, Calendar } from "lucide-react"

interface Insights {
  best_model: string
  model_performance: {
    r2: number
    mae: number
  }
  monthly_delays: Record<string, number>
  carrier_delays: Record<string, number>
  airport_delays: Record<string, number>
}

export function InsightsDashboard() {
  const [insights, setInsights] = useState<Insights | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch("https://airplane-delay-model-2.onrender.com/api/insights")
        const data = await response.json()
        if (data.success) {
          setInsights(data.insights)
        }
      } catch (error) {
        console.error("Error fetching insights:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [])

  if (loading) {
    return (
      <section id="insights" className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
            <p className="text-slate-400 mt-4">Loading insights...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!insights) {
    return null
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const topCarriers = Object.entries(insights.carrier_delays)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 5)

  const topAirports = Object.entries(insights.airport_delays)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <section id="insights" className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4 md:text-4xl">Aviation Insights</h2>
          <p className="text-slate-400 text-lg">Data-driven insights from our machine learning models</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Best Model</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{insights.best_model}</div>
              <Badge variant="secondary" className="mt-2 bg-blue-500/20 text-blue-400">
                Active Model
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">R² Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{(insights.model_performance.r2 * 100).toFixed(1)}%</div>
              <p className="text-xs text-slate-400 mt-2">Model Accuracy</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Mean Absolute Error</CardTitle>
              <Calendar className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{insights.model_performance.mae.toFixed(1)} min</div>
              <p className="text-xs text-slate-400 mt-2">Average Prediction Error</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Plane className="h-5 w-5 text-blue-400" />
                Top Performing Carriers
              </CardTitle>
              <CardDescription className="text-slate-400">Carriers with lowest average delays</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCarriers.map(([carrier, delay], index) => (
                  <div key={carrier} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-white font-medium">{carrier}</span>
                    </div>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {delay.toFixed(1)} min
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-400" />
                Busiest Airports
              </CardTitle>
              <CardDescription className="text-slate-400">Airports with highest delay volumes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topAirports.map(([airport, delay], index) => (
                  <div key={airport} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-white font-medium">{airport}</span>
                    </div>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {delay.toFixed(1)} min
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-400" />
              Monthly Delay Patterns
            </CardTitle>
            <CardDescription className="text-slate-400">Average delays throughout the year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {Object.entries(insights.monthly_delays).map(([month, delay]) => (
                <div key={month} className="text-center">
                  <div className="text-lg font-bold text-white mb-1">{delay.toFixed(1)}</div>
                  <div className="text-sm text-slate-400">{monthNames[Number.parseInt(month) - 1]}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
