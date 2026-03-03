import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse-glow"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-slate-200/50 bg-white/70 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FleetMitra
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Solutions', 'Pricing', 'About'].map((item, index) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
              >
                Log in
              </Link>
              <Link 
                href="/register" 
                className="relative px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:shadow-xl hover:shadow-blue-500/30 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200/50">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                <span className="text-xs font-medium text-blue-700">Trusted by 10,000+ companies</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Transform Your{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Fleet Operations
                </span>
                <br />
                with AI-Powered Intelligence
              </h1>
              
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                Experience the future of fleet management with real-time tracking, predictive analytics, and automated compliance. Reduce costs by up to 40%.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all transform hover:scale-105"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="#demo"
                  className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Watch Demo</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Link>
              </div>
              
              <div className="flex items-center gap-6 pt-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white shadow-lg"
                    />
                  ))}
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">10,000+</div>
                  <div className="text-sm text-slate-600">Happy customers worldwide</div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-8 transform hover:scale-105 transition-all duration-500">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: "🚛", label: "Real-time Tracking", color: "from-blue-500 to-blue-600" },
                    { icon: "📊", label: "AI Analytics", color: "from-purple-500 to-purple-600" },
                    { icon: "💰", label: "Cost Optimization", color: "from-green-500 to-green-600" },
                    { icon: "🔔", label: "Smart Alerts", color: "from-orange-500 to-orange-600" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all group hover:shadow-xl"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <span className="text-2xl">{item.icon}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900">{item.label}</h3>
                      <p className="text-xs text-slate-500 mt-1">Powered by AI</p>
                    </div>
                  ))}
                </div>
                
                {/* Stats */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">99.9%</div>
                      <div className="text-xs text-slate-600">Uptime SLA</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">40%</div>
                      <div className="text-xs text-slate-600">Cost Reduction</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">24/7</div>
                      <div className="text-xs text-slate-600">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-y border-slate-200/50 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <p className="text-sm text-slate-500 text-center mb-8 uppercase tracking-wider">Trusted by industry leaders</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-slate-400 font-bold text-2xl opacity-50 hover:opacity-100 transition-opacity">
                LOGO {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Scale Your Fleet
              </span>
            </h2>
            <p className="text-lg text-slate-600">
              Powerful tools that help you manage, optimize, and grow your fleet operations seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🚛",
                title: "Real-time Tracking",
                description: "Live GPS tracking with geofencing and route optimization",
                color: "from-blue-500 to-blue-600",
                stats: "99.9% accuracy"
              },
              {
                icon: "📊",
                title: "Predictive Analytics",
                description: "AI-powered insights to predict maintenance and optimize routes",
                color: "from-purple-500 to-purple-600",
                stats: "40% cost reduction"
              },
              {
                icon: "🔔",
                title: "Smart Alerts",
                description: "Automated notifications for maintenance, expiry, and violations",
                color: "from-orange-500 to-orange-600",
                stats: "Real-time alerts"
              },
              {
                icon: "📄",
                title: "Document AI",
                description: "Intelligent document processing with expiry tracking",
                color: "from-green-500 to-green-600",
                stats: "Zero missed renewals"
              },
              {
                icon: "💰",
                title: "Financial Insights",
                description: "Comprehensive expense tracking and profitability analysis",
                color: "from-pink-500 to-pink-600",
                stats: "Full financial control"
              },
              {
                icon: "👥",
                title: "Driver Performance",
                description: "Monitor driver behavior, efficiency, and compliance",
                color: "from-indigo-500 to-indigo-600",
                stats: "Performance scoring"
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-8 hover:border-blue-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 mb-4">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600">{feature.stats}</span>
                  <span className="text-blue-600 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="absolute inset-0 bg-white/10" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Vehicles", icon: "🚛" },
              { value: "5K+", label: "Drivers", icon: "👤" },
              { value: "50K+", label: "Trips", icon: "🗺️" },
              { value: "99.9%", label: "Uptime", icon: "⚡" },
            ].map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-white/80 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Loved by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Fleet Managers</span>
            </h2>
            <p className="text-lg text-slate-600">
              See what industry leaders say about their experience with FleetMitra.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "FleetMitra has revolutionized our operations. We've seen a 40% reduction in costs and 99.9% uptime.",
                author: "Rajesh Kumar",
                role: "Fleet Manager, ABC Transport",
                rating: 5,
                image: "RK"
              },
              {
                quote: "The AI-powered predictive maintenance saved us from countless breakdowns. Absolutely game-changing!",
                author: "Priya Sharma",
                role: "Operations Director, XYZ Logistics",
                rating: 5,
                image: "PS"
              },
              {
                quote: "Best investment we've made. The ROI was visible within the first 3 months of implementation.",
                author: "Amit Patel",
                role: "CEO, Patel Transport",
                rating: 5,
                image: "AP"
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-8 hover:border-blue-300 hover:shadow-2xl transition-all"
              >
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.image}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Pricing</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Simple, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Transparent</span> Pricing
            </h2>
            <p className="text-lg text-slate-600">
              Choose the perfect plan for your fleet size. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="group bg-white rounded-2xl border border-slate-200 p-8 hover:border-blue-300 hover:shadow-2xl transition-all relative">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
              <p className="text-sm text-slate-600 mb-4">For small fleets</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">₹2,999</span>
                <span className="text-slate-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Up to 10 vehicles",
                  "Basic tracking",
                  "Email support",
                  "Basic analytics",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center py-3 px-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="group bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl scale-105 relative border-2 border-white">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-white text-blue-600 text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                  BEST VALUE
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
              <p className="text-sm text-white/80 mb-4">For growing fleets</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">₹5,999</span>
                <span className="text-white/80">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Up to 50 vehicles",
                  "Advanced tracking",
                  "Priority support",
                  "AI analytics",
                  "API access",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-white">
                    <svg className="w-4 h-4 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center py-3 px-4 bg-white text-blue-600 font-medium rounded-xl hover:bg-slate-100 transition-colors shadow-xl"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="group bg-white rounded-2xl border border-slate-200 p-8 hover:border-blue-300 hover:shadow-2xl transition-all">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
              <p className="text-sm text-slate-600 mb-4">For large fleets</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited vehicles",
                  "Custom integrations",
                  "24/7 phone support",
                  "SLA guarantee",
                  "Dedicated account manager",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="block text-center py-3 px-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10" style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}></div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Fleet?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of companies already using FleetMitra to optimize their fleet operations.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all group"
              >
                Start Your Free Trial
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-sm text-white/80 mt-4">
                No credit card required · 14-day free trial
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">F</span>
                </div>
                <span className="text-lg font-bold">FleetMitra</span>
              </div>
              <p className="text-sm text-slate-400">
                The future of fleet management, today.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#demo" className="hover:text-white transition-colors">Demo</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#press" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#privacy" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#terms" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#compliance" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            © 2024 FleetMitra. All rights reserved. Made with ❤️ for fleet managers worldwide.
          </div>
        </div>
      </footer>
    </div>
  )
}