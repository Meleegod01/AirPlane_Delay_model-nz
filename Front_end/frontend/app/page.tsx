"use client"

import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { PredictionForm } from "@/components/prediction-form"
import { InsightsDashboard } from "@/components/insights-dashboard"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Hero />
      <Features />
      <PredictionForm />
      <InsightsDashboard />
      <footer className="w-full py-8 text-center text-gray-400">
        <p>&copy; 2025 Avionics Predictor. All rights reserved.</p>
      </footer>
    </main>
  )
}
