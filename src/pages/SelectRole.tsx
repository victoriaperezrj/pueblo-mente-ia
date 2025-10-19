import { useNavigate } from 'react-router-dom';
import { 
  Rocket, BarChart3, Building2, ArrowRight, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SelectRole() {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'entrepreneur',
      title: 'Emprendedor',
      icon: Rocket,
      color: 'bg-primary',
      badge: 'DESDE CERO',
      description: '¿Tenés una idea pero no sabés si funciona?',
      features: [
        'Validá con IA',
        'Ves números reales',
        'Entendé viabilidad'
      ],
      buttonText: 'Validar Idea →'
    },
    {
      id: 'business',
      title: 'Negocio',
      icon: BarChart3,
      color: 'bg-primary',
      badge: '1-3 AÑOS',
      description: 'Vendés, pero todo a mano. Necesitás ordenar y crecer.',
      features: [
        'Dashboard real-time',
        'CRM simple',
        'Control gastos'
      ],
      buttonText: 'Organizar Negocio →',
      highlighted: true
    },
    {
      id: 'pyme',
      title: 'Empresa',
      icon: Building2,
      color: 'bg-success',
      badge: '+3 AÑOS',
      description: 'Creció tu empresa. Automatizá y escalá con IA.',
      features: [
        'Gestión de equipo',
        'Automatización',
        'Multi-sucursal'
      ],
      buttonText: 'Automatizar →'
    }
  ];

  const handleSelectRole = (roleId: string) => {
    sessionStorage.setItem('demoRole', roleId);
    navigate('/demo/intro', { state: { role: roleId } });
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            ¿En qué etapa estás?
          </h1>
          <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Elegí tu ruta y accedé a herramientas diseñadas específicamente para ti
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {roles.map((role) => {
            const Icon = role.icon;
            const isHighlighted = role.highlighted;

            return (
              <div
                key={role.id}
                className={`relative group rounded-xl p-7 border transition-all duration-300 shadow-base hover:shadow-hover card-3d ${
                  isHighlighted
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-primary'
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                {isHighlighted && (
                  <div className="absolute top-3 right-3 px-3 py-1.5 bg-primary rounded text-xs font-bold text-white shadow-md">
                    ⭐ Más Popular
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-full ${role.color} flex items-center justify-center`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded uppercase tracking-wide ${
                      isHighlighted
                        ? 'bg-primary/10 text-primary'
                        : 'bg-foreground/5 text-foreground/60'
                    }`}>
                      {role.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-foreground">{role.title}</h3>

                  <p className="text-sm text-foreground/70 leading-relaxed">
                    {role.description}
                  </p>

                  <ul className="space-y-2">
                    {role.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-success">
                        <Check className="h-4 w-4 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectRole(role.id)}
                    className={`w-full text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group mt-4 ${
                      role.color === 'bg-success'
                        ? 'bg-success hover:bg-success/90'
                        : 'bg-primary hover:bg-primary-hover'
                    }`}
                  >
                    {role.buttonText}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-foreground/70 hover:text-foreground"
          >
            ← Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}