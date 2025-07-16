"use client"

import { Button } from "@/components/ui/button"
import { Plane, TrendingUp, Clock, Shield } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-blue-500/10 p-4">
              <Plane className="h-12 w-12 text-blue-400" />
            </div>
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
            Flight Delay
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              Predictor
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300 md:text-xl">
            Advanced machine learning models to predict flight delays with precision. Make informed decisions for your
            aviation operations.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              onClick={() => document.getElementById("prediction")?.scrollIntoView({ behavior: "smooth" })}
            >
              Start Prediction
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3 bg-transparent"
              onClick={() => document.getElementById("insights")?.scrollIntoView({ behavior: "smooth" })}
            >
              View Insights
            </Button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">Accurate Predictions</h3>
            <p className="text-slate-400">ML-powered delay forecasting with high precision</p>
          </div>
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <Clock className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">Real-time Analysis</h3>
            <p className="text-slate-400">Instant predictions based on current conditions</p>
          </div>
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <Shield className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">Reliable Data</h3>
            <p className="text-slate-400">Built on comprehensive aviation datasets</p>
          </div>
        </div>
      </div>
    </section>
  )
}
