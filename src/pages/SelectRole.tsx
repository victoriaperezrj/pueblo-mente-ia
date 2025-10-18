import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, BarChart3, Building2, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SelectRole() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: 'entrepreneur',
      title: 'Emprendedor',
      icon: Rocket,
      iconBg: 'bg-[#5B7FFF]',
      badge: 'DESDE CERO',
      badgeStyle: 'bg-gray-100 text-gray-600',
      description: '¿Tenés una idea pero no sabés si funciona?',
      features: [
        'Validá con IA',
        'Ves números reales',
        'Entendé viabilidad'
      ],
      buttonText: 'Ver Demo',
      buttonStyle: 'bg-[#5B7FFF] hover:bg-[#4A6FEE] text-white',
      cardStyle: 'bg-white border-[#E5E7EB] hover:border-[#5B7FFF]/50'
    },
    {
      id: 'business',
      title: 'Negocio',
      icon: BarChart3,
      iconBg: 'bg-[#5B7FFF]',
      badge: '1-3 AÑOS',
      badgeStyle: 'bg-[#5B7FFF]/10 text-[#5B7FFF]',
      description: 'Vendés, pero todo a mano. Necesitás ordenarte y crecer.',
      features: [
        'Dashboard real-time',
        'CRM simple',
        'Control gastos'
      ],
      buttonText: 'Ver Demo',
      buttonStyle: 'bg-[#5B7FFF] hover:bg-[#4A6FEE] text-white',
      highlighted: true,
      cardStyle: 'bg-gradient-to-br from-[#F0F4FF] to-[#E0EAFF] border-2 border-[#5B7FFF]'
    },
    {
      id: 'pyme',
      title: 'Empresa',
      icon: Building2,
      iconBg: 'bg-[#10B981]',
      badge: '+3 AÑOS',
      badgeStyle: 'bg-gray-100 text-gray-600',
      description: 'Creció tu empresa. Automatizá y escalá con IA.',
      features: [
        'Gestión de equipo',
        'Automatización',
        'Multi-sucursal'
      ],
      buttonText: 'Ver Demo',
      buttonStyle: 'bg-[#10B981] hover:bg-[#0FA175] text-white',
      cardStyle: 'bg-white border-[#E5E7EB] hover:border-[#10B981]'
    }
  ];

  const handleSelectRole = (roleId: string) => {
    setIsLoading(true);
    setSelectedRole(roleId);
    sessionStorage.setItem('demoRole', roleId);
    
    // Loading animation
    setTimeout(() => {
      navigate('/demo/intro', { state: { role: roleId } });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#5B7FFF] to-[#8B5CF6] rounded-lg" />
            <span className="text-lg font-semibold text-gray-900">Proyecto Emprendedurismo</span>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Headline Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              ¿En qué etapa estás?
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Elegí tu ruta y accedé a herramientas diseñadas específicamente para ti
            </p>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {roles.map((role) => {
              const Icon = role.icon;
              const isHighlighted = role.highlighted;
              const isSelected = selectedRole === role.id;

              return (
                <div
                  key={role.id}
                  onClick={() => !isLoading && handleSelectRole(role.id)}
                  className={`
                    relative cursor-pointer rounded-xl p-7 border transition-all duration-300
                    hover:shadow-lg hover:scale-[1.02]
                    ${isSelected ? 'animate-pulse' : ''}
                    ${isHighlighted ? 'md:scale-105' : ''}
                    ${role.cardStyle}
                  `}
                >
                  {isHighlighted && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-[#5B7FFF] rounded text-xs font-bold text-white shadow-md">
                      ⭐ Más Popular
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Icon and Badge */}
                    <div className="flex items-start justify-between">
                      <div className={`w-14 h-14 rounded-full ${role.iconBg} flex items-center justify-center`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded uppercase tracking-wide ${role.badgeStyle}`}>
                        {role.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900">{role.title}</h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {role.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2">
                      {role.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-[#10B981]">
                          <Check className="h-4 w-4 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Button */}
                    <Button
                      disabled={isLoading}
                      className={`w-full rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mt-4 ${role.buttonStyle}`}
                    >
                      {isSelected && isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin">⏳</span>
                          Cargando...
                        </span>
                      ) : (
                        role.buttonText
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Link */}
          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="text-[#5B7FFF] hover:underline text-sm"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
