import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Target, Sparkles, TrendingUp, MessageSquare, ShoppingBag,
  Brain, Heart, DollarSign, MapPin, Briefcase, Globe, Send,
  Lightbulb, ArrowRight, Image as ImageIcon, Loader
} from 'lucide-react';

interface PersonaProfile {
  persona_id: string;
  name: string;
  age_range: string;
  occupation: string;
  income_level: string;
  location: string;
  interests: string[];
  values: string[];
  pain_points: string[];
  goals: string[];
  buying_behavior: string;
  preferred_channels: string[];
  decision_factors: string[];
  communication_style: string;
  content_preferences: string[];
  avatar_url?: string;
  avatar_description: string;
}

interface TargetAudienceResponse {
  audience_id: string;
  analysis_date: string;
  personas: PersonaProfile[];
  primary_segment: {
    name: string;
    size_estimate: string;
    characteristics: string[];
    rationale: string;
  };
  secondary_segments: Array<{
    name: string;
    size_estimate: string;
    potential: string;
  }>;
  estimated_audience_size?: string;
  addressable_market?: string;
  marketing_channels: string[];
  messaging_recommendations: string[];
  engagement_tactics: string[];
  confidence_level: number;
}

const TargetAudienceGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TargetAudienceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    user_id: 'current-user-id',
    business_description: '',
    product_service: '',
    country: 'US',
    generate_personas: true,
    num_personas: 3
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/v1/validation/target-audience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Target audience generation failed');
      }

      const data: TargetAudienceResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getIncomeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'very-high': return 'bg-purple-100 text-purple-800';
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Powered by GPT-4 + DALL-E 3</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Generador de Público Objetivo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create detailed customer personas with AI-generated avatars.
            Understand your audience deeply to market effectively.
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
              {/* Business Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Description *
                </label>
                <textarea
                  required
                  value={formData.business_description}
                  onChange={(e) => setFormData({ ...formData, business_description: e.target.value })}
                  placeholder="Describe your business, mission, and value proposition..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={4}
                  minLength={10}
                  maxLength={1000}
                />
              </div>

              {/* Product/Service */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product/Service *
                </label>
                <textarea
                  required
                  value={formData.product_service}
                  onChange={(e) => setFormData({ ...formData, product_service: e.target.value })}
                  placeholder="What specific product or service are you offering?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  minLength={5}
                  maxLength={500}
                />
              </div>

              {/* Country & Personas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="MX">Mexico</option>
                    <option value="AR">Argentina</option>
                    <option value="BR">Brazil</option>
                    <option value="ES">Spain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Personas
                  </label>
                  <select
                    value={formData.num_personas}
                    onChange={(e) => setFormData({ ...formData, num_personas: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value={1}>1 Persona</option>
                    <option value={2}>2 Personas</option>
                    <option value={3}>3 Personas</option>
                    <option value={4}>4 Personas</option>
                    <option value={5}>5 Personas</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.generate_personas}
                      onChange={(e) => setFormData({ ...formData, generate_personas: e.target.checked })}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Generate AI Avatars
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Generating Personas with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Target Audience</span>
                  </>
                )}
              </button>

              {formData.generate_personas && (
                <p className="text-xs text-center text-gray-500">
                  <ImageIcon className="w-3 h-3 inline mr-1" />
                  DALL-E 3 will generate unique avatar images for each persona
                </p>
              )}
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
                      Target Audience Analysis
                    </h2>
                    <p className="text-gray-600">
                      {result.personas.length} personas created •
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

                {/* Market Size */}
                {(result.estimated_audience_size || result.addressable_market) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {result.estimated_audience_size && (
                      <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Total Audience Size</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {result.estimated_audience_size}
                        </p>
                      </div>
                    )}
                    {result.addressable_market && (
                      <div className="bg-pink-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Addressable Market</p>
                        <p className="text-2xl font-bold text-pink-900">
                          {result.addressable_market}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Primary Segment */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-purple-700" />
                    <h3 className="text-lg font-bold text-gray-900">Primary Segment</h3>
                  </div>
                  <h4 className="text-xl font-bold text-purple-900 mb-2">
                    {result.primary_segment.name}
                  </h4>
                  <p className="text-gray-700 mb-3">{result.primary_segment.rationale}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Estimated Size: {result.primary_segment.size_estimate}</span>
                  </div>
                </div>
              </div>

              {/* Personas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {result.personas.map((persona, idx) => (
                  <motion.div
                    key={persona.persona_id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
                  >
                    {/* Avatar */}
                    {persona.avatar_url ? (
                      <div className="relative h-64 bg-gray-100">
                        <img
                          src={persona.avatar_url}
                          alt={persona.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold">
                          Persona #{idx + 1}
                        </div>
                      </div>
                    ) : (
                      <div className="h-64 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <Users className="w-24 h-24 text-white opacity-50" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Basic Info */}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {persona.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                            {persona.age_range}
                          </span>
                          <span className={`text-sm px-3 py-1 rounded-full ${getIncomeColor(persona.income_level)}`}>
                            {persona.income_level} income
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            <span>{persona.occupation}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{persona.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Interests */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          Interests
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {persona.interests.slice(0, 5).map((interest, i) => (
                            <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pain Points */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Brain className="w-4 h-4 text-orange-500" />
                          Pain Points
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                          {persona.pain_points.slice(0, 3).map((pain, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-orange-500 mt-0.5">•</span>
                              <span>{pain}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Goals */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          Goals
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                          {persona.goals.slice(0, 3).map((goal, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">✓</span>
                              <span>{goal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Buying Behavior */}
                      <div className="bg-blue-50 rounded-lg p-3">
                        <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2 text-sm">
                          <ShoppingBag className="w-4 h-4 text-blue-600" />
                          Buying Behavior
                        </h4>
                        <p className="text-sm text-gray-700">{persona.buying_behavior}</p>
                      </div>

                      {/* Preferred Channels */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          Preferred Channels
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {persona.preferred_channels.map((channel, i) => (
                            <span key={i} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                              {channel}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Marketing Strategy */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Marketing Channels */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Send className="w-5 h-5 text-blue-600" />
                    Marketing Channels
                  </h3>
                  <div className="space-y-2">
                    {result.marketing_channels.map((channel, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-gray-700">{channel}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Messaging Recommendations */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    Messaging Strategy
                  </h3>
                  <div className="space-y-2">
                    {result.messaging_recommendations.map((msg, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <span className="text-purple-600 mt-0.5">→</span>
                        <span className="text-gray-700">{msg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Engagement Tactics */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6" />
                  Engagement Tactics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.engagement_tactics.map((tactic, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-white/10 rounded-lg backdrop-blur">
                      <ArrowRight className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{tactic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secondary Segments */}
              {result.secondary_segments.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Secondary Segments
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.secondary_segments.map((segment, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{segment.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{segment.potential}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Users className="w-3 h-3" />
                          <span>{segment.size_estimate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TargetAudienceGenerator;
