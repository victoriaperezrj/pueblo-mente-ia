import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Brain,
  ChevronRight,
  Download,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';

interface CashFlowPrediction {
  date: string;
  predicted_value: number;
  lower_bound: number;
  upper_bound: number;
  trend: number;
}

interface CashFlowForecast {
  forecast: CashFlowPrediction[];
  trend: string;
  seasonality_detected: boolean;
  insights: string[];
  risk_score: number;
  recommended_actions: string[];
}

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const FinancialIntelligence: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [cashFlowForecast, setCashFlowForecast] = useState<CashFlowForecast | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [timeframe, setTimeframe] = useState(12);

  // Mock historical data
  const historicalCashFlow = [
    { date: '2024-01-01', value: 50000 },
    { date: '2024-02-01', value: 55000 },
    { date: '2024-03-01', value: 52000 },
    { date: '2024-04-01', value: 60000 },
    { date: '2024-05-01', value: 58000 },
    { date: '2024-06-01', value: 65000 },
    { date: '2024-07-01', value: 70000 },
    { date: '2024-08-01', value: 68000 },
    { date: '2024-09-01', value: 75000 },
    { date: '2024-10-01', value: 72000 },
    { date: '2024-11-01', value: 80000 },
    { date: '2024-12-01', value: 85000 },
  ];

  const generateForecast = async () => {
    setLoading(true);

    // Simulate API call to ML engine
    setTimeout(() => {
      const forecast: CashFlowPrediction[] = [];
      let lastValue = historicalCashFlow[historicalCashFlow.length - 1].value;

      for (let i = 1; i <= timeframe; i++) {
        const growth = Math.random() * 0.1 - 0.02; // -2% to 8% monthly growth
        const predictedValue = lastValue * (1 + growth);
        const volatility = predictedValue * 0.15;

        forecast.push({
          date: new Date(2025, i - 1, 1).toISOString().split('T')[0],
          predicted_value: predictedValue,
          lower_bound: predictedValue - volatility,
          upper_bound: predictedValue + volatility,
          trend: predictedValue
        });

        lastValue = predictedValue;
      }

      const avgGrowth = (forecast[forecast.length - 1].predicted_value - forecast[0].predicted_value) / forecast[0].predicted_value;

      setCashFlowForecast({
        forecast,
        trend: avgGrowth > 0 ? 'upward' : 'downward',
        seasonality_detected: true,
        insights: [
          `Cash flow projected to ${avgGrowth > 0 ? 'increase' : 'decrease'} by ${Math.abs(avgGrowth * 100).toFixed(1)}%`,
          'Strong seasonal pattern detected in Q4',
          'Revenue diversification recommended for stability',
          'Maintain 3-month cash reserve for optimal security'
        ],
        risk_score: Math.random() * 40 + 20, // 20-60 risk score
        recommended_actions: [
          'Monitor cash flow weekly during growth period',
          'Accelerate receivables collection',
          'Consider strategic investments for expansion',
          'Optimize working capital management'
        ]
      });

      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    generateForecast();
  }, [timeframe]);

  // Key metrics
  const metrics: MetricCard[] = [
    {
      title: 'Current Cash Position',
      value: `${selectedCurrency} ${(85000).toLocaleString()}`,
      change: 12.5,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Monthly Revenue',
      value: `${selectedCurrency} ${(120000).toLocaleString()}`,
      change: 8.3,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Burn Rate',
      value: `${selectedCurrency} ${(35000).toLocaleString()}/mo`,
      change: -5.2,
      icon: <Activity className="w-6 h-6" />,
      color: 'from-orange-500 to-red-600'
    },
    {
      title: 'Runway',
      value: '18 months',
      change: 15.0,
      icon: <Target className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  // Combine historical + forecast data for chart
  const combinedData = [
    ...historicalCashFlow.map(d => ({
      month: new Date(d.date).toLocaleDateString('default', { month: 'short', year: '2-digit' }),
      actual: d.value,
      predicted: null,
      lower: null,
      upper: null
    })),
    ...(cashFlowForecast?.forecast.map(d => ({
      month: new Date(d.date).toLocaleDateString('default', { month: 'short', year: '2-digit' }),
      actual: null,
      predicted: Math.round(d.predicted_value),
      lower: Math.round(d.lower_bound),
      upper: Math.round(d.upper_bound)
    })) || [])
  ];

  // Risk breakdown
  const riskBreakdown = [
    { name: 'Market Risk', value: 25, color: '#ef4444' },
    { name: 'Operational Risk', value: 15, color: '#f59e0b' },
    { name: 'Financial Risk', value: 35, color: '#eab308' },
    { name: 'Compliance Risk', value: 10, color: '#84cc16' },
    { name: 'Strategic Risk', value: 15, color: '#22c55e' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Financial Intelligence</h1>
                <p className="text-purple-200">AI-Powered Predictive Analytics & Insights</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
                <option value="GBP">GBP £</option>
                <option value="JPY">JPY ¥</option>
                <option value="ARS">ARS $</option>
                <option value="MXN">MXN $</option>
                <option value="BRL">BRL R$</option>
              </select>

              <button
                onClick={generateForecast}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${metric.color} rounded-xl`}>
                  {metric.icon}
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                  metric.change > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {metric.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(metric.change)}%
                </div>
              </div>
              <h3 className="text-sm text-purple-200 mb-1">{metric.title}</h3>
              <p className="text-2xl font-bold text-white">{metric.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Cash Flow Forecast */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Cash Flow Forecast</h2>
                <p className="text-sm text-purple-200">AI-powered {timeframe}-month prediction with confidence intervals</p>
              </div>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(Number(e.target.value))}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={6}>6 Months</option>
                <option value={12}>12 Months</option>
                <option value={24}>24 Months</option>
                <option value={36}>36 Months</option>
              </select>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={combinedData}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="month" stroke="#ffffff80" />
                  <YAxis stroke="#ffffff80" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #ffffff20',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="actual" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorActual)" name="Historical" />
                  <Area type="monotone" dataKey="predicted" stroke="#ec4899" fillOpacity={1} fill="url(#colorPredicted)" name="Forecast" />
                  <Area type="monotone" dataKey="upper" stroke="#ec4899" strokeDasharray="3 3" fill="none" name="Upper Bound" />
                  <Area type="monotone" dataKey="lower" stroke="#ec4899" strokeDasharray="3 3" fill="none" name="Lower Bound" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {cashFlowForecast && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${cashFlowForecast.trend === 'upward' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-purple-200">Trend: <span className="text-white font-semibold capitalize">{cashFlowForecast.trend}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-purple-200">Seasonality: <span className="text-white font-semibold">{cashFlowForecast.seasonality_detected ? 'Detected' : 'None'}</span></span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Risk Assessment */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-xl font-bold text-white mb-4">Risk Assessment</h2>

            {cashFlowForecast && (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-purple-200">Overall Risk Score</span>
                    <span className="text-2xl font-bold text-white">{cashFlowForecast.risk_score.toFixed(0)}/100</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        cashFlowForecast.risk_score > 70 ? 'bg-red-500' :
                        cashFlowForecast.risk_score > 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${cashFlowForecast.risk_score}%` }}
                    />
                  </div>
                  <p className="text-xs text-purple-200 mt-2">
                    {cashFlowForecast.risk_score > 70 ? 'High Risk - Immediate action required' :
                     cashFlowForecast.risk_score > 40 ? 'Medium Risk - Monitor closely' :
                     'Low Risk - Financial health is good'}
                  </p>
                </div>

                <div className="h-48 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={riskBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {riskBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #ffffff20',
                          borderRadius: '8px'
                        }}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2">
                  {riskBreakdown.map((risk) => (
                    <div key={risk.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: risk.color }} />
                        <span className="text-purple-200">{risk.name}</span>
                      </div>
                      <span className="text-white font-semibold">{risk.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* AI Insights & Recommendations */}
        {cashFlowForecast && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">AI-Generated Insights</h2>
              </div>

              <div className="space-y-3">
                {cashFlowForecast.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                    <ChevronRight className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-purple-100">{insight}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recommended Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-bold text-white">Recommended Actions</h2>
              </div>

              <div className="space-y-3">
                {cashFlowForecast.recommended_actions.map((action, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="text-sm text-purple-100">{action}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialIntelligence;
