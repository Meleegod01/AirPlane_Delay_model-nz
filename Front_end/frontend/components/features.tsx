import { Plane, BarChart, ShieldCheck, Cloud, Wrench, CalendarDays } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Features() {
  const features = [
    {
      icon: Plane,
      title: "Predictive Analytics",
      description: "Anticipate flight delays based on historical data and real-time factors.",
    },
    {
      icon: BarChart,
      title: "Detailed Insights",
      description: "Understand the root causes of delays with comprehensive analytics.",
    },
    {
      icon: ShieldCheck,
      title: "Operational Efficiency",
      description: "Improve scheduling and resource allocation with accurate forecasts.",
    },
    {
      icon: Cloud,
      title: "Weather Impact",
      description: "Assess the severity of weather conditions on flight schedules.",
    },
    {
      icon: Wrench,
      title: "Equipment Readiness",
      description: "Factor in potential equipment issues for more precise predictions.",
    },
    {
      icon: CalendarDays,
      title: "Seasonal Trends",
      description: "Identify monthly and seasonal patterns affecting flight punctuality.",
    },
  ]

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="mb-12 text-4xl font-bold text-white">Key Features</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="transform-gpu border-gray-700 bg-gray-800/50 backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:border-blue-500"
            >
              <CardHeader>
                <feature.icon className="mb-4 h-10 w-10 text-blue-400" />
                <CardTitle className="text-2xl font-semibold text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
