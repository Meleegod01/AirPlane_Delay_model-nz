"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Loader2, Plane } from "lucide-react"

interface PredictionResult {
  total_delay_minutes: number
  average_delay_per_flight: number
  delay_category: string
}

export function PredictionForm() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [formData, setFormData] = useState({
    carrier: "",
    airport: "",
    month: "",
    arr_flights: "",
    weather_severity: [1],
    nas_severity: [1],
    equipment_issues: [1],
  })

  const carriers = ["AA", "DL", "UA", "WN", "AS", "B6", "NK", "F9", "G4", "YX"]
  const airports = ["ATL", "LAX", "ORD", "DFW", "DEN", "JFK", "SFO", "SEA", "LAS", "MCO"]
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("https://airplane-delay-model-2.onrender.com/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carrier: formData.carrier,
          airport: formData.airport,
          month: formData.month,
          arr_flights: formData.arr_flights,
          weather_severity: formData.weather_severity[0],
          nas_severity: formData.nas_severity[0],
          equipment_issues: formData.equipment_issues[0],
        }),
      })

      const data = await response.json()
      if (data.success) {
        setResult(data.prediction)
      } else {
        console.error("Prediction failed:", data.error)
      }
    } catch (error) {
      console.error("Error making prediction:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Minimal Delay":
        return "text-green-400"
      case "Low Delay":
        return "text-yellow-400"
      case "Moderate Delay":
        return "text-orange-400"
      case "High Delay":
        return "text-red-400"
      case "Severe Delay":
        return "text-red-600"
      default:
        return "text-slate-400"
    }
  }

  return (
    <section id="prediction" className="px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4 md:text-4xl">Flight Delay Prediction</h2>
          <p className="text-slate-400 text-lg">Enter flight details to get accurate delay predictions</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Plane className="h-5 w-5 text-blue-400" />
                Flight Parameters
              </CardTitle>
              <CardDescription className="text-slate-400">Configure your flight details and conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="carrier" className="text-slate-300">
                      Carrier
                    </Label>
                    <Select
                      value={formData.carrier}
                      onValueChange={(value) => setFormData({ ...formData, carrier: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select carrier" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {carriers.map((carrier) => (
                          <SelectItem key={carrier} value={carrier} className="text-white hover:bg-slate-600">
                            {carrier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="airport" className="text-slate-300">
                      Airport
                    </Label>
                    <Select
                      value={formData.airport}
                      onValueChange={(value) => setFormData({ ...formData, airport: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select airport" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {airports.map((airport) => (
                          <SelectItem key={airport} value={airport} className="text-white hover:bg-slate-600">
                            {airport}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="month" className="text-slate-300">
                      Month
                    </Label>
                    <Select
                      value={formData.month}
                      onValueChange={(value) => setFormData({ ...formData, month: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value} className="text-white hover:bg-slate-600">
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arr_flights" className="text-slate-300">
                      Arriving Flights
                    </Label>
                    <Input
                      id="arr_flights"
                      type="number"
                      placeholder="e.g., 150"
                      value={formData.arr_flights}
                      onChange={(e) => setFormData({ ...formData, arr_flights: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Weather Severity: {formData.weather_severity[0]}</Label>
                    <Slider
                      value={formData.weather_severity}
                      onValueChange={(value) => setFormData({ ...formData, weather_severity: value })}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">NAS Severity: {formData.nas_severity[0]}</Label>
                    <Slider
                      value={formData.nas_severity}
                      onValueChange={(value) => setFormData({ ...formData, nas_severity: value })}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Equipment Issues: {formData.equipment_issues[0]}</Label>
                    <Slider
                      value={formData.equipment_issues}
                      onValueChange={(value) => setFormData({ ...formData, equipment_issues: value })}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={
                    loading || !formData.carrier || !formData.airport || !formData.month || !formData.arr_flights
                  }
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Predicting...
                    </>
                  ) : (
                    "Predict Delays"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {result && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Prediction Results</CardTitle>
                <CardDescription className="text-slate-400">Delay forecast based on your parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-2 ${getCategoryColor(result.delay_category)}`}>
                    {result.delay_category}
                  </div>
                  <p className="text-slate-400">Overall Assessment</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-white mb-1">
                      {Math.round(result.total_delay_minutes)} min
                    </div>
                    <p className="text-slate-400 text-sm">Total Delay Minutes</p>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-white mb-1">
                      {Math.round(result.average_delay_per_flight)} min
                    </div>
                    <p className="text-slate-400 text-sm">Average Delay per Flight</p>
                  </div>
                </div>

                <div className="text-xs text-slate-500 text-center">
                  Predictions are based on historical data and current conditions
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
