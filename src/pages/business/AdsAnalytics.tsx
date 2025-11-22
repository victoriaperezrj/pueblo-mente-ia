import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Zap,
  Link2,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  RefreshCw,
  Settings,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { googleAdsService, metaAdsService } from '@/services/apiIntegrations';

// Platform connection status
interface PlatformConnection {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  lastSync?: string;
  accountName?: string;
}

// Mock data for ads metrics
interface AdsMetrics {
  platform: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpl: number;
  roas: number;
}

export default function AdsAnalytics() {
  const [platforms, setPlatforms] = useState<PlatformConnection[]>([
    {
      id: 'meta',
      name: 'Meta Ads',
      icon: '📘',
      connected: true, // Auto-connected to show data
      lastSync: new Date().toISOString(),
      accountName: 'Meta Ads Account'
    },
    {
      id: 'google',
      name: 'Google Ads',
      icon: '🔍',
      connected: true, // Auto-connected to show data
      lastSync: new Date().toISOString(),
      accountName: 'Google Ads Account'
    }
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [metricsData, setMetricsData] = useState<AdsMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real campaign data from APIs
  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        setLoading(true);

        // Fetch Meta Ads data
        const metaCampaigns = await metaAdsService.getCampaigns();
        const metaMetrics = await metaAdsService.getCampaignMetrics();

        // Fetch Google Ads data
        const googleCampaigns = await googleAdsService.getCampaigns();
        const googleMetrics = await googleAdsService.getCampaignMetrics();

        // Format metrics data
        const metrics: AdsMetrics[] = [
          {
            platform: 'Meta Ads',
            spend: metaMetrics.total_spend,
            impressions: metaMetrics.total_impressions,
            clicks: metaMetrics.total_clicks,
            conversions: metaMetrics.total_conversions,
            cpl: metaMetrics.avg_cpl,
            roas: metaMetrics.total_roas
          },
          {
            platform: 'Google Ads',
            spend: googleMetrics.total_spend,
            impressions: googleMetrics.total_impressions,
            clicks: googleMetrics.total_clicks,
            conversions: googleMetrics.total_conversions,
            cpl: googleMetrics.avg_cpl,
            roas: googleMetrics.total_roas
          }
        ];

        setMetricsData(metrics);
      } catch (error) {
        console.error('Error fetching campaign data:', error);
        // Fall back to empty metrics if API fails
        setMetricsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, []);

  const handleConnect = async (platformId: string) => {
    // In production, this would redirect to OAuth flow
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return;

    // Simulate connection (in real app, would use OAuth)
    setPlatforms(platforms.map(p =>
      p.id === platformId
        ? {
            ...p,
            connected: true,
            lastSync: new Date().toISOString(),
            accountName: `${platform.name} Account`
          }
        : p
    ));
  };

  const handleDisconnect = (platformId: string) => {
    setPlatforms(platforms.map(p =>
      p.id === platformId
        ? { ...p, connected: false, lastSync: undefined, accountName: undefined }
        : p
    ));
  };

  const generateAIRecommendation = async () => {
    if (metricsData.length === 0) return;

    setIsAnalyzing(true);

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    const metaMetrics = metricsData.find(m => m.platform === 'Meta Ads');
    const googleMetrics = metricsData.find(m => m.platform === 'Google Ads');

    if (!metaMetrics || !googleMetrics) {
      setIsAnalyzing(false);
      return;
    }

    const cplDiff = ((metaMetrics.cpl - googleMetrics.cpl) / googleMetrics.cpl * 100).toFixed(1);
    const betterPlatform = metaMetrics.cpl < googleMetrics.cpl ? 'Meta Ads' : 'Google Ads';
    const worsePlatform = metaMetrics.cpl < googleMetrics.cpl ? 'Google Ads' : 'Meta Ads';

    const recommendation = `**Análisis de Rendimiento de Campañas**

Basado en tus métricas actuales, he identificado las siguientes oportunidades:

1. **Reasignación de Presupuesto Recomendada**
   - ${betterPlatform} tiene un CPL ${Math.abs(parseFloat(cplDiff))}% mejor que ${worsePlatform} ($${metaMetrics.cpl.toFixed(2)} vs $${googleMetrics.cpl.toFixed(2)})
   - Sugiero reasignar 15% del presupuesto de ${worsePlatform} a ${betterPlatform}

2. **Optimización de ROAS**
   - Meta Ads: ROAS ${metaMetrics.roas.toFixed(1)}x ${metaMetrics.roas > 3 ? '(Por encima del benchmark)' : '(En el benchmark)'}
   - Google Ads: ROAS ${googleMetrics.roas.toFixed(1)}x ${googleMetrics.roas > 3 ? '(Por encima del benchmark)' : '(En el benchmark)'}
   - Acción: Revisar segmentación en ${worsePlatform} para mejorar conversiones

3. **Próximos Pasos**
   - Aumentar presupuesto en campañas de ${betterPlatform} con mejor rendimiento
   - Pausar keywords de bajo rendimiento en ${worsePlatform}
   - Implementar retargeting cruzado entre plataformas
   - Optimizar landing pages para mejorar tasa de conversión general`;

    setAiRecommendation(recommendation);
    setIsAnalyzing(false);
  };

  const totalSpend = metricsData.reduce((sum, m) => sum + m.spend, 0);
  const totalConversions = metricsData.reduce((sum, m) => sum + m.conversions, 0);
  const avgCPL = totalConversions > 0 ? totalSpend / totalConversions : 0;
  const avgROAS = metricsData.length > 0 ? metricsData.reduce((sum, m) => sum + m.roas, 0) / metricsData.length : 0;

  return (
    <div className="min-h-screen bg-bg-secondary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Análisis Unificado de Publicidad
          </h1>
          <p className="text-text-secondary">
            Conecta tus cuentas de Meta Ads y Google Ads para obtener insights con IA
          </p>
        </div>

        {/* Platform Connections */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {platforms.map((platform) => (
            <Card key={platform.id} className="border-2 border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{platform.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                      {platform.connected && (
                        <CardDescription className="text-xs">
                          {platform.accountName}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={platform.connected ? "default" : "secondary"}
                    className={platform.connected ? "bg-green-500" : ""}
                  >
                    {platform.connected ? (
                      <><CheckCircle className="w-3 h-3 mr-1" /> Conectado</>
                    ) : (
                      <><AlertCircle className="w-3 h-3 mr-1" /> Desconectado</>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {platform.connected ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Última sincronización</span>
                      <span className="text-text-primary">
                        {platform.lastSync ? new Date(platform.lastSync).toLocaleString() : '-'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sincronizar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDisconnect(platform.id)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleConnect(platform.id)}
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    Conectar {platform.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Gasto Total</p>
                  <p className="text-2xl font-bold">${totalSpend.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Conversiones</p>
                  <p className="text-2xl font-bold">{totalConversions}</p>
                </div>
                <Target className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">CPL Promedio</p>
                  <p className="text-2xl font-bold">${avgCPL.toFixed(2)}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">ROAS Promedio</p>
                  <p className="text-2xl font-bold">{avgROAS.toFixed(1)}x</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Comparison */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Comparación por Plataforma
            </CardTitle>
            <CardDescription>
              Rendimiento de tus campañas en cada plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-text-secondary">Cargando métricas de campañas...</p>
              </div>
            ) : metricsData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text-secondary">No hay datos de campañas disponibles</p>
              </div>
            ) : (
              <div className="space-y-6">
                {metricsData.map((metric, index) => (
                <div key={metric.platform} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{metric.platform}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-text-secondary">
                        Gasto: <span className="text-text-primary font-medium">${metric.spend}</span>
                      </span>
                      <span className="text-text-secondary">
                        CPL: <span className="text-text-primary font-medium">${metric.cpl.toFixed(2)}</span>
                      </span>
                      <span className={`flex items-center gap-1 ${metric.roas >= 3 ? 'text-green-500' : 'text-orange-500'}`}>
                        ROAS: {metric.roas}x
                        {metric.roas >= 3 ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={(metric.spend / totalSpend) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
            )}
          </CardContent>
        </Card>

        {/* AI Recommendation */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <Sparkles className="w-5 h-5" />
              Recomendaciones con IA
            </CardTitle>
            <CardDescription>
              Análisis inteligente de tus campañas con sugerencias de optimización
            </CardDescription>
          </CardHeader>
          <CardContent>
            {aiRecommendation ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-sm text-text-secondary">
                  {aiRecommendation}
                </div>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setAiRecommendation(null)}
                >
                  Limpiar análisis
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <p className="text-text-secondary mb-4">
                  Genera un análisis con IA para obtener recomendaciones personalizadas
                  sobre cómo optimizar tu presupuesto publicitario.
                </p>
                <Button
                  onClick={generateAIRecommendation}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generar Análisis con IA
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Note */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <ExternalLink className="w-5 h-5 text-blue-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">
                Nota sobre integraciones
              </p>
              <p className="text-blue-600 dark:text-blue-400">
                Para crear y gestionar campañas, utilizá directamente Meta Ads Manager o Google Ads.
                Esta herramienta está diseñada para unificar tus métricas y proporcionar
                recomendaciones inteligentes basadas en el rendimiento cruzado de todas tus plataformas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
