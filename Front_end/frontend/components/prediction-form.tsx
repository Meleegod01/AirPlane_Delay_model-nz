"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plane, AlertCircle, CheckCircle } from "lucide-react"

const API_BASE_URL = "https://airplane-delay-model-backend.onrender.com"

interface PredictionResult {
  total_delay_minutes: number
  average_delay_per_flight: number
  delay_category: string
}

interface FormData {
  carrier: string
  airport: string
  month: string
  arr_flights: string
  weather_severity: number[]
  nas_severity: number[]
  equipment_issues: number[]
}

export function PredictionForm() {
  const [formData, setFormData] = useState<FormData>({
    carrier: "",
    airport: "",
    month: "",
    arr_flights: "",
    weather_severity: [1],
    nas_severity: [1],
    equipment_issues: [1],
  })

  const [carriers, setCarriers] = useState<string[]>([])
  const [airports, setAirports] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load carriers and airports on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [carriersRes, airportsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/carriers`),
          fetch(`${API_BASE_URL}/api/airports`),
        ])

        if (carriersRes.ok) {
          const carriersData = await carriersRes.json()
          setCarriers(carriersData.carriers || ["AA", "DL", "UA", "WN", "AS", "B6", "NK", "F9", "G4", "YX"])
        }

        if (airportsRes.ok) {
          const airportsData = await airportsRes.json()
          setAirports(airportsData.airports || ["ATL", "LAX", "ORD", "DFW", "DEN", "JFK", "SFO", "SEA", "LAS", "MCO"])
        }
      } catch (err) {
        console.error("Failed to load carriers/airports:", err)
        // Use fallback data
        setCarriers(["AA", "DL", "UA", "WN", "AS", "B6", "NK", "F9", "G4", "YX"])
        setAirports(["ATL", "LAX", "ORD", "DFW", "DEN", "JFK", "SFO", "SEA", "LAS", "MCO"])
      }
    }

    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)

    // Validate form data
    if (!formData.carrier || !formData.airport || !formData.month || !formData.arr_flights) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    const monthNum = Number.parseInt(formData.month)
    const arrFlights = Number.parseInt(formData.arr_flights)

    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      setError("Please enter a valid month (1-12)")
      setIsLoading(false)
      return
    }

    if (isNaN(arrFlights) || arrFlights <= 0) {
      setError("Please enter a valid number of arriving flights")
      setIsLoading(false)
      return
    }

    try {
      const requestData = {
        carrier: formData.carrier,
        airport: formData.airport,
        month: monthNum,
        arr_flights: arrFlights,
        weather_severity: formData.weather_severity[0],
        nas_severity: formData.nas_severity[0],
        equipment_issues: formData.equipment_issues[0],
      }

      console.log("Sending request:", requestData)

      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      const data = await response.json()
      console.log("Response:", data)

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      if (data.success && data.prediction) {
        setResult(data.prediction)
      } else {
        throw new Error(data.error || "Invalid response format")
      }
    } catch (err) {
      console.error("Prediction error:", err)
      setError(err instanceof Error ? err.message : "Failed to get prediction")
    } finally {
      setIsLoading(false)
    }
  }

  const getDelayColor = (category: string) => {
    switch (category) {
      case "Minimal Delay":
        return "bg-green-500"
      case "Low Delay":
        return "bg-yellow-500"
      case "Moderate Delay":
        return "bg-orange-500"
      case "High Delay":
        return "bg-red-500"
      case "Severe Delay":
        return "bg-red-700"
      default:
        return "bg-gray-500"
    }
  }

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

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">Flight Delay Prediction</h2>
          <p className="text-lg text-gray-300">Enter flight details to get AI-powered delay predictions</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Plane className="h-5 w-5" />
                Flight Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="carrier" className="text-gray-300">
                      Carrier
                    </Label>
                    <Select
                      value={formData.carrier}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, carrier: value }))}
                    >
                      <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                        <SelectValue placeholder="Select carrier" />
                      </SelectTrigger>
                      <SelectContent>
                        {carriers.map((carrier) => (
                          <SelectItem key={carrier} value={carrier}>
                            {carrier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="airport" className="text-gray-300">
                      Airport
                    </Label>
                    <Select
                      value={formData.airport}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, airport: value }))}
                    >
                      <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                        <SelectValue placeholder="Select airport" />
                      </SelectTrigger>
                      <SelectContent>
                        {airports.map((airport) => (
                          <SelectItem key={airport} value={airport}>
                            {airport}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="month" className="text-gray-300">
                      Month
                    </Label>
                    <Select
                      value={formData.month}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, month: value }))}
                    >
                      <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arr_flights" className="text-gray-300">
                      Arriving Flights
                    </Label>
                    <Input
                      id="arr_flights"
                      type="number"
                      placeholder="e.g., 150"
                      value={formData.arr_flights}
                      onChange={(e) => setFormData((prev) => ({ ...prev, arr_flights: e.target.value }))}
                      className="border-gray-600 bg-gray-700 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Weather Severity: {formData.weather_severity[0]}</Label>
                    <Slider
                      value={formData.weather_severity}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, weather_severity: value }))}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">NAS Severity: {formData.nas_severity[0]}</Label>
                    <Slider
                      value={formData.nas_severity}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, nas_severity: value }))}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Equipment Issues: {formData.equipment_issues[0]}</Label>
                    <Slider
                      value={formData.equipment_issues}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, equipment_issues: value }))}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? (
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

          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Prediction Results</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Prediction Complete</span>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <div className="text-sm text-gray-400">Total Delay</div>
                      <div className="text-2xl font-bold text-white">
                        {Math.round(result.total_delay_minutes)} minutes
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <div className="text-sm text-gray-400">Average per Flight</div>
                      <div className="text-2xl font-bold text-white">
                        {Math.round(result.average_delay_per_flight)} minutes
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <div className="text-sm text-gray-400">Delay Category</div>
                      <Badge className={`${getDelayColor(result.delay_category)} text-white`}>
                        {result.delay_category}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {!result && !error && !isLoading && (
                <div className="text-center text-gray-400">
                  <Plane className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p>Enter flight details and click "Predict Delays" to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
