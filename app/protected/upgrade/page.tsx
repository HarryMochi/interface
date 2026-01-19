"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "5 Quizzes per month",
      "5 Flashcard sets per month",
      "20 AI Tutor messages",
      "Basic Analytics",
      "Email Support",
    ],
    limitations: [
      "Limited quiz questions",
      "No export feature",
      "Standard response time",
    ],
    current: true,
    cta: "Current Plan",
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "per month",
    yearlyPrice: "$99.99/year (save 17%)",
    features: [
      "100 Quizzes per month",
      "100 Flashcard sets per month",
      "500 AI Tutor messages",
      "Advanced Analytics",
      "Export Results (CSV, PDF)",
      "Priority Support",
      "Custom Study Plans",
      "Performance Insights",
    ],
    limitations: [],
    current: false,
    cta: "Upgrade to Premium",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$29.99",
    period: "per month",
    yearlyPrice: "$299.99/year (save 17%)",
    features: [
      "Unlimited Quizzes",
      "Unlimited Flashcards",
      "Unlimited AI Tutor",
      "Everything in Premium",
      "API Access",
      "Custom Branding",
      "Team Management",
      "Dedicated Support",
      "SLA Guarantee",
    ],
    limitations: [],
    current: false,
    cta: "Contact Sales",
  },
]

export default function UpgradePage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [currentPlan, setCurrentPlan] = useState("free")

  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await fetch("/api/usage")
        if (res.ok) {
          const data = await res.json()
          setCurrentPlan(data.subscription?.plan_type || "free")
        }
      } catch (error) {
        console.error("Error fetching plan:", error)
      }
    }
    fetchPlan()
  }, [])

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/protected"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white font-mono text-sm mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-mono uppercase tracking-wider mb-4">
            Upgrade Your Plan
          </h1>
          <p className="text-white/60 font-mono max-w-2xl">
            Unlock more quizzes, flashcards, and AI tutor interactions. Choose the plan that fits your learning goals.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 font-mono text-sm uppercase tracking-wider transition-colors ${
              billingCycle === "monthly"
                ? "bg-[#c9a45c] text-black"
                : "border border-white/20 text-white/60 hover:border-white/40"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 py-2 font-mono text-sm uppercase tracking-wider transition-colors ${
              billingCycle === "yearly"
                ? "bg-[#c9a45c] text-black"
                : "border border-white/20 text-white/60 hover:border-white/40"
            }`}
          >
            Yearly
            <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5">
              Save 17%
            </span>
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = plan.name.toLowerCase() === currentPlan

            return (
              <div
                key={plan.name}
                className={`relative border p-6 flex flex-col ${
                  plan.popular
                    ? "border-[#c9a45c]"
                    : "border-white/10"
                } ${isCurrentPlan ? "bg-white/5" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c9a45c] text-black px-4 py-1 text-xs font-mono uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-xl font-mono uppercase tracking-wider mb-2">{plan.name}</h2>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-mono">
                      {billingCycle === "yearly" && plan.yearlyPrice
                        ? plan.yearlyPrice.split("/")[0]
                        : plan.price}
                    </span>
                    <span className="text-white/50 font-mono text-sm">
                      {billingCycle === "yearly" && plan.yearlyPrice ? "/year" : plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm font-mono">
                      <svg
                        className="w-5 h-5 text-[#c9a45c] flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation) => (
                    <li key={limitation} className="flex items-start gap-2 text-sm font-mono">
                      <svg
                        className="w-5 h-5 text-white/30 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span className="text-white/40">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <button
                  disabled={isCurrentPlan}
                  className={`w-full py-3 font-mono text-sm uppercase tracking-wider transition-colors ${
                    isCurrentPlan
                      ? "border border-white/20 text-white/40 cursor-not-allowed"
                      : plan.popular
                        ? "bg-[#c9a45c] text-black hover:bg-[#d4af63]"
                        : "border border-[#c9a45c] text-[#c9a45c] hover:bg-[#c9a45c] hover:text-black"
                  }`}
                >
                  {isCurrentPlan ? "Current Plan" : plan.cta}
                </button>
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 border-t border-white/10 pt-10">
          <h2 className="text-2xl font-mono uppercase tracking-wider mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="border border-white/10 p-6">
              <h3 className="font-mono uppercase tracking-wider mb-2 text-[#c9a45c]">
                What happens when I reach my limit?
              </h3>
              <p className="text-white/60 font-mono text-sm">
                When you reach your monthly limit, you won't be able to generate new quizzes or flashcards until the next billing cycle or until you upgrade your plan.
              </p>
            </div>
            <div className="border border-white/10 p-6">
              <h3 className="font-mono uppercase tracking-wider mb-2 text-[#c9a45c]">
                Can I cancel anytime?
              </h3>
              <p className="text-white/60 font-mono text-sm">
                Yes! You can cancel your subscription at any time. Your access will continue until the end of your current billing period.
              </p>
            </div>
            <div className="border border-white/10 p-6">
              <h3 className="font-mono uppercase tracking-wider mb-2 text-[#c9a45c]">
                When does my usage reset?
              </h3>
              <p className="text-white/60 font-mono text-sm">
                Your usage resets every 30 days from when you created your account. You can see the exact reset date in your dashboard.
              </p>
            </div>
            <div className="border border-white/10 p-6">
              <h3 className="font-mono uppercase tracking-wider mb-2 text-[#c9a45c]">
                Do you offer refunds?
              </h3>
              <p className="text-white/60 font-mono text-sm">
                Yes, we offer a 14-day money-back guarantee. If you're not satisfied, contact our support team for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
