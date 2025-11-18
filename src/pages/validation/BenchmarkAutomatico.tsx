import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, TrendingUp, DollarSign, Users, Award, AlertCircle,
  CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, Minus,
  Target, Lightbulb, Shield, Zap, BarChart, Globe, Star
} from 'lucide-react';

interface CompetitorAnalysis {
  name: string;
  website?: string;
  strengths: string[];
  weaknesses: string[];
  key_features: string[];
  pricing_model?: string;
  estimated_market_share?: string;
  customer_sentiment?: string;
}

interface BenchmarkResponse {
  benchmark_id: string;
  industry: string;
  analysis_date: string;
  competitors_analyzed: CompetitorAnalysis[];
  total_competitors_found: number;
  market_gap_opportunities: string[];
  differentiation_strategies: string[];
  pricing_recommendations: {
    strategy: string;
    min_price?: number;
    recommended_price?: number;
    premium_price?: number;
  };
  industry_trends: string[];
  best_practices: string[];
  warnings: string[];
  data_sources: string[];
  confidence_level: number;
}

const BenchmarkAutomatico: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BenchmarkResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    user_id: 'current-user-id',
    industry: '',
    competitors: [] as string[],
    auto_discover: true,
    country: 'US',
    analysis_depth: 'standard'
  });

  const [competitorInput, setCompetitorInput] = useState('');

  const addCompetitor = () => {
    if (competitorInput.trim()) {
      setFormData({
        ...formData,
        competitors: [...formData.competitors, competitorInput.trim()]
      });
      setCompetitorInput('');
    }
  };

  const removeCompetitor = (index: number) => {
    setFormData({
      ...formData,
      competitors: formData.competitors.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/v1/validation/benchmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Benchmark analysis failed');
      }

      const data: BenchmarkResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return <ArrowUpRight className="w-5 h-5 text-green-600" />;
      case 'negative':
        return <ArrowDownRight className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'negative':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-4">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold">AI-Powered Competitive Intelligence</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Benchmark Automático
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Analyze your competitors automatically with web scraping + GPT-4.
            Discover market gaps and differentiation opportunities.
          </p>
        </motion.div>

        {/* Form */}
        {!result && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <div className="space-y-6">
              {/* Industry */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Industry/Sector *
                </label>
                <input
                  type="text"
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="Example: E-commerce Fashion, SaaS Marketing Tools, Food Delivery, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  minLength={3}
                  maxLength={200}
                />
              </div>

              {/* Competitors */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Competitors (Optional)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={competitorInput}
                    onChange={(e) => setCompetitorInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCompetitor())}
                    placeholder="Add competitor name or website URL"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addCompetitor}
                    className="px-6 py-3 bg-emerald-100 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-200 transition"
                  >
                    Add
                  </button>
                </div>

                {formData.competitors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.competitors.map((comp, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full"
                      >
                        <span className="text-sm">{comp}</span>
                        <button
                          type="button"
                          onClick={() => removeCompetitor(idx)}
                          className="text-emerald-600 hover:text-emerald-800"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  Leave empty to auto-discover competitors using AI
                </p>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="MX">Mexico</option>
                    <option value="BR">Brazil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Analysis Depth
                  </label>
                  <select
                    value={formData.analysis_depth}
                    onChange={(e) => setFormData({ ...formData, analysis_depth: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="quick">Quick (~2 min)</option>
                    <option value="standard">Standard (~5 min)</option>
                    <option value="deep">Deep (~10 min)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.auto_discover}
                      onChange={(e) => setFormData({ ...formData, auto_discover: e.target.checked })}
                      className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Auto-discover competitors
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing Competitors...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Start Competitive Analysis</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Competitive Benchmark Analysis
                    </h2>
                    <p className="text-gray-600">
                      {result.industry} • {result.competitors_analyzed.length} competitors analyzed •
                      Confidence: {(result.confidence_level * 100).toFixed(0)}%
                    </p>
                  </div>
                  <button
                    onClick={() => setResult(null)}
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    New Analysis
                  </button>
                </div>

                {/* Data Sources */}
                <div className="flex flex-wrap gap-2">
                  {result.data_sources.map((source, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {source}
                    </span>
                  ))}
                </div>
              </div>

              {/* Competitors Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {result.competitors_analyzed.map((competitor, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-2xl shadow-xl p-6"
                  >
                    {/* Competitor Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {competitor.name}
                        </h3>
                        {competitor.website && (
                          <a
                            href={competitor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Globe className="w-3 h-3" />
                            {competitor.website}
                          </a>
                        )}
                      </div>
                      {competitor.customer_sentiment && (
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full border ${getSentimentColor(competitor.customer_sentiment)}`}>
                          {getSentimentIcon(competitor.customer_sentiment)}
                          <span className="text-xs font-semibold capitalize">
                            {competitor.customer_sentiment}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Market Share & Pricing */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {competitor.estimated_market_share && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">Market Share</p>
                          <p className="font-bold text-blue-900">{competitor.estimated_market_share}</p>
                        </div>
                      )}
                      {competitor.pricing_model && (
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">Pricing</p>
                          <p className="font-bold text-green-900 text-sm">{competitor.pricing_model}</p>
                        </div>
                      )}
                    </div>

                    {/* Strengths */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {competitor.strengths.map((strength, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">+</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-red-600" />
                        Weaknesses
                      </h4>
                      <ul className="space-y-1">
                        {competitor.weaknesses.map((weakness, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-red-600 mt-0.5">-</span>
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Features */}
                    {competitor.key_features.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          Key Features
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {competitor.key_features.slice(0, 6).map((feature, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Market Gaps & Differentiation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Market Gaps */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-600" />
                    Market Gap Opportunities
                  </h3>
                  <div className="space-y-3">
                    {result.market_gap_opportunities.map((gap, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                        <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <p className="text-gray-700">{gap}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Differentiation Strategies */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-600" />
                    Differentiation Strategies
                  </h3>
                  <div className="space-y-3">
                    {result.differentiation_strategies.map((strategy, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <p className="text-gray-700">{strategy}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing Recommendations */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Pricing Recommendations
                </h3>
                <p className="text-gray-700 mb-6">{result.pricing_recommendations.strategy}</p>

                {(result.pricing_recommendations.min_price !== undefined ||
                  result.pricing_recommendations.recommended_price !== undefined ||
                  result.pricing_recommendations.premium_price !== undefined) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.pricing_recommendations.min_price !== undefined && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Minimum Price</p>
                        <p className="text-2xl font-bold text-blue-900">
                          ${result.pricing_recommendations.min_price.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {result.pricing_recommendations.recommended_price !== undefined && (
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Recommended Price</p>
                        <p className="text-2xl font-bold text-green-900">
                          ${result.pricing_recommendations.recommended_price.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {result.pricing_recommendations.premium_price !== undefined && (
                      <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Premium Price</p>
                        <p className="text-2xl font-bold text-purple-900">
                          ${result.pricing_recommendations.premium_price.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Industry Trends & Best Practices */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Industry Trends */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Industry Trends
                  </h3>
                  <ul className="space-y-2">
                    {result.industry_trends.map((trend, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-blue-600 mt-1">→</span>
                        <span>{trend}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Best Practices */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    Best Practices
                  </h3>
                  <ul className="space-y-2">
                    {result.best_practices.map((practice, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span>{practice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Warnings & Pitfalls to Avoid
                  </h3>
                  <ul className="space-y-2">
                    {result.warnings.map((warning, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-red-600 mt-1">⚠</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BenchmarkAutomatico;
