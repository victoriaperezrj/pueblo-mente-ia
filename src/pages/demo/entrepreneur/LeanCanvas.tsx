import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { safeJSONParse } from '@/lib/safe-json';

export default function LeanCanvas() {
  const navigate = useNavigate();
  const [canvasData, setCanvasData] = useState({
    problema: '',
    solucion: '',
    propuesta_valor: '',
    ventaja_injusta: '',
    segmentos_cliente: '',
    metricas_clave: '',
    canales: '',
    estructura_costos: '',
    fuentes_ingreso: ''
  });
  
  useEffect(() => {
    const saved = localStorage.getItem('lean_canvas_data');
    const savedData = safeJSONParse(saved, null);
    if (savedData) {
      setCanvasData(savedData);
    }
    
    const aiAnalysis = localStorage.getItem('ai_analysis');
    const analysis = safeJSONParse(aiAnalysis, null);
    if (analysis && !savedData) {
      setCanvasData(prev => ({
        ...prev,
        problema: `${analysis.analisis_mercado?.desafios || ''}`,
        segmentos_cliente: analysis.industria || ''
      }));
    }
  }, []);
  
  const handleChange = (field: string, value: string) => {
    const updated = { ...canvasData, [field]: value };
    setCanvasData(updated);
    localStorage.setItem('lean_canvas_data', JSON.stringify(updated));
  };
  
  const progress = Object.values(canvasData).filter(v => v.trim()).length;
  const total = 9;
  const percentage = Math.round((progress / total) * 100);
  
  return (
    <div className="md:ml-64 min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/demo/emprendedor/dashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Lean Canvas</h1>
            <p className="text-gray-600">Estructura tu idea de negocio en 9 bloques</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600">{percentage}%</div>
            <div className="text-sm text-gray-600">{progress}/{total} completados</div>
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-primary-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      
      {/* Grid del Canvas */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <CanvasBlock
          title="🎯 Problema"
          subtitle="Top 3 problemas"
          value={canvasData.problema}
          onChange={(v) => handleChange('problema', v)}
          placeholder="1. ..."
        />
        
        <CanvasBlock
          title="💡 Solución"
          subtitle="Top 3 características"
          value={canvasData.solucion}
          onChange={(v) => handleChange('solucion', v)}
          placeholder="1. ..."
        />
        
        <CanvasBlock
          title="⭐ Propuesta de Valor"
          subtitle="Mensaje único"
          value={canvasData.propuesta_valor}
          onChange={(v) => handleChange('propuesta_valor', v)}
          placeholder="¿Por qué somos diferentes?"
        />
        
        <CanvasBlock
          title="🚀 Ventaja Injusta"
          subtitle="Difícil de copiar"
          value={canvasData.ventaja_injusta}
          onChange={(v) => handleChange('ventaja_injusta', v)}
          placeholder="¿Qué no pueden replicar?"
        />
        
        <CanvasBlock
          title="👥 Segmentos de Cliente"
          subtitle="Usuarios objetivo"
          value={canvasData.segmentos_cliente}
          onChange={(v) => handleChange('segmentos_cliente', v)}
          placeholder="¿Quiénes son tus clientes?"
        />
        
        <div className="md:col-span-2">
          <CanvasBlock
            title="📊 Métricas Clave"
            subtitle="¿Qué medir?"
            value={canvasData.metricas_clave}
            onChange={(v) => handleChange('metricas_clave', v)}
            placeholder="Ej: CAC, LTV, churn..."
            large
          />
        </div>
        
        <div className="md:col-span-3">
          <CanvasBlock
            title="📢 Canales"
            subtitle="¿Cómo llegar a clientes?"
            value={canvasData.canales}
            onChange={(v) => handleChange('canales', v)}
            placeholder="Ej: Instagram, referidos, google ads..."
            large
          />
        </div>
        
        <div className="md:col-span-2">
          <CanvasBlock
            title="💸 Estructura de Costos"
            subtitle="Costos principales"
            value={canvasData.estructura_costos}
            onChange={(v) => handleChange('estructura_costos', v)}
            placeholder="Ej: alquiler, COGS, marketing..."
            large
          />
        </div>
        
        <div className="md:col-span-3">
          <CanvasBlock
            title="💰 Fuentes de Ingreso"
            subtitle="¿Cómo generar dinero?"
            value={canvasData.fuentes_ingreso}
            onChange={(v) => handleChange('fuentes_ingreso', v)}
            placeholder="Ej: venta directa, suscripción, comisiones..."
            large
          />
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            alert('Canvas guardado automáticamente ✓');
          }}
        >
          <Save className="w-5 h-5 mr-2" />
          Guardado Automático
        </Button>
        
        <Button
          className="flex-1 bg-primary-500 hover:bg-primary-600"
          onClick={() => navigate('/demo/emprendedor/dashboard')}
        >
          Volver al Dashboard
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function CanvasBlock({ 
  title, 
  subtitle, 
  value, 
  onChange, 
  placeholder, 
  large = false 
}: {
  title: string;
  subtitle: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  large?: boolean;
}) {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4 hover:border-primary-400 transition">
      <div className="mb-2">
        <h3 className="font-bold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border-0 focus:outline-none resize-none text-sm text-gray-700 ${
          large ? 'h-24' : 'h-32'
        }`}
      />
      {value && (
        <div className="mt-2 flex items-center gap-1 text-green-600 text-xs">
          <CheckCircle2 className="w-3 h-3" />
          <span>Completado</span>
        </div>
      )}
    </div>
  );
}
