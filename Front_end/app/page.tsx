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
    </main>
  )
}
