import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Brain, Database, Zap } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Brain,
      title: "Machine Learning Models",
      description: "Advanced Random Forest and Gradient Boosting algorithms for accurate predictions",
      color: "text-blue-400",
    },
    {
      icon: Database,
      title: "Comprehensive Data",
      description: "Analysis of carriers, airports, weather conditions, and operational factors",
      color: "text-purple-400",
    },
    {
      icon: BarChart3,
      title: "Detailed Insights",
      description: "Monthly trends, carrier performance, and airport-specific delay patterns",
      color: "text-green-400",
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Instant predictions with customizable severity parameters",
      color: "text-yellow-400",
    },
  ]

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4 md:text-4xl">Advanced Aviation Analytics</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Powered by cutting-edge machine learning technology and comprehensive aviation data
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardHeader className="text-center">
                <div className="mb-4 flex justify-center">
                  <feature.icon className={`h-10 w-10 ${feature.color}`} />
                </div>
                <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-400 text-center">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
