"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react"

const API_BASE_URL = "https://airplane-delay-model-backend.onrender.com"

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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadInsights = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/insights`)

      if (!response.ok) {
        // If response is not OK, try to parse error from body, otherwise use status text
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.insights) {
        setInsights(data.insights)
      } else {
        throw new Error(data.error || "Invalid response format or insights not found")
      }
    } catch (err) {
      console.error("Insights error:", err)
      setError(err instanceof Error ? err.message : "Failed to load insights. Please check your backend server.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadInsights()
  }, [])

  const getTopCarriers = () => {
    if (!insights?.carrier_delays) return []
    return Object.entries(insights.carrier_delays)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 5)
  }

  const getTopAirports = () => {
    if (!insights?.airport_delays) return []
    return Object.entries(insights.airport_delays)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 5)
  }

  const getWorstMonths = () => {
    if (!insights?.monthly_delays) return []
    return Object.entries(insights.monthly_delays)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="mb-4 text-4xl font-bold text-white">Analytics Dashboard</h2>
            <p className="text-lg text-gray-300">Real-time insights from our machine learning models</p>
          </div>
          <Button
            onClick={loadInsights}
            disabled={isLoading}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
          >
            {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Refresh
          </Button>
        </div>

        {error && (
          <Card className="mb-8 border-red-500/50 bg-red-500/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <span>Error loading insights: {error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {insights && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Model Performance */}
            <Card className="border-gray-700 bg-gray-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  Model Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400">Best Model</div>
                  <Badge className="bg-blue-500 text-white">{insights.best_model}</Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-400">R² Score</div>
                  <div className="text-2xl font-bold text-white">
                    {(insights.model_performance.r2 * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Mean Absolute Error</div>
                  <div className="text-2xl font-bold text-white">{insights.model_performance.mae.toFixed(1)} min</div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Carriers */}
            <Card className="border-gray-700 bg-gray-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  Best Carriers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getTopCarriers().map(([carrier, delay], index) => (
                    <div key={carrier} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-gray-600 text-gray-300">
                          #{index + 1}
                        </Badge>
                        <span className="text-white">{carrier}</span>
                      </div>
                      <span className="text-sm text-gray-400">{delay.toFixed(1)} min avg</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Airports */}
            <Card className="border-gray-700 bg-gray-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  Best Airports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getTopAirports().map(([airport, delay], index) => (
                    <div key={airport} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-gray-600 text-gray-300">
                          #{index + 1}
                        </Badge>
                        <span className="text-white">{airport}</span>
                      </div>
                      <span className="text-sm text-gray-400">{delay.toFixed(1)} min avg</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Seasonal Trends */}
            <Card className="border-gray-700 bg-gray-800/50 backdrop-blur lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertTriangle className="h-5 w-5 text-orange-400" />
                  Seasonal Delay Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3 text-lg font-semibold text-white">Worst Months for Delays</h4>
                    <div className="space-y-2">
                      {getWorstMonths().map(([month, delay], index) => (
                        <div key={month} className="flex items-center justify-between rounded-lg bg-gray-700/50 p-3">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-red-500 text-white">#{index + 1}</Badge>
                            <span className="text-white">{monthNames[Number.parseInt(month) - 1]}</span>
                          </div>
                          <span className="text-sm text-gray-400">{delay.toFixed(1)} min avg</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 text-lg font-semibold text-white">Monthly Overview</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(insights.monthly_delays || {}).map(([month, delay]) => (
                        <div key={month} className="rounded bg-gray-700/50 p-2 text-center">
                          <div className="text-xs text-gray-400">{monthNames[Number.parseInt(month) - 1]}</div>
                          <div className="text-sm font-semibold text-white">{delay.toFixed(0)}m</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!insights && !error && !isLoading && (
          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur">
            <CardContent className="p-12 text-center">
              <BarChart3 className="mx-auto mb-4 h-12 w-12 text-gray-500" />
              <p className="text-gray-400">Click "Refresh" to load analytics data</p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
