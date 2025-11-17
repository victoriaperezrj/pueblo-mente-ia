import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Zap,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  ShoppingCart,
  Users,
  Package
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

interface Product {
  id: string;
  name: string;
  current_price: number;
  cost: number;
  competitor_prices: number[];
  monthly_units: number;
}

const SmartPricing: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'p1',
      name: 'Premium Software License',
      current_price: 299,
      cost: 50,
      competitor_prices: [249, 319, 279, 289],
      monthly_units: 150
    },
    {
      id: 'p2',
      name: 'Consulting Hour',
      current_price: 120,
      cost: 40,
      competitor_prices: [100, 150, 130],
      monthly_units: 80
    },
    {
      id: 'p3',
      name: 'Enterprise Support Package',
      current_price: 999,
      cost: 200,
      competitor_prices: [899, 1099, 1049],
      monthly_units: 25
    }
  ]);

  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [optimizing, setOptimizing] = useState(false);
  const [optimization, setOptimization] = useState<any>(null);

  const runOptimization = () => {
    setOptimizing(true);

    setTimeout(() => {
      // Simulated ML pricing optimization
      const avgCompetitorPrice = selectedProduct.competitor_prices.reduce((a, b) => a + b) / selectedProduct.competitor_prices.length;
      const priceElasticity = -1.8; // Elastic demand
      const optimalPrice = selectedProduct.cost * 2.5; // Simple markup with ML adjustment

      const priceChange = ((optimalPrice - selectedProduct.current_price) / selectedProduct.current_price) * 100;
      const expectedUnits = selectedProduct.monthly_units * (1 + priceElasticity * (priceChange / 100));
      const expectedRevenue = optimalPrice * expectedUnits;
      const currentRevenue = selectedProduct.current_price * selectedProduct.monthly_units;
      const revenueImpact = ((expectedRevenue - currentRevenue) / currentRevenue) * 100;

      setOptimization({
        optimal_price: optimalPrice,
        expected_revenue: expectedRevenue,
        expected_units_sold: expectedUnits,
        price_elasticity: priceElasticity,
        revenue_impact: revenueImpact,
        confidence_score: 0.87,
        recommendations: [
          priceChange > 0 ? `Increase price by ${priceChange.toFixed(1)}% to maximize profit` : `Decrease price by ${Math.abs(priceChange).toFixed(1)}% to increase volume`,
          priceElasticity < -1 ? 'Demand is elastic - small price decreases can significantly boost volume' : 'Demand is inelastic - you have pricing power',
          optimalPrice > avgCompetitorPrice * 0.9 && optimalPrice < avgCompetitorPrice * 1.1 ? 'Optimal price is competitive with market' : 'Consider market positioning strategy',
          'Monitor competitor pricing and adjust monthly',
          'A/B test price points to refine elasticity estimates'
        ]
      });

      setOptimizing(false);
    }, 1500);
  };

  // Price sensitivity simulation data
  const priceSensitivityData = [];
  for (let price = selectedProduct.cost * 1.2; price <= selectedProduct.cost * 4; price += selectedProduct.cost * 0.2) {
    const demand = selectedProduct.monthly_units * Math.exp(-1.8 * ((price - selectedProduct.current_price) / selectedProduct.current_price));
    priceSensitivityData.push({
      price: Math.round(price),
      demand: Math.round(demand),
      revenue: Math.round(price * demand)
    });
  }

  // Competitor comparison
  const competitorData = [
    { name: 'Current', price: selectedProduct.current_price, position: 'You' },
    ...selectedProduct.competitor_prices.map((price, i) => ({
      name: `Comp ${i + 1}`,
      price,
      position: `Competitor ${i + 1}`
    }))
  ];

  const avgCompetitorPrice = selectedProduct.competitor_prices.reduce((a, b) => a + b) / selectedProduct.competitor_prices.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Smart Pricing Engine</h1>
                <p className="text-orange-200">AI-Powered Dynamic Pricing Optimization</p>
              </div>
            </div>

            <button
              onClick={runOptimization}
              disabled={optimizing}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Zap className={`w-5 h-5 ${optimizing ? 'animate-pulse' : ''}`} />
              {optimizing ? 'Optimizing...' : 'Run ML Optimization'}
            </button>
          </div>
        </motion.div>

        {/* Product Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                selectedProduct.id === product.id
                  ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500'
                  : 'bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-white">{product.name}</h3>
                <Package className="w-5 h-5 text-orange-400" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-orange-200">Current Price:</span>
                  <span className="font-semibold text-white">${product.current_price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-orange-200">Monthly Units:</span>
                  <span className="font-semibold text-white">{product.monthly_units}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-orange-200">Revenue:</span>
                  <span className="font-semibold text-white">${(product.current_price * product.monthly_units).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Current Metrics */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-sm text-orange-200 mb-4">Current Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white">Current Price</span>
                  <span className="font-bold text-white">${selectedProduct.current_price}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full"
                    style={{ width: `${(selectedProduct.current_price / (selectedProduct.cost * 5)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-orange-200 text-sm">Cost</span>
                  <span className="text-white text-sm">${selectedProduct.cost}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-orange-200 text-sm">Margin</span>
                  <span className="text-green-400 text-sm">{((1 - selectedProduct.cost / selectedProduct.current_price) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-orange-200 text-sm">Monthly Revenue</span>
                  <span className="text-white text-sm">${(selectedProduct.current_price * selectedProduct.monthly_units).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Market Position */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-sm text-orange-200 mb-4">Market Position</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white">vs. Average Competitor</span>
                  <span className={`font-bold ${selectedProduct.current_price > avgCompetitorPrice ? 'text-red-400' : 'text-green-400'}`}>
                    {((selectedProduct.current_price / avgCompetitorPrice - 1) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-orange-200">Competitor Prices:</p>
                {selectedProduct.competitor_prices.map((price, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm text-white">Competitor {i + 1}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">${price}</span>
                      {price < selectedProduct.current_price ? (
                        <TrendingDown className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Optimization Results */}
          {optimization && (
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-2xl p-6 border-2 border-orange-500/40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-orange-200">ML Recommendation</h3>
                <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                  <CheckCircle className="w-3 h-3" />
                  {(optimization.confidence_score * 100).toFixed(0)}% confidence
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white">Optimal Price</span>
                    <span className="text-2xl font-bold text-white">${optimization.optimal_price.toFixed(2)}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${optimization.revenue_impact > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {optimization.revenue_impact > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {optimization.revenue_impact.toFixed(1)}% revenue impact
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-orange-200">Expected Units</span>
                    <span className="text-white">{Math.round(optimization.expected_units_sold)}/mo</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-orange-200">Expected Revenue</span>
                    <span className="text-white">${Math.round(optimization.expected_revenue).toLocaleString()}/mo</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-200">Price Elasticity</span>
                    <span className="text-white">{optimization.price_elasticity.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Price Sensitivity Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Price Sensitivity Analysis</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceSensitivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis
                  dataKey="price"
                  stroke="#ffffff80"
                  label={{ value: 'Price ($)', position: 'insideBottom', offset: -5, fill: '#fff' }}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#ffffff80"
                  label={{ value: 'Demand (units)', angle: -90, position: 'insideLeft', fill: '#fff' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#ffffff80"
                  label={{ value: 'Revenue ($)', angle: 90, position: 'insideRight', fill: '#fff' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #ffffff20',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="demand"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Demand"
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ec4899"
                  strokeWidth={2}
                  name="Revenue"
                  dot={{ fill: '#ec4899', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Recommendations */}
        {optimization && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-bold text-white">AI Recommendations</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {optimization.recommendations.map((rec: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm text-orange-100">{rec}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SmartPricing;
