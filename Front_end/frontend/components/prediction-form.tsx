"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { PlaneTakeoff, Loader2, CheckCircle, XCircle } from "lucide-react"

const API_BASE_URL = "https://airplane-delay-model-backend.onrender.com"

interface PredictionResult {
  total_delay_minutes: number
  average_delay_per_flight: number
  delay_category: string
}

export function PredictionForm() {
  const [carrier, setCarrier] = useState<string>("")
  const [airport, setAirport] = useState<string>("")
  const [month, setMonth] = useState<string>("")
  const [arrFlights, setArrFlights] = useState<number>(100)
  const [weatherSeverity, setWeatherSeverity] = useState<number[]>([1])
  const [nasSeverity, setNasSeverity] = useState<number[]>([1])
  const [equipmentIssues, setEquipmentIssues] = useState<number[]>([1])

  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [carriers, setCarriers] = useState<string[]>([])
  const [airports, setAirports] = useState<string[]>([])

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [carriersRes, airportsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/carriers`),
          fetch(`${API_BASE_URL}/api/airports`),
        ])

        if (carriersRes.ok) {
          const data = await carriersRes.json()
          if (data.success && data.carriers) {
            setCarriers(data.carriers)
            if (!carrier && data.carriers.length > 0) setCarrier(data.carriers[0])
          }
        } else {
          console.error("Failed to fetch carriers:", carriersRes.statusText)
          setCarriers(["AA", "DL", "UA", "WN", "AS", "B6", "NK", "F9", "G4", "YX"]) // Fallback
        }

        if (airportsRes.ok) {
          const data = await airportsRes.json()
          if (data.success && data.airports) {
            setAirports(data.airports)
            if (!airport && data.airports.length > 0) setAirport(data.airports[0])
          }
        } else {
          console.error("Failed to fetch airports:", airportsRes.statusText)
          setAirports(["ATL", "LAX", "ORD", "DFW", "DEN", "JFK", "SFO", "SEA", "LAS", "MCO"]) // Fallback
        }
      } catch (err) {
        console.error("Error fetching dropdown data:", err)
        setCarriers(["AA", "DL", "UA", "WN", "AS", "B6", "NK", "F9", "G4", "YX"]) // Fallback
        setAirports(["ATL", "LAX", "ORD", "DFW", "DEN", "JFK", "SFO", "SEA", "LAS", "MCO"]) // Fallback
      }
    }
    fetchDropdownData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setPrediction(null)
    setError(null)

    // Basic validation
    if (!carrier || !airport || !month || arrFlights <= 0) {
      setError("Please fill in all required fields and ensure 'Arriving Flights' is a positive number.")
      setIsLoading(false)
      return
    }

    const payload = {
      carrier,
      airport,
      month: Number.parseInt(month),
      arr_flights: arrFlights,
      weather_severity: weatherSeverity[0],
      nas_severity: nasSeverity[0],
      equipment_issues: equipmentIssues[0],
    }

    console.log("Sending payload:", payload) // Debugging: log the payload

    try {
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.prediction) {
        setPrediction(data.prediction)
      } else {
        throw new Error(data.error || "Prediction failed: Invalid response format.")
      }
    } catch (err) {
      console.error("Error making prediction:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred during prediction.")
    } finally {
      setIsLoading(false)
    }
  }

  const getDelayCategoryColor = (category: string) => {
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
        return "bg-purple-600"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-12 text-center text-4xl font-bold text-white">Predict Flight Delays</h2>
        <Card className="transform-gpu border-gray-700 bg-gray-800/50 backdrop-blur transition-all duration-300 hover:scale-[1.01]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <PlaneTakeoff className="h-6 w-6 text-blue-400" />
              Flight Delay Prediction Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Carrier */}
              <div>
                <Label htmlFor="carrier" className="mb-2 block text-gray-300">
                  Airline Carrier
                </Label>
                <Select value={carrier} onValueChange={setCarrier}>
                  <SelectTrigger className="w-full border-gray-600 bg-gray-700 text-white">
                    <SelectValue placeholder="Select Carrier" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-600 bg-gray-700 text-white">
                    {carriers.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Airport */}
              <div>
                <Label htmlFor="airport" className="mb-2 block text-gray-300">
                  Airport
                </Label>
                <Select value={airport} onValueChange={setAirport}>
                  <SelectTrigger className="w-full border-gray-600 bg-gray-700 text-white">
                    <SelectValue placeholder="Select Airport" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-600 bg-gray-700 text-white">
                    {airports.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Month */}
              <div>
                <Label htmlFor="month" className="mb-2 block text-gray-300">
                  Month
                </Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger className="w-full border-gray-600 bg-gray-700 text-white">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-600 bg-gray-700 text-white">
                    {Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map((m) => (
                      <SelectItem key={m} value={m}>
                        {new Date(2000, Number.parseInt(m) - 1, 1).toLocaleString("en-US", { month: "long" })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Arriving Flights */}
              <div>
                <Label htmlFor="arrFlights" className="mb-2 block text-gray-300">
                  Number of Arriving Flights
                </Label>
                <Input
                  id="arrFlights"
                  type="number"
                  value={arrFlights}
                  onChange={(e) => setArrFlights(Number.parseInt(e.target.value))}
                  min="1"
                  className="border-gray-600 bg-gray-700 text-white"
                />
              </div>

              {/* Weather Severity */}
              <div className="md:col-span-2">
                <Label htmlFor="weatherSeverity" className="mb-2 block text-gray-300">
                  Weather Severity (1-5)
                </Label>
                <Slider
                  id="weatherSeverity"
                  min={1}
                  max={5}
                  step={1}
                  value={weatherSeverity}
                  onValueChange={setWeatherSeverity}
                  className="[&>span:first-child]:bg-blue-500"
                />
                <div className="mt-2 text-right text-sm text-gray-400">{weatherSeverity[0]}</div>
              </div>

              {/* NAS Severity */}
              <div className="md:col-span-2">
                <Label htmlFor="nasSeverity" className="mb-2 block text-gray-300">
                  National Airspace System (NAS) Severity (1-5)
                </Label>
                <Slider
                  id="nasSeverity"
                  min={1}
                  max={5}
                  step={1}
                  value={nasSeverity}
                  onValueChange={setNasSeverity}
                  className="[&>span:first-child]:bg-blue-500"
                />
                <div className="mt-2 text-right text-sm text-gray-400">{nasSeverity[0]}</div>
              </div>

              {/* Equipment Issues */}
              <div className="md:col-span-2">
                <Label htmlFor="equipmentIssues" className="mb-2 block text-gray-300">
                  Equipment Issues Severity (1-5)
                </Label>
                <Slider
                  id="equipmentIssues"
                  min={1}
                  max={5}
                  step={1}
                  value={equipmentIssues}
                  onValueChange={setEquipmentIssues}
                  className="[&>span:first-child]:bg-blue-500"
                />
                <div className="mt-2 text-right text-sm text-gray-400">{equipmentIssues[0]}</div>
              </div>

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 py-3 text-lg text-white hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Predicting...
                    </>
                  ) : (
                    "Get Prediction"
                  )}
                </Button>
              </div>
            </form>

            {error && (
              <div className="mt-6 flex items-center gap-2 rounded-md bg-red-500/10 p-4 text-red-400">
                <XCircle className="h-5 w-5" />
                <span>Error: {error}</span>
              </div>
            )}

            {prediction && (
              <div className="mt-6 rounded-md bg-gray-700/50 p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-white">Prediction Result:</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Total Delay Minutes:</span>
                    <span className="text-lg font-bold text-white">
                      {prediction.total_delay_minutes.toFixed(2)} min
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Average Delay Per Flight:</span>
                    <span className="text-lg font-bold text-white">
                      {prediction.average_delay_per_flight.toFixed(2)} min
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Delay Category:</span>
                    <Badge className={`${getDelayCategoryColor(prediction.delay_category)} text-white`}>
                      {prediction.delay_category}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span>Prediction successful!</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
