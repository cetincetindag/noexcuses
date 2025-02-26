import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { CheckCircle, Target, TrendingUp, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="py-20 text-center bg-gradient-to-b from-brand-purple to-brand-pink text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-4 animate-fade-in-up">Track Your Habits, Transform Your Life</h2>
            <p className="text-xl mb-8 animate-fade-in-up animation-delay-200">
              No more excuses. Start building better habits today.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-white text-black hover:bg-gray-100 transition-colors animate-bounce-subtle"
            >
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </section>

        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-blue-700">Key Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Goal Setting",
                  description: "Set and track your personal goals",
                  icon: Target,
                  color: "text-blue-600",
                },
                {
                  title: "Progress Tracking",
                  description: "Visualize your habit-forming journey",
                  icon: TrendingUp,
                  color: "text-purple-600",
                },
                {
                  title: "Daily Reminders",
                  description: "Never miss a day with custom reminders",
                  icon: CheckCircle,
                  color: "text-pink-500",
                },
                {
                  title: "Community Support",
                  description: "Connect with others on similar journeys",
                  icon: Users,
                  color: "text-green-500",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-shadow duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <feature.icon
                      className={`w-10 h-10 ${feature.color} mb-2 group-hover:scale-110 transition-transform duration-300`}
                    />
                    <CardTitle className={feature.color}>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} noexcuses. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}


