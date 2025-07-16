import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative flex h-[60vh] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-4 py-20 text-center">
      <div className="relative z-10 mx-auto max-w-4xl">
        <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl">
          Predict Flight Delays with AI Precision
        </h1>
        <p className="mb-8 text-xl text-gray-300 md:text-2xl">
          Leverage advanced machine learning to anticipate and mitigate aviation disruptions.
        </p>
        <div className="flex justify-center space-x-4">
          <Button className="group bg-blue-600 px-8 py-3 text-lg text-white shadow-lg hover:bg-blue-700">
            Get Started <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            variant="outline"
            className="border-gray-600 px-8 py-3 text-lg text-gray-300 hover:bg-gray-800 bg-transparent"
          >
            Learn More
          </Button>
        </div>
      </div>
      {/* Abstract background elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute -left-1/4 -top-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500 blur-3xl" />
        <div className="absolute -right-1/4 -bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500 blur-3xl animation-delay-2000" />
      </div>
    </section>
  )
}
