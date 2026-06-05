"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Activity,
  ArrowRight,
  Check,
  Code,
  Shield,
  Zap,
  Sparkles,
  Terminal,
  Copy,
  ChevronDown,
  RefreshCw,
  Layers,
  Bell,
  ExternalLink,
  Globe,
  Users,
  Search,
  CheckCircle2,
  Lock,
  Cpu,
  Monitor
} from "lucide-react"

// Types & Data Interface
interface LogItem {
  id: string
  time: string
  page: string
  location: string
  device: "desktop" | "mobile" | "tablet"
  event: string
  referrer: string
}

const INITIAL_LOGS: LogItem[] = [
  { id: "1", time: "Just now", page: "/pricing", location: "San Francisco, US", device: "desktop", event: "Pageview", referrer: "Google" },
  { id: "2", time: "2s ago", page: "/", location: "London, UK", device: "mobile", event: "Pageview", referrer: "Twitter" },
  { id: "3", time: "6s ago", page: "/docs/getting-started", location: "Berlin, DE", device: "desktop", event: "Pageview", referrer: "Direct" }
]

const SAMPLE_PAGES = [
  { path: "/", views: 18240, percentage: 65, rate: "40.2%" },
  { path: "/docs/getting-started", views: 5610, percentage: 20, rate: "31.5%" },
  { path: "/pricing", views: 2805, percentage: 10, rate: "52.1%" },
  { path: "/blog/speed-matters", views: 1402, percentage: 5, rate: "28.4%" }
]

const REFERRERS = [
  { name: "Google Search", referrals: 11480, percentage: 48, icon: "Google" },
  { name: "Direct Traffic", referrals: 8130, percentage: 34, icon: "Direct" },
  { name: "GitHub Repository", referrals: 2870, percentage: 12, icon: "GitHub" },
  { name: "Twitter / X", referrals: 1435, percentage: 6, icon: "Twitter" }
]

export default function Home() {
  // Billing cycle state
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly")

  // Timeline timeframe state
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d">("7d")

  // Code Copy state
  const [copied, setCopied] = useState(false)
  const codeString = `<script 
  async 
  defer 
  data-website-id="evt_8f2a74c9" 
  src="https://cdn.eventlyticsx.com/tracker.js"
></script>`

  // Live stream log state
  const [logs, setLogs] = useState<LogItem[]>(INITIAL_LOGS)

  // Accordion active index
  const [activeFaq, setActiveFaq] = useState<number | null>(0)

  // SVG Chart path & data point computation
  // Returns relative heights for points to draw smooth chart
  const getChartDataPoints = () => {
    switch (timeframe) {
      case "24h":
        return [30, 45, 38, 55, 70, 62, 85, 78, 95, 80, 110, 120]
      case "30d":
        return [40, 50, 45, 60, 55, 75, 70, 90, 85, 105, 100, 130]
      case "7d":
      default:
        return [35, 55, 48, 72, 65, 88, 115]
    }
  }

  const chartPoints = getChartDataPoints()
  const maxVal = Math.max(...chartPoints)
  const chartHeight = 160
  const chartWidth = 500

  // Generate SVG path string
  const svgPath = chartPoints
    .map((val, idx) => {
      const x = (idx / (chartPoints.length - 1)) * chartWidth
      const y = chartHeight - (val / maxVal) * (chartHeight - 30) - 10
      return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(" ")

  // Area path for gradient fill
  const svgAreaPath = `${svgPath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`

  // Live log simulation loop
  useEffect(() => {
    const pages = ["/pricing", "/", "/docs/getting-started", "/blog/speed-matters", "/docs/api-reference", "/checkout"]
    const locations = [
      "Paris, FR",
      "Tokyo, JP",
      "Sydney, AU",
      "New York, US",
      "Toronto, CA",
      "New Delhi, IN",
      "Amsterdam, NL"
    ]
    const referrers = ["Google", "Twitter", "Direct", "HackerNews", "GitHub", "LinkedIn"]
    const devices: ("desktop" | "mobile" | "tablet")[] = ["desktop", "mobile", "tablet"]

    const interval = setInterval(() => {
      const randomPage = pages[Math.floor(Math.random() * pages.length)]
      const randomLoc = locations[Math.floor(Math.random() * locations.length)]
      const randomRef = referrers[Math.floor(Math.random() * referrers.length)]
      const randomDev = devices[Math.floor(Math.random() * devices.length)]

      const newLog: LogItem = {
        id: Math.random().toString(),
        time: "Just now",
        page: randomPage,
        location: randomLoc,
        device: randomDev,
        event: "Pageview",
        referrer: randomRef
      }

      setLogs((prevLogs) => {
        // Shift old logs and update elapsed time text
        const updated = prevLogs.map((l) => {
          if (l.time === "Just now") return { ...l, time: "3s ago" }
          if (l.time.endsWith("s ago")) {
            const secs = parseInt(l.time) + 3
            return { ...l, time: `${secs}s ago` }
          }
          return l
        })
        return [newLog, ...updated.slice(0, 4)]
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  // Value cards logic based on selected timeline
  const getOverviewMetrics = () => {
    switch (timeframe) {
      case "24h":
        return { visitors: "1,824", views: "4,512", bounce: "39.8%", duration: "2m 14s", visitorsDiff: "+12.1%", viewsDiff: "+8.4%" }
      case "30d":
        return { visitors: "58,940", views: "224,190", bounce: "41.1%", duration: "3m 02s", visitorsDiff: "+18.6%", viewsDiff: "+14.7%" }
      case "7d":
      default:
        return { visitors: "12,480", views: "48,230", bounce: "42.3%", duration: "2m 45s", visitorsDiff: "+14.2%", viewsDiff: "+8.6%" }
    }
  }

  const metrics = getOverviewMetrics()

  return (
    <div className="flex-1 bg-white">
      {/* 1. Header/Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-md shadow-blue-500/20">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-950">
              eventlytics<span className="text-blue-600">X</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
            <a href="#features" className="transition-colors hover:text-blue-600">Features</a>
            <a href="#demo" className="transition-colors hover:text-blue-600">Interactive Demo</a>
            <a href="#setup" className="transition-colors hover:text-blue-600">Quick Start</a>
            <a href="#pricing" className="transition-colors hover:text-blue-600">Pricing</a>
            <a href="#faq" className="transition-colors hover:text-blue-600">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <a href="#pricing" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 px-3 py-1.5 rounded-lg hover:bg-zinc-50">
              Log in
            </a>
            <a href="#setup" className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700 select-none">
              Start Free
            </a>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pb-24 lg:pt-28 lg:pb-32 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="absolute top-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 -z-10 h-96 w-96 rounded-full bg-blue-600/5 blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Announcement Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-blue-50/50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm animate-fade-in-up">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Introducing EventlyticsX 2.0</span>
          </div>

          {/* Heading */}
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl md:text-6xl leading-[1.15]">
            Real-time web analytics <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              without the performance bloat
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 sm:text-xl leading-relaxed">
            Privacy-first event tracking and web statistics that load in milliseconds. Under 1KB embed script, GDPR/CCPA compliant out-of-the-box, and no cookie banners required.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#setup" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700">
              Get Started for Free <ArrowRight className="ml-1.5 h-4.5 w-4.5" />
            </a>
            <a href="#demo" className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-3 text-base font-medium text-zinc-800 transition-all hover:bg-zinc-50">
              Watch Live Demo
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex items-center justify-center gap-6 text-xs font-medium text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-blue-600" /> No Card Required
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-blue-600" /> Set up in 2 Minutes
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-blue-600" /> GDPR & CCPA Compliant
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Dashboard Preview */}
      <section id="demo" className="py-16 sm:py-24 border-t border-zinc-100 bg-zinc-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
              Clean dashboard. Clear insights.
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              Explore your live traffic statistics instantly. Click the timeline tabs to test responsiveness.
            </p>
          </div>

          {/* The Dashboard Frame */}
          <div className="mx-auto max-w-5xl rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 overflow-hidden">
            {/* Mock Top bar */}
            <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="h-5 w-px bg-zinc-200" />
                <span className="text-xs font-medium text-zinc-500 select-none flex items-center gap-1.5">
                  <Monitor className="h-3.5 w-3.5" /> app.eventlyticsx.com/project_102
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-emerald-600">Live View</span>
              </div>
            </div>

            {/* Dashboard Workspace */}
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Header inside workspace */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950">Analytics Overview</h3>
                  <p className="text-xs text-zinc-500">Real-time statistics for eventlyticsx.com</p>
                </div>
                {/* Timeframe selector tabs */}
                <div className="flex rounded-lg border border-zinc-200 bg-zinc-50 p-1 self-start sm:self-auto">
                  {(["24h", "7d", "30d"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setTimeframe(tab)}
                      className={`rounded-md px-3 py-1 text-xs font-semibold capitalize transition-all select-none ${
                        timeframe === tab
                          ? "bg-white text-zinc-900 shadow-sm"
                          : "text-zinc-500 hover:text-zinc-900"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metrics cards grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1 */}
                <div className="rounded-xl border border-zinc-150 bg-zinc-50/50 p-4 transition-all hover:bg-zinc-50">
                  <span className="text-xs font-semibold text-zinc-500">Unique Visitors</span>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-2xl font-bold tracking-tight text-zinc-950">{metrics.visitors}</span>
                    <span className="text-xs font-semibold text-emerald-600">{metrics.visitorsDiff}</span>
                  </div>
                </div>
                {/* Metric 2 */}
                <div className="rounded-xl border border-zinc-150 bg-zinc-50/50 p-4 transition-all hover:bg-zinc-50">
                  <span className="text-xs font-semibold text-zinc-500">Page Views</span>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-2xl font-bold tracking-tight text-zinc-950">{metrics.views}</span>
                    <span className="text-xs font-semibold text-emerald-600">{metrics.viewsDiff}</span>
                  </div>
                </div>
                {/* Metric 3 */}
                <div className="rounded-xl border border-zinc-150 bg-zinc-50/50 p-4 transition-all hover:bg-zinc-50">
                  <span className="text-xs font-semibold text-zinc-500">Bounce Rate</span>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-2xl font-bold tracking-tight text-zinc-950">{metrics.bounce}</span>
                    <span className="text-xs font-semibold text-zinc-500">Flat</span>
                  </div>
                </div>
                {/* Metric 4 */}
                <div className="rounded-xl border border-zinc-150 bg-zinc-50/50 p-4 transition-all hover:bg-zinc-50">
                  <span className="text-xs font-semibold text-zinc-500">Avg. Duration</span>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-2xl font-bold tracking-tight text-zinc-950">{metrics.duration}</span>
                    <span className="text-xs font-semibold text-emerald-600">+4.8%</span>
                  </div>
                </div>
              </div>

              {/* Chart Block */}
              <div className="rounded-xl border border-zinc-150 p-4 sm:p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-zinc-500">Traffic Trend</span>
                  <span className="text-xs font-medium text-zinc-400">Visitor Count</span>
                </div>
                <div className="relative h-44 w-full">
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal grid lines */}
                    <line x1="0" y1="30" x2={chartWidth} y2="30" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="75" x2={chartWidth} y2="75" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="120" x2={chartWidth} y2="120" stroke="#f1f5f9" strokeWidth="1" />

                    {/* Gradient Area */}
                    <path d={svgAreaPath} fill="url(#chartGradient)" className="transition-all duration-700 ease-in-out" />

                    {/* Chart Line */}
                    <path
                      d={svgPath}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-700 ease-in-out"
                    />

                    {/* Interactive points */}
                    {chartPoints.map((val, idx) => {
                      const x = (idx / (chartPoints.length - 1)) * chartWidth
                      const y = chartHeight - (val / maxVal) * (chartHeight - 30) - 10
                      return (
                        <circle
                          key={idx}
                          cx={x}
                          cy={y}
                          r="4"
                          className="fill-white stroke-blue-600 stroke-2 hover:r-6 hover:stroke-3 transition-all duration-300 cursor-pointer"
                        />
                      )
                    })}
                  </svg>
                </div>
              </div>

              {/* Bottom detail split (Logs, Pages & Referrers) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Live Activity Stream (5 cols) */}
                <div className="lg:col-span-5 rounded-xl border border-zinc-150 p-4 bg-zinc-50/20">
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-xs font-semibold text-zinc-950 flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Live Visitor Log
                    </span>
                    <span className="text-[10px] font-medium text-zinc-400 select-none">Auto-updates</span>
                  </div>

                  <div className="space-y-2.5 min-h-[220px]">
                    {logs.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border border-zinc-100 bg-white p-2.5 shadow-sm text-xs animate-fade-in-up"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 font-medium text-zinc-800">
                            <span className="text-blue-600 font-mono">{item.page}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                            <span className="flex items-center gap-0.5"><Globe className="h-3 w-3" /> {item.location}</span>
                            <span>•</span>
                            <span>{item.referrer}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-medium whitespace-nowrap">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top pages & referrers lists (7 cols) */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Top Pages */}
                  <div className="rounded-xl border border-zinc-150 p-4 bg-white">
                    <span className="text-xs font-semibold text-zinc-950 block mb-3">Top Visited Pages</span>
                    <div className="space-y-3">
                      {SAMPLE_PAGES.map((page) => (
                        <div key={page.path} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono text-zinc-700 truncate max-w-[140px]">{page.path}</span>
                            <span className="font-semibold text-zinc-900">{page.views.toLocaleString()}</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                              style={{ width: `${page.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Referrers */}
                  <div className="rounded-xl border border-zinc-150 p-4 bg-white">
                    <span className="text-xs font-semibold text-zinc-950 block mb-3">Top Referrers</span>
                    <div className="space-y-3">
                      {REFERRERS.map((ref) => (
                        <div key={ref.name} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-700">{ref.name}</span>
                            <span className="font-semibold text-zinc-900">{ref.referrals.toLocaleString()}</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                              style={{ width: `${ref.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-16 sm:py-24 border-t border-zinc-100 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
              Powerful tools, built with simplicity in mind
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              Get the analytics data you need to grow your website, without compromises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group rounded-2xl border border-zinc-150 bg-white p-8 transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-zinc-950">Ultra-lightweight Script</h3>
              <p className="mt-2 text-zinc-600 text-sm leading-relaxed">
                Our tracker code is smaller than 1KB. It runs asynchronously, meaning it won&apos;t affect your search rankings or load performance.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-2xl border border-zinc-150 bg-white p-8 transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-zinc-950">100% Privacy Compliant</h3>
              <p className="mt-2 text-zinc-600 text-sm leading-relaxed">
                Cookies are never set or required. No personal identifiers are recorded. Everything is fully GDPR, CCPA, and PECR compliant.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-2xl border border-zinc-150 bg-white p-8 transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-zinc-950">Live Click & Event Tracking</h3>
              <p className="mt-2 text-zinc-600 text-sm leading-relaxed">
                Set up custom analytics on buttons, form submits, and signups. Track visual elements on page flows without complex instrumentation.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-2xl border border-zinc-150 bg-white p-8 transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <Code className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-zinc-950">Developer-First APIs</h3>
              <p className="mt-2 text-zinc-600 text-sm leading-relaxed">
                Query raw stats, generate custom filters, and feed analytics data into external databases. Robust documentation and client SDKs.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group rounded-2xl border border-zinc-150 bg-white p-8 transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <Bell className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-zinc-950">Automated Performance Alerts</h3>
              <p className="mt-2 text-zinc-600 text-sm leading-relaxed">
                Get reports delivered directly to your Slack workspace or email. Configure triggers for spike indicators or traffic drops.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group rounded-2xl border border-zinc-150 bg-white p-8 transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-zinc-950">Multi-site Management</h3>
              <p className="mt-2 text-zinc-600 text-sm leading-relaxed">
                Organize stats for blogs, landing pages, and SaaS portals under one clean workspace dashboard. Share reports with links.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Quick Setup Section */}
      <section id="setup" className="py-16 sm:py-24 border-t border-zinc-100 bg-zinc-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Context (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                <Terminal className="h-3.5 w-3.5" /> Getting Started
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
                Integrate in under five minutes
              </h2>
              <p className="text-zinc-600 leading-relaxed">
                Say goodbye to heavy tracking dashboards and complex configurations. Simply paste the generated script into your website&apos;s header tag.
              </p>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold mt-0.5">1</div>
                  <span className="text-sm text-zinc-600">Register your account and name your site workspace</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold mt-0.5">2</div>
                  <span className="text-sm text-zinc-600">Copy the script tag generated on your setup screen</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold mt-0.5">3</div>
                  <span className="text-sm text-zinc-600">Start watching event stats stream in live, instantly</span>
                </div>
              </div>
            </div>

            {/* Code Copy Window (7 cols) */}
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-zinc-200 bg-zinc-900 shadow-xl overflow-hidden font-mono text-sm">
                <div className="flex items-center justify-between bg-zinc-950 px-4 py-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-zinc-700" />
                    <span className="h-3 w-3 rounded-full bg-zinc-700" />
                    <span className="h-3 w-3 rounded-full bg-zinc-700" />
                    <span className="ml-1 text-[11px] font-medium text-zinc-500">layout.html</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-500 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Script</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-6 overflow-x-auto text-zinc-300">
                  <pre className="text-zinc-500 select-none">{`<!-- Paste inside <head> of your site -->`}</pre>
                  <pre className="mt-2 text-blue-400">
                    {codeString}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Pricing Section */}
      <section id="pricing" className="py-16 sm:py-24 border-t border-zinc-100 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              No hidden track fees or volume overages. Grow at your own pace.
            </p>

            {/* Annual toggle */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <span className={`text-sm font-semibold ${billingCycle === "monthly" ? "text-zinc-900" : "text-zinc-400"}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-zinc-200 transition-colors duration-200 ease-in-out focus:outline-none aria-checked:bg-blue-600"
                aria-checked={billingCycle === "yearly"}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    billingCycle === "yearly" ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={`text-sm font-semibold ${billingCycle === "yearly" ? "text-zinc-900" : "text-zinc-400"} flex items-center gap-1.5`}>
                Yearly
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xxs font-extrabold text-blue-700 shadow-sm">
                  Save 20%
                </span>
              </span>
            </div>
          </div>

          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* hobby Tier */}
            <div className="rounded-2xl border border-zinc-150 bg-white p-8 flex flex-col justify-between hover:border-zinc-250 transition-all">
              <div>
                <h3 className="text-base font-bold text-zinc-900">Hobby</h3>
                <p className="mt-2 text-xs text-zinc-500">Perfect for side projects & portfolios</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight text-zinc-950">$0</span>
                  <span className="ml-1 text-xs text-zinc-400 font-medium">/ forever</span>
                </div>

                <ul className="mt-8 space-y-3 text-xs text-zinc-600 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span>Up to 10k pageviews / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span>1 website dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span>Basic event tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span>6-month stats retention</span>
                  </li>
                </ul>
              </div>
              <a href="#setup" className="mt-8 flex w-full items-center justify-center rounded-lg border border-zinc-200 bg-white py-2 text-sm font-semibold text-zinc-800 transition-all hover:bg-zinc-50">
                Start Hobby Free
              </a>
            </div>

            {/* Pro Tier (Popular) */}
            <div className="relative rounded-2xl border-2 border-blue-600 bg-white p-8 flex flex-col justify-between shadow-lg shadow-blue-500/5 hover:-translate-y-0.5 transition-all">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3.5 py-1 text-2xs font-extrabold text-white uppercase tracking-wider select-none">
                Most Popular
              </span>

              <div>
                <h3 className="text-base font-bold text-zinc-900">Professional</h3>
                <p className="mt-2 text-xs text-zinc-500">For growing businesses & creators</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight text-zinc-950">
                    {billingCycle === "yearly" ? "$15" : "$19"}
                  </span>
                  <span className="ml-1 text-xs text-zinc-400 font-medium">/ month</span>
                </div>

                <ul className="mt-8 space-y-3 text-xs text-zinc-600 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span>Up to 150k pageviews / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span>Unlimited websites</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span>Custom conversions & goals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span>Unlimited data retention history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span>Email & Slack integration alerts</span>
                  </li>
                </ul>
              </div>
              <a href="#setup" className="mt-8 flex w-full items-center justify-center rounded-lg bg-blue-600 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700">
                Start 14-day Free Trial
              </a>
            </div>

            {/* Enterprise Tier */}
            <div className="rounded-2xl border border-zinc-150 bg-white p-8 flex flex-col justify-between hover:border-zinc-250 transition-all">
              <div>
                <h3 className="text-base font-bold text-zinc-900">Scale / Custom</h3>
                <p className="mt-2 text-xs text-zinc-500">For high traffic portals & agencies</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight text-zinc-950">Custom</span>
                </div>

                <ul className="mt-8 space-y-3 text-xs text-zinc-600 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span>Millions of monthly pageviews</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span>Dedicated database nodes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span>Custom domain proxy integrations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span>Dedicated SLA Support & Setup</span>
                  </li>
                </ul>
              </div>
              <a href="mailto:support@eventlyticsx.com" className="mt-8 flex w-full items-center justify-center rounded-lg border border-zinc-200 bg-white py-2 text-sm font-semibold text-zinc-800 transition-all hover:bg-zinc-50">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Accordion */}
      <section id="faq" className="py-16 sm:py-24 border-t border-zinc-100 bg-zinc-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              Everything you need to know about setting up privacy-first analytics.
            </p>
          </div>

          <div className="mx-auto max-w-3xl rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-4">
            {/* FAQ 1 */}
            <div className="border-b border-zinc-100 pb-4">
              <button
                onClick={() => toggleFaq(0)}
                className="flex w-full items-center justify-between text-left font-semibold text-zinc-900 hover:text-blue-600 transition-colors select-none py-2"
              >
                <span>How is EventlyticsX different from Google Analytics?</span>
                <ChevronDown className={`h-4.5 w-4.5 text-zinc-400 transition-transform ${activeFaq === 0 ? "rotate-180 text-blue-600" : ""}`} />
              </button>
              {activeFaq === 0 && (
                <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                  Unlike Google Analytics, which records detailed personal demographics and tracks users across the web with cookies, EventlyticsX is built purely for visitor tracking and conversion counting. We do not use cookies, collect personal IP addresses, or build profile dossiers, meaning you never need to display an intrusive cookie banner to your users.
                </p>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="border-b border-zinc-100 pb-4">
              <button
                onClick={() => toggleFaq(1)}
                className="flex w-full items-center justify-between text-left font-semibold text-zinc-900 hover:text-blue-600 transition-colors select-none py-2"
              >
                <span>Will the analytics script slow down my site load?</span>
                <ChevronDown className={`h-4.5 w-4.5 text-zinc-400 transition-transform ${activeFaq === 1 ? "rotate-180 text-blue-600" : ""}`} />
              </button>
              {activeFaq === 1 && (
                <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                  No. Our tracking file size is less than 1KB, which is roughly 40 times smaller than Google Analytics. It is served from global edge CDN networks and runs completely asynchronously, meaning your site continues loading normally without wait bottlenecks.
                </p>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="border-b border-zinc-100 pb-4">
              <button
                onClick={() => toggleFaq(2)}
                className="flex w-full items-center justify-between text-left font-semibold text-zinc-900 hover:text-blue-600 transition-colors select-none py-2"
              >
                <span>Is EventlyticsX compliant with GDPR, CCPA, and PECR?</span>
                <ChevronDown className={`h-4.5 w-4.5 text-zinc-400 transition-transform ${activeFaq === 2 ? "rotate-180 text-blue-600" : ""}`} />
              </button>
              {activeFaq === 2 && (
                <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                  Yes, fully compliant. We do not collect or store any personal data. All visitor statistics are generated completely anonymously, and IP addresses are run through secure cryptographic hashes and immediately discarded.
                </p>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="pb-2">
              <button
                onClick={() => toggleFaq(3)}
                className="flex w-full items-center justify-between text-left font-semibold text-zinc-900 hover:text-blue-600 transition-colors select-none py-2"
              >
                <span>Can I track custom actions like checkouts or button clicks?</span>
                <ChevronDown className={`h-4.5 w-4.5 text-zinc-400 transition-transform ${activeFaq === 3 ? "rotate-180 text-blue-600" : ""}`} />
              </button>
              {activeFaq === 3 && (
                <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                  Yes. Using standard HTML attributes or our custom JavaScript dispatch API, you can record clicks, signup actions, form submissions, and purchases in a few lines of code. Check out our client integrations guides for details.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Call To Action Banner */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl max-w-2xl mx-auto">
            Ready to track your web metrics with ease?
          </h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-xl mx-auto">
            Join thousands of developers and businesses using privacy-first analytics to grow their traffic.
          </p>
          <div className="pt-4">
            <a href="#setup" className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-bold text-blue-700 shadow-md transition-all hover:bg-zinc-100">
              Start Tracking for Free
            </a>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-zinc-950 text-zinc-400 py-12 border-t border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1 space-y-4">
              <div className="flex items-center gap-2 text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <Activity className="h-4.5 w-4.5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight">
                  eventlytics<span className="text-blue-500">X</span>
                </span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px]">
                Making web analytics lightweight, beautiful, and privacy-compliant for creators.
              </p>
            </div>

            {/* Links Column 1 */}
            <div>
              <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider block mb-4">Product</span>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Options</a></li>
                <li><a href="#setup" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            {/* Links Column 2 */}
            <div>
              <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider block mb-4">Resources</span>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#faq" className="hover:text-white transition-colors">Setup Docs</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">Privacy Guide</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">GDPR Checklist</a></li>
              </ul>
            </div>

            {/* Links Column 3 */}
            <div>
              <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider block mb-4">Company</span>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#faq" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">Customer Stories</a></li>
                <li><a href="mailto:support@eventlyticsx.com" className="hover:text-white transition-colors">Support Email</a></li>
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">GitHub <ExternalLink className="h-3 w-3" /></a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-2xs text-zinc-500">
            <span>© {new Date().getFullYear()} EventlyticsX. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="#faq" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
              <a href="#faq" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
              <a href="#faq" className="hover:text-zinc-300 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
