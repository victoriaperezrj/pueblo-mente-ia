import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle, TrendingUp, DollarSign, Lightbulb, AlertTriangle, ArrowRight, LayoutDashboard, Calculator, ClipboardCheck, FileText, BookOpen, Settings, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ValidationIdea() {
  const navigate = useNavigate();
  const [idea, setIdea] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const words = idea.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
  }, [idea]);

  useEffect(() => {
    if (!isAnalyzing) return;

    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleAnalyzeClick = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      localStorage.setItem('business_idea_text', idea);

      const { data, error } = await supabase.functions.invoke('analyze-business-idea', {
        body: { ideaText: idea }
      });

      if (error) throw error;

      setAnalysisProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));

      localStorage.setItem('ai_analysis', JSON.stringify(data));
      setAnalysis(data);
      setShowResults(true);
      setIsAnalyzing(false);

    } catch (error) {
      console.error('Error al analizar:', error);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      toast.error('Hubo un error al analizar tu idea. Por favor, intentá nuevamente.');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('business_idea_skipped', 'true');
    toast.info('Próximo paso: Lean Canvas (en construcción)');
  };

  const Sidebar = () => (
    <div className={`fixed top-0 left-0 h-full bg-purple-50 border-r border-purple-100 transition-all duration-300 z-50 ${
      sidebarOpen ? 'w-64' : 'w-0 md:w-64'
    } overflow-hidden`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="font-bold text-purple-900">Emprendedor</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <a href="/demo/emprendedor/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-100 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium">Dashboard</span>
          </a>
          <a href="/demo/emprendedor/validacion-idea" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600 text-white">
            <Lightbulb className="w-5 h-5" />
            <span className="text-sm font-medium">Validación de Idea</span>
          </a>
          <a href="/demo/emprendedor/simulador" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-100 transition-colors">
            <Calculator className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium">Simulador Financiero</span>
          </a>
          <a href="/demo/emprendedor/checklist" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-100 transition-colors">
            <ClipboardCheck className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium">Checklist de Trámites</span>
          </a>
          <a href="/demo/emprendedor/documentacion" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-100 transition-colors">
            <FileText className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium">Mi Documentación</span>
          </a>
          <a href="/demo/emprendedor/recursos" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-100 transition-colors">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium">Recursos y Guías</span>
          </a>
          <a href="/demo/emprendedor/configuracion" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-100 transition-colors">
            <Settings className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium">Configuración</span>
          </a>
        </div>

        <Button
          onClick={() => navigate('/auth')}
          variant="outline"
          className="w-full mt-8 border-purple-600 text-purple-600 hover:bg-purple-50"
        >
          Crear Cuenta
        </Button>
      </div>
    </div>
  );

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 md:p-12 max-w-md text-center">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-2">
            Analizando tu modelo de negocio...
          </h2>
          <p className="text-gray-600 mb-6">
            Buscando competidores y datos del sector
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">
            {Math.round(analysisProgress)}% completado
          </p>
          <p className="text-xs text-gray-400 mt-4">
            Esto toma unos segundos...
          </p>
        </Card>
      </div>
    );
  }

  if (showResults && analysis) {
    return (
      <>
        <Sidebar />
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className="md:ml-64 min-h-screen bg-gray-50 p-4 md:p-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden mb-4 p-2 rounded-lg bg-purple-600 text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
                <div>
                  <h1 className="text-2xl font-bold">Análisis Completado</h1>
                  <p className="text-gray-600">{analysis.descripcion_corta}</p>
                </div>
              </div>
              
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-gray-600">Industria:</span>{' '}
                  <span className="font-semibold">{analysis.industria}</span>
                </div>
                <div>
                  <span className="text-gray-600">Viabilidad:</span>{' '}
                  <span className={`font-semibold ${
                    analysis.viabilidad === 'alta' ? 'text-green-600' :
                    analysis.viabilidad === 'media' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {analysis.viabilidad.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                Análisis de Mercado
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold">Tamaño del mercado:</span>
                  <p className="text-gray-700 mt-1">{analysis.analisis_mercado.tamano_mercado}</p>
                </div>
                <div>
                  <span className="font-semibold">Competencia:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    analysis.analisis_mercado.competencia === 'alta' ? 'bg-red-100 text-red-700' :
                    analysis.analisis_mercado.competencia === 'media' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {analysis.analisis_mercado.competencia.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Tendencias:</span>
                  <p className="text-gray-700 mt-1">{analysis.analisis_mercado.tendencias}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                Proyección Financiera
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-semibold">Ticket promedio por venta</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ${analysis.proyeccion_financiera.ticket_promedio.min.toLocaleString()} - 
                    ${analysis.proyeccion_financiera.ticket_promedio.max.toLocaleString()} ARS
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    → {analysis.proyeccion_financiera.ticket_promedio.justificacion}
                  </p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-semibold">Costos fijos mensuales</p>
                  <p className="text-2xl font-bold text-orange-600">
                    ${analysis.proyeccion_financiera.costos_fijos_mensuales.valor.toLocaleString()} ARS/mes
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    → {analysis.proyeccion_financiera.costos_fijos_mensuales.desglose}
                  </p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold">Margen bruto estimado</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {analysis.proyeccion_financiera.margen_bruto.porcentaje}%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    → {analysis.proyeccion_financiera.margen_bruto.explicacion}
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-semibold">Inversión inicial requerida</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${analysis.proyeccion_financiera.inversion_inicial.valor.toLocaleString()} ARS
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    → {analysis.proyeccion_financiera.inversion_inicial.concepto}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-600" />
                Recomendaciones
              </h2>
              <ol className="space-y-2">
                {analysis.recomendaciones.map((rec: string, index: number) => (
                  <li key={index} className="flex gap-3">
                    <span className="font-bold text-purple-600">{index + 1}.</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ol>
            </Card>
            
            <Card className="p-6 mb-6 border-l-4 border-red-500">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                Riesgos a Considerar
              </h2>
              <ul className="space-y-2">
                {analysis.riesgos.map((riesgo: string, index: number) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-red-600">•</span>
                    <span className="text-gray-700">{riesgo}</span>
                  </li>
                ))}
              </ul>
            </Card>
            
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => {
                  setShowResults(false);
                  setIdea('');
                  setAnalysis(null);
                }}
                className="flex-1 border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition"
              >
                Editar Mi Idea
              </button>
              <button
                onClick={() => toast.info('Próximo paso: Lean Canvas (en construcción)')}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
              >
                Continuar al Lean Canvas
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="md:ml-64 min-h-screen bg-gray-50 p-4 md:p-8">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden mb-4 p-2 rounded-lg bg-purple-600 text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Lightbulb className="w-8 h-8 text-purple-600" />
              Validación de Idea - Paso 1 de 4
            </h1>
            <p className="text-gray-600">Contanos tu idea de negocio</p>
          </div>

          <Card className="p-6 md:p-8">
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Este paso es opcional. Si querés, podés completarlo después para obtener análisis personalizado con IA.
              </p>
              
              <Textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Ejemplo: Quiero vender tortas personalizadas para cumpleaños por Instagram en Buenos Aires, trabajando desde casa..."
                className="min-h-[150px] text-base"
              />
              
              <p className={`text-sm mt-2 ${wordCount >= 20 ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                {wordCount}/20 palabras mínimo
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <Button
                onClick={handleSkip}
                variant="outline"
                className="flex-1 border-2"
                size="lg"
              >
                OMITIR ESTE PASO
              </Button>
              <Button
                onClick={handleAnalyzeClick}
                disabled={wordCount < 20}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                ANALIZAR CON IA →
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Nota: Si omitís este paso, irás directo al Lean Canvas para completar manualmente.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
