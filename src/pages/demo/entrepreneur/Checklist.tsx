import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, ExternalLink, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TRAMITES = [
  {
    id: 1,
    titulo: 'Inscripción en AFIP',
    descripcion: 'Monotributo o Responsable Inscripto',
    link: 'https://www.afip.gob.ar',
    pasos: [
      'Obtener CUIT',
      'Elegir categoría de Monotributo',
      'Inscribirse online en AFIP',
      'Generar clave fiscal'
    ]
  },
  {
    id: 2,
    titulo: 'Cuenta Bancaria Empresarial',
    descripcion: 'Separar finanzas personales de negocio',
    link: null,
    pasos: [
      'Investigar bancos (costos, beneficios)',
      'Juntar documentación necesaria',
      'Abrir cuenta corriente o caja de ahorro',
      'Solicitar tarjeta de débito empresarial'
    ]
  },
  {
    id: 3,
    titulo: 'Registro de Marca (INPI)',
    descripcion: 'Proteger nombre y logo de tu negocio',
    link: 'https://www.argentina.gob.ar/inpi',
    pasos: [
      'Buscar si la marca ya existe',
      'Diseñar logo definitivo',
      'Presentar solicitud en INPI',
      'Esperar aprobación (6-12 meses)'
    ]
  },
  {
    id: 4,
    titulo: 'Habilitación Municipal',
    descripcion: 'Permiso para operar comercialmente',
    link: null,
    pasos: [
      'Consultar requisitos en tu municipio',
      'Presentar plano del local',
      'Pagar tasas municipales',
      'Inspección del local'
    ]
  },
  {
    id: 5,
    titulo: 'Alta en Ingresos Brutos',
    descripcion: 'Impuesto provincial',
    link: null,
    pasos: [
      'Ingresar al portal de ARBA/Rentas',
      'Completar formulario de inscripción',
      'Declarar actividad económica',
      'Obtener número de contribuyente'
    ]
  }
];

export default function Checklist() {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    const saved = localStorage.getItem('checklist_progress');
    if (saved) {
      setCompletedSteps(JSON.parse(saved));
    }
  }, []);
  
  const toggleStep = (tramiteId: number, stepIndex: number) => {
    const key = `${tramiteId}-${stepIndex}`;
    const updated = {
      ...completedSteps,
      [key]: !completedSteps[key]
    };
    setCompletedSteps(updated);
    localStorage.setItem('checklist_progress', JSON.stringify(updated));
  };
  
  const getProgress = () => {
    const total = TRAMITES.reduce((sum, t) => sum + t.pasos.length, 0);
    const completed = Object.values(completedSteps).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };
  
  return (
    <div className="md:ml-64 min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/demo/emprendedor/dashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">📋 Checklist de Trámites</h1>
            <p className="text-gray-600">
              Pasos esenciales para formalizar tu emprendimiento
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600">Progreso Total</span>
            <span className="text-2xl font-bold text-purple-600">{getProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-500 h-3 rounded-full transition-all"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-6">
        {TRAMITES.map((tramite) => (
          <div key={tramite.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {tramite.titulo}
                </h3>
                <p className="text-gray-600 text-sm">{tramite.descripcion}</p>
              </div>
              {tramite.link && (
                <a 
                  href={tramite.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 flex items-center gap-1 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ir al sitio
                </a>
              )}
            </div>
            
            <div className="space-y-2">
              {tramite.pasos.map((paso, index) => {
                const key = `${tramite.id}-${index}`;
                const isCompleted = completedSteps[key];
                
                return (
                  <button
                    key={index}
                    onClick={() => toggleStep(tramite.id, index)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-left"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={`${
                      isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'
                    }`}>
                      {paso}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
