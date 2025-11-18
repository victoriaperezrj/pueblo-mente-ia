import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Target, DollarSign, Globe, Zap, AlertTriangle,
  CheckCircle, XCircle, TrendingDown, Lightbulb, ArrowRight,
  BarChart3, PieChart, Activity, Rocket, Shield, Clock
} from 'lucide-react';

interface MarketTestRequest {
  user_id: string;
  business_id?: string;
  idea_description: string;
  target_market: string;
  initial_investment?: number;
  currency: string;
  country: string;
  industry?: string;
}

interface MarketTestResponse {
  test_id: string;
  viability_score: number;
  market_size: 'niche' | 'small' | 'medium' | 'large' | 'massive';
  market_size_description: string;
  competition_level: string;
  risk_level: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  recommendations: string[];
  next_steps: string[];
  estimated_market_size_usd?: number;
  estimated_startup_cost?: {
    minimum: number;
    realistic: number;
    optimal: number;
    breakdown: Record<string, number>;
  };
  revenue_potential?: string;
  time_to_market?: string;
  analysis_date: string;
  gpt_model_used: string;
  confidence_level: number;
}

const MarketTestExpress: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MarketTestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<MarketTestRequest>({
    user_id: 'current-user-id', // TODO: Get from auth context
    idea_description: '',
    target_market: '',
    initial_investment: undefined,
    currency: 'USD',
    country: 'US',
    industry: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/v1/validation/market-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Market analysis failed');
      }

      const data: MarketTestResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 75) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getMarketSizeIcon = (size: string) => {
    switch (size) {
      case 'massive': return <Globe className="w-6 h-6" />;
      case 'large': return <TrendingUp className="w-6 h-6" />;
      case 'medium': return <BarChart3 className="w-6 h-6" />;
      case 'small': return <PieChart className="w-6 h-6" />;
      default: return <Target className="w-6 h-6" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold">Powered by GPT-4</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Market Test Express
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get AI-powered market viability analysis in seconds.
            Validate your business idea before investing time and money.
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
              {/* Idea Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Describe Your Business Idea *
                </label>
                <textarea
                  required
                  value={formData.idea_description}
                  onChange={(e) => setFormData({ ...formData, idea_description: e.target.value })}
                  placeholder="Example: A mobile app that connects local farmers directly with restaurants, eliminating middlemen and ensuring fresh produce delivery within 24 hours..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={5}
                  minLength={10}
                  maxLength={2000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.idea_description.length}/2000 characters
                </p>
              </div>

              {/* Target Market */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Market *
                </label>
                <input
                  type="text"
                  required
                  value={formData.target_market}
                  onChange={(e) => setFormData({ ...formData, target_market: e.target.value })}
                  placeholder="Example: Eco-conscious millennials in urban areas with disposable income"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  minLength={3}
                  maxLength={500}
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Industry/Sector
                </label>
                <input
                  type="text"
                  value={formData.industry || ''}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="Example: Food Tech, E-commerce, SaaS, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Country & Investment */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="ES">Spain</option>
                    <option value="MX">Mexico</option>
                    <option value="AR">Argentina</option>
                    <option value="BR">Brazil</option>
                    <option value="CL">Chile</option>
                    <option value="CO">Colombia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                    <option value="MXN">MXN ($)</option>
                    <option value="ARS">ARS ($)</option>
                    <option value="BRL">BRL (R$)</option>
                    <option value="CLP">CLP ($)</option>
                    <option value="COP">COP ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Initial Investment
                  </label>
                  <input
                    type="number"
                    value={formData.initial_investment || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      initial_investment: e.target.value ? parseFloat(e.target.value) : undefined
                    })}
                    placeholder="10000"
                    min="0"
                    step="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing with AI...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    <span>Analyze Market Viability</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Analysis Failed</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Header with Score */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Market Analysis Results
                    </h2>
                    <p className="text-gray-600">
                      Analyzed by {result.gpt_model_used} •
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

                {/* Viability Score */}
                <div className={`${getScoreBgColor(result.viability_score)} rounded-xl p-6 mb-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-1">
                        Viability Score
                      </h3>
                      <p className={`text-5xl font-bold ${getScoreColor(result.viability_score)}`}>
                        {result.viability_score.toFixed(1)}
                        <span className="text-2xl">/100</span>
                      </p>
                    </div>
                    <Activity className={`w-16 h-16 ${getScoreColor(result.viability_score)}`} />
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      {getMarketSizeIcon(result.market_size)}
                      <span className="font-semibold text-gray-700">Market Size</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 capitalize">
                      {result.market_size}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {result.market_size_description}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-6 h-6" />
                      <span className="font-semibold text-gray-700">Competition</span>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(result.competition_level)}`}>
                      {result.competition_level}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="w-6 h-6" />
                      <span className="font-semibold text-gray-700">Risk Level</span>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(result.risk_level)}`}>
                      {result.risk_level}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Estimates */}
              {result.estimated_startup_cost && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    Financial Estimates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Minimum Investment</p>
                      <p className="text-2xl font-bold text-blue-900">
                        ${result.estimated_startup_cost.minimum.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Realistic Investment</p>
                      <p className="text-2xl font-bold text-green-900">
                        ${result.estimated_startup_cost.realistic.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Optimal Investment</p>
                      <p className="text-2xl font-bold text-purple-900">
                        ${result.estimated_startup_cost.optimal.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {result.revenue_potential && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600 mb-1">Revenue Potential</p>
                      <p className="text-lg font-semibold text-gray-900">{result.revenue_potential}</p>
                    </div>
                  )}

                  {result.time_to_market && (
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Time to Market</p>
                        <p className="font-semibold text-gray-900">{result.time_to_market}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SWOT Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {result.strengths.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    Weaknesses
                  </h3>
                  <ul className="space-y-2">
                    {result.weaknesses.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-red-600 mt-1">✗</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Opportunities */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Opportunities
                  </h3>
                  <ul className="space-y-2">
                    {result.opportunities.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-blue-600 mt-1">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Threats */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-orange-600" />
                    Threats
                  </h3>
                  <ul className="space-y-2">
                    {result.threats.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-orange-600 mt-1">⚠</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                  AI Recommendations
                </h3>
                <div className="space-y-3">
                  {result.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      <p className="text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ArrowRight className="w-6 h-6" />
                  Next Steps
                </h3>
                <div className="space-y-3">
                  {result.next_steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-white/10 rounded-lg backdrop-blur">
                      <span className="flex-shrink-0 w-6 h-6 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MarketTestExpress;
