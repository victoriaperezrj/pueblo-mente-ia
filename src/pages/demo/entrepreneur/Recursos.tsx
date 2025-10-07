import { useNavigate } from 'react-router-dom';
import { FileText, Video, ExternalLink, BookOpen, ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RECURSOS = [
  {
    categoria: 'Guías Descargables',
    items: [
      {
        titulo: 'Plantilla de Lean Canvas',
        descripcion: 'PDF editable para imprimir y completar',
        tipo: 'PDF',
        icono: FileText,
        color: 'red'
      },
      {
        titulo: 'Plantilla de Proyección Financiera',
        descripcion: 'Excel con fórmulas pre-cargadas',
        tipo: 'XLSX',
        icono: FileText,
        color: 'green'
      },
      {
        titulo: 'Checklist Completo de Trámites',
        descripcion: 'Todos los pasos para formalizar tu negocio',
        tipo: 'PDF',
        icono: FileText,
        color: 'blue'
      }
    ]
  },
  {
    categoria: 'Tutoriales en Video',
    items: [
      {
        titulo: 'Cómo validar tu idea en 5 pasos',
        descripcion: 'Video explicativo de 10 minutos',
        tipo: 'Video',
        icono: Video,
        color: 'purple'
      },
      {
        titulo: 'Lean Canvas: Explicación completa',
        descripcion: 'Aprende a usar cada bloque del canvas',
        tipo: 'Video',
        icono: Video,
        color: 'orange'
      }
    ]
  },
  {
    categoria: 'Links Útiles',
    items: [
      {
        titulo: 'AFIP - Monotributo',
        descripcion: 'Sitio oficial para inscribirte',
        link: 'https://www.afip.gob.ar',
        icono: ExternalLink,
        color: 'blue'
      },
      {
        titulo: 'INPI - Registro de Marcas',
        descripcion: 'Protege tu marca comercial',
        link: 'https://www.argentina.gob.ar/inpi',
        icono: ExternalLink,
        color: 'green'
      },
      {
        titulo: 'Mi Argentina - Trámites',
        descripcion: 'Portal unificado del gobierno',
        link: 'https://www.argentina.gob.ar',
        icono: ExternalLink,
        color: 'cyan'
      }
    ]
  },
  {
    categoria: 'Artículos Recomendados',
    items: [
      {
        titulo: 'Los 10 errores más comunes al emprender',
        descripcion: 'Aprende de los errores de otros',
        icono: BookOpen,
        color: 'yellow'
      },
      {
        titulo: 'Cómo conseguir tu primer cliente',
        descripcion: 'Estrategias probadas de marketing inicial',
        icono: BookOpen,
        color: 'pink'
      }
    ]
  }
];

export default function Recursos() {
  const navigate = useNavigate();
  
  return (
    <div className="md:ml-64 min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/demo/emprendedor/dashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">📚 Recursos y Guías</h1>
            <p className="text-gray-600">
              Plantillas, tutoriales y links útiles para tu emprendimiento
            </p>
          </div>
        </div>
        
        <div className="space-y-8">
          {RECURSOS.map((categoria, index) => (
            <div key={index}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {categoria.categoria}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {categoria.items.map((item, itemIndex) => (
                  <RecursoCard key={itemIndex} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecursoCard({ item }: { item: any }) {
  const Icon = item.icono;
  
  const colorClasses: Record<string, string> = {
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    pink: 'bg-pink-100 text-pink-600',
    cyan: 'bg-cyan-100 text-cyan-600'
  };
  
  return (
    <div className="bg-white rounded-lg p-6 hover:shadow-md transition group">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[item.color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition">
            {item.titulo}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{item.descripcion}</p>
          
          {item.tipo && (
            <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
              {item.tipo}
            </span>
          )}
          
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-semibold"
            >
              Abrir sitio
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
        
        <button className="flex-shrink-0 bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition opacity-0 group-hover:opacity-100">
          <Download className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
