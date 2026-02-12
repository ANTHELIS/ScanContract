import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, FileText, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 opacity-70" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-8">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
              Now powered by Gemini AI
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight mb-8 leading-tight">
              Legal review that <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">actually makes sense</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload checks, extraction clauses, and identify hidden risks in seconds.
              The AI-powered assistant for modern legal teams and freelancers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                Start Analyzing Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 border border-gray-200 text-lg font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all">
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Companies could go here */}

      {/* Features */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why ContractScan?</h2>
            <p className="text-lg text-gray-600">Everything you need to sign with confidence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-white" />}
              color="bg-amber-500"
              title="Lightning Fast"
              description="Get a comprehensive review of your 50-page contract in under 30 seconds."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6 text-white" />}
              color="bg-indigo-600"
              title="Risk Detection"
              description="AI automatically highlights dangerous clauses, indemnities, and unusual terms."
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6 text-white" />}
              color="bg-emerald-500"
              title="Plain English"
              description="Confusing legalese is translated into simple summaries you can actually understand."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to secure your future?</h2>
          <p className="text-gray-400 text-lg mb-10">Join thousands of freelancers and founders who trust ContractScan.</p>
          <Link href="/signup" className="inline-flex items-center px-8 py-3 rounded-full bg-white text-gray-900 font-bold hover:bg-gray-100 transition-colors">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-lg group">
      <div className={`h-12 w-12 rounded-xl ${color} flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
