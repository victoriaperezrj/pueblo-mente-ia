import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Sparkles,
  Package,
  Target,
  BarChart3,
  Loader2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  cost_price: number;
  selling_price: number;
  category: string;
}

interface PriceRecommendation {
  recommended_price: number;
  current_margin: number;
  recommended_margin: number;
  reasoning: string;
  competitive_analysis: string;
  demand_elasticity: string;
  action_items: string[];
}

export default function PriceOptimizer() {
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useCustomToast();
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [recommendation, setRecommendation] = useState<PriceRecommendation | null>(null);
  
  const [analysisData, setAnalysisData] = useState({
    market_conditions: '',
    competitor_prices: '',
    target_segment: '',
    seasonal_factors: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (!businesses) {
        setLoading(false);
        return;
      }

      setBusinessId(businesses.id);

      const { data: productsData, error } = await supabase
        .from('products')
        .select('id, name, cost_price, selling_price, category')
        .eq('business_id', businesses.id)
        .eq('active', true)
        .order('name');

      if (error) throw error;

      setProducts(productsData || []);
    } catch (error) {
      console.error('Error loading products:', error);
      showToast('Error al cargar productos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzePrice = async () => {
    if (!selectedProduct) {
      showToast('Selecciona un producto', 'error');
      return;
    }

    setAnalyzing(true);
    setRecommendation(null);

    try {
      const { data, error } = await supabase.functions.invoke('optimize-price', {
        body: {
          product: {
            name: selectedProduct.name,
            current_price: selectedProduct.selling_price,
            cost_price: selectedProduct.cost_price,
            category: selectedProduct.category
          },
          analysis: analysisData
        }
      });

      if (error) throw error;

      setRecommendation(data);
      showToast('Análisis completado', 'success');
    } catch (error: any) {
      console.error('Error analyzing price:', error);
      showToast(error.message || 'Error al analizar precio', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApplyPrice = async () => {
    if (!selectedProduct || !recommendation) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({ selling_price: recommendation.recommended_price })
        .eq('id', selectedProduct.id);

      if (error) throw error;

      showToast('Precio actualizado exitosamente', 'success');
      loadProducts();
      setSelectedProduct(null);
      setRecommendation(null);
    } catch (error) {
      console.error('Error updating price:', error);
      showToast('Error al actualizar precio', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary">
      {ToastComponent}
      
      <div className="container mx-auto p-6 space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-text-primary mb-2 flex items-center gap-3">
              <Sparkles className="w-10 h-10 text-purple-500" />
              Optimizador de Precios con IA
            </h1>
            <p className="text-text-secondary">
              Maximiza tus ganancias con recomendaciones inteligentes de precios
            </p>
          </div>
          <Button onClick={() => navigate('/business/dashboard')}>
            Volver
          </Button>
        </div>

        {/* Info Card */}
        <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary mb-2">
                ¿Cómo funciona?
              </h3>
              <p className="text-text-secondary mb-4">
                Nuestra IA analiza tu producto, costos, competencia y condiciones de mercado para 
                recomendarte el precio óptimo que maximice tus ganancias sin perder clientes.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Análisis de Competencia</Badge>
                <Badge variant="secondary">Elasticidad de Demanda</Badge>
                <Badge variant="secondary">Optimización de Márgenes</Badge>
                <Badge variant="secondary">Factores Estacionales</Badge>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Datos del Análisis
            </h2>

            <div className="space-y-6">
              <div>
                <Label>Producto *</Label>
                <Select
                  value={selectedProduct?.id || ''}
                  onValueChange={(id) => {
                    const product = products.find(p => p.id === id);
                    setSelectedProduct(product || null);
                    setRecommendation(null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - ${product.selling_price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProduct && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Precio Actual:</span>
                    <span className="font-bold">${selectedProduct.selling_price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Costo:</span>
                    <span className="font-bold">${selectedProduct.cost_price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Margen Actual:</span>
                    <span className="font-bold text-business-500">
                      {((1 - selectedProduct.cost_price / selectedProduct.selling_price) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}

              <div>
                <Label>Condiciones del Mercado</Label>
                <Textarea
                  value={analysisData.market_conditions}
                  onChange={(e) => setAnalysisData({ ...analysisData, market_conditions: e.target.value })}
                  placeholder="Ej: Alta demanda en temporada alta, economía estable..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Precios de Competencia</Label>
                <Textarea
                  value={analysisData.competitor_prices}
                  onChange={(e) => setAnalysisData({ ...analysisData, competitor_prices: e.target.value })}
                  placeholder="Ej: Competidor A: $500, Competidor B: $450..."
                  rows={2}
                />
              </div>

              <div>
                <Label>Segmento Objetivo</Label>
                <Input
                  value={analysisData.target_segment}
                  onChange={(e) => setAnalysisData({ ...analysisData, target_segment: e.target.value })}
                  placeholder="Ej: Clase media-alta, 25-45 años..."
                />
              </div>

              <div>
                <Label>Factores Estacionales</Label>
                <Input
                  value={analysisData.seasonal_factors}
                  onChange={(e) => setAnalysisData({ ...analysisData, seasonal_factors: e.target.value })}
                  placeholder="Ej: Verano, fiestas, promociones..."
                />
              </div>

              <Button
                onClick={handleAnalyzePrice}
                disabled={!selectedProduct || analyzing}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analizando con IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analizar Precio Óptimo
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Results Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Recomendación
            </h2>

            {!recommendation && !analyzing && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <Target className="w-16 h-16 text-text-tertiary mb-4" />
                <p className="text-text-secondary">
                  Completa los datos y analiza para ver las recomendaciones
                </p>
              </div>
            )}

            {analyzing && (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <Loader2 className="w-16 h-16 text-purple-500 animate-spin mb-4" />
                <p className="text-text-secondary">Analizando con IA...</p>
              </div>
            )}

            {recommendation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Precio Recomendado */}
                <div className="p-6 bg-gradient-to-r from-business-500/10 to-business-600/10 rounded-xl border-2 border-business-500/20">
                  <div className="text-center mb-4">
                    <p className="text-sm text-text-secondary mb-1">Precio Óptimo Recomendado</p>
                    <p className="text-5xl font-bold text-business-500">
                      ${recommendation.recommended_price}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-xs text-text-secondary mb-1">Margen Actual</p>
                      <p className="text-xl font-bold">{recommendation.current_margin.toFixed(1)}%</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-xs text-text-secondary mb-1">Margen Optimizado</p>
                      <p className="text-xl font-bold text-green-500">{recommendation.recommended_margin.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                {/* Análisis */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-text-primary mb-2 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-500" />
                      Razonamiento
                    </h4>
                    <p className="text-text-secondary text-sm bg-muted p-4 rounded-lg">
                      {recommendation.reasoning}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-text-primary mb-2 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-500" />
                      Análisis Competitivo
                    </h4>
                    <p className="text-text-secondary text-sm bg-muted p-4 rounded-lg">
                      {recommendation.competitive_analysis}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-text-primary mb-2 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Elasticidad de Demanda
                    </h4>
                    <p className="text-text-secondary text-sm bg-muted p-4 rounded-lg">
                      {recommendation.demand_elasticity}
                    </p>
                  </div>

                  {recommendation.action_items && recommendation.action_items.length > 0 && (
                    <div>
                      <h4 className="font-bold text-text-primary mb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        Acciones Recomendadas
                      </h4>
                      <ul className="space-y-2">
                        {recommendation.action_items.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                            <span className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <Button onClick={handleApplyPrice} className="w-full">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Aplicar Precio Recomendado
                </Button>
              </motion.div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
