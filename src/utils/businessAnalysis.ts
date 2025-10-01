// Helpers para generar datos simulados de análisis de negocio

interface SimulatedAnalysis {
  viability: 'viable' | 'caution' | 'risky';
  investment_range: {
    min: number;
    max: number;
  };
  monthly_revenue: {
    pessimistic: number;
    realistic: number;
    optimistic: number;
  };
  competitors_count: number;
  market_size: number;
  suggested_niche: string;
  key_factors: string[];
  warnings: string[];
  opportunities: string[];
  timeframe: {
    setup_months: number;
    break_even_months: number;
  };
}

const nichosPorRubro: Record<string, string[]> = {
  'Gastronomía (panadería, restaurante, café)': [
    'Productos sin TACC + panes artesanales',
    'Comida saludable para oficinas',
    'Delivery especializado en vegano',
    'Panadería + café de especialidad',
    'Pastelería premium para eventos',
    'Comida regional típica con twist moderno'
  ],
  'Belleza y Estética (peluquería, spa, barbería)': [
    'Barbería premium con bar incluido',
    'Spa enfocado en hombres',
    'Peluquería mobile a domicilio',
    'Tratamientos capilares especializados',
    'Belleza + wellness integral',
    'Estética express en zonas corporativas'
  ],
  'Retail (almacén, kiosco, tienda)': [
    'Almacén + verdulería + dietética',
    'Kiosco 24hs con café',
    'Tienda de productos regionales',
    'Minimercado con delivery rápido',
    'Tienda zero waste',
    'Almacén especializado en importados'
  ],
  'Servicios Profesionales (consultoría, contabilidad)': [
    'Consultoría para emprendedores',
    'Contabilidad digital para freelancers',
    'Asesoría legal + contable combinada',
    'Servicios empresariales todo-en-uno',
    'Consultoría de marketing digital',
    'Asesoría de importaciones'
  ],
  'Salud y Bienestar (gimnasio, nutrición)': [
    'Gimnasio boutique especializado',
    'Nutrición + entrenamiento personalizado',
    'Centro de yoga + mindfulness',
    'Gym para +50 años',
    'Clases grupales outdoor',
    'Wellness center integral'
  ],
  'Educación (instituto, clases particulares)': [
    'Clases de idiomas online + presencial',
    'Academia de programación',
    'Apoyo escolar personalizado',
    'Cursos de oficios prácticos',
    'Instituto de habilidades digitales',
    'Educación financiera para adultos'
  ],
  'Tecnología (desarrollo, diseño, marketing digital)': [
    'Desarrollo web para pymes locales',
    'Marketing digital + redes sociales',
    'Diseño gráfico + branding',
    'E-commerce as a service',
    'Automatización para negocios',
    'Transformación digital para comercios'
  ],
  'Construcción y Mantenimiento': [
    'Refacciones express',
    'Mantenimiento preventivo de propiedades',
    'Construcción sustentable',
    'Pintura + decoración',
    'Reparaciones a domicilio',
    'Servicios de plomería y electricidad'
  ]
};

const factoresPorCiudad: Record<string, { competencia: number; mercado: number }> = {
  'San Luis (capital)': { competencia: 7, mercado: 180000 },
  'Villa Mercedes': { competencia: 6, mercado: 120000 },
  'Merlo': { competencia: 3, mercado: 25000 },
  'La Punta': { competencia: 4, mercado: 35000 },
  'Juana Koslay': { competencia: 3, mercado: 18000 },
  'El Trapiche': { competencia: 2, mercado: 8000 },
  'Potrero de los Funes': { competencia: 2, mercado: 5000 },
  'Concarán': { competencia: 2, mercado: 7000 },
  'Tilisarao': { competencia: 2, mercado: 6000 },
  'Otra ciudad': { competencia: 3, mercado: 10000 }
};

const inversionPorRubro: Record<string, { min: number; max: number }> = {
  'Gastronomía (panadería, restaurante, café)': { min: 8000000, max: 20000000 },
  'Belleza y Estética (peluquería, spa, barbería)': { min: 5000000, max: 12000000 },
  'Retail (almacén, kiosco, tienda)': { min: 4000000, max: 15000000 },
  'Servicios Profesionales (consultoría, contabilidad)': { min: 2000000, max: 6000000 },
  'Salud y Bienestar (gimnasio, nutrición)': { min: 6000000, max: 18000000 },
  'Educación (instituto, clases particulares)': { min: 3000000, max: 8000000 },
  'Tecnología (desarrollo, diseño, marketing digital)': { min: 2000000, max: 7000000 },
  'Construcción y Mantenimiento': { min: 3000000, max: 10000000 },
  'Otro': { min: 3000000, max: 12000000 }
};

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generarNichoPorRubro(industry: string): string {
  const nichos = nichosPorRubro[industry] || [
    'Especialización en segmento premium',
    'Diferenciación por servicio personalizado',
    'Enfoque en nicho desatendido',
    'Innovación en modelo de negocio'
  ];
  
  return nichos[Math.floor(Math.random() * nichos.length)];
}

function calcularViabilidad(
  competencia: number, 
  mercado: number, 
  descripcion: string
): 'viable' | 'caution' | 'risky' {
  const score = (mercado / 10000) - competencia;
  
  // Bonus si menciona "experiencia", "conocimiento", "equipo"
  const hasExperience = /experiencia|conocimiento|trabajé|equipo|socios/i.test(descripcion);
  const adjustedScore = hasExperience ? score + 2 : score;
  
  if (adjustedScore > 8) return 'viable';
  if (adjustedScore > 4) return 'caution';
  return 'risky';
}

function generarFactoresClave(industry: string, location: string): string[] {
  const factoresBase = [
    `Ubicación en ${location} permite acceso a mercado local`,
    'Tendencia creciente de consumo en el rubro',
    'Baja barrera de entrada inicial'
  ];

  const factoresRubro: Record<string, string[]> = {
    'Gastronomía (panadería, restaurante, café)': [
      'Alto tráfico de consumo diario',
      'Posibilidad de delivery',
      'Márgenes de ganancia atractivos'
    ],
    'Belleza y Estética (peluquería, spa, barbería)': [
      'Cliente recurrente mensual',
      'Bajo costo de inventario',
      'Alta fidelización de clientes'
    ],
    'Tecnología (desarrollo, diseño, marketing digital)': [
      'Trabajo remoto permite escalar',
      'Bajo costo operativo',
      'Alta demanda regional'
    ]
  };

  const factoresEspecificos = factoresRubro[industry] || ['Potencial de crecimiento en la zona'];
  return [...factoresBase, ...factoresEspecificos].slice(0, 5);
}

function generarAdvertencias(viability: string, competencia: number): string[] {
  const warnings: string[] = [];

  if (viability === 'risky') {
    warnings.push('⚠️ Mercado con alta competencia - requiere diferenciación fuerte');
    warnings.push('💰 Inversión inicial significativa - planificar financiamiento');
  } else if (viability === 'caution') {
    warnings.push('📊 Requiere análisis de competencia detallado');
    warnings.push('💡 Importante definir propuesta de valor única');
  }

  if (competencia > 6) {
    warnings.push('🎯 Alto número de competidores - nicho específico recomendado');
  }

  warnings.push('📋 Verificar habilitaciones y permisos municipales antes de comenzar');

  return warnings;
}

function generarOportunidades(industry: string, location: string): string[] {
  const oportunidades = [
    '🌐 Crear presencia digital desde el inicio',
    '🤝 Establecer alianzas estratégicas con otros comercios',
    '📱 Implementar sistema de reservas/pedidos online',
    '💳 Ofrecer múltiples métodos de pago digital',
    '📊 Usar herramientas de gestión modernas desde día 1'
  ];

  return oportunidades.slice(0, 4);
}

export function generateSimulatedAnalysis(
  industry: string,
  location: string,
  description: string
): SimulatedAnalysis {
  const factoresCiudad = factoresPorCiudad[location] || { competencia: 4, mercado: 15000 };
  const inversionBase = inversionPorRubro[industry] || { min: 3000000, max: 12000000 };
  
  // Agregar variación aleatoria ±15%
  const variacion = 0.85 + (Math.random() * 0.3);
  const investmentMin = Math.floor(inversionBase.min * variacion);
  const investmentMax = Math.floor(inversionBase.max * variacion);
  
  const competidores = randomBetween(
    Math.max(1, factoresCiudad.competencia - 2),
    factoresCiudad.competencia + 2
  );
  
  const marketSize = factoresCiudad.mercado;
  
  const viability = calcularViabilidad(competidores, marketSize, description);
  
  // Calcular ingresos mensuales estimados
  const baseRevenue = investmentMax * 0.15; // 15% de la inversión
  const monthlyRevenue = {
    pessimistic: Math.floor(baseRevenue * 0.6),
    realistic: Math.floor(baseRevenue),
    optimistic: Math.floor(baseRevenue * 1.5)
  };

  return {
    viability,
    investment_range: {
      min: investmentMin,
      max: investmentMax
    },
    monthly_revenue: monthlyRevenue,
    competitors_count: competidores,
    market_size: marketSize,
    suggested_niche: generarNichoPorRubro(industry),
    key_factors: generarFactoresClave(industry, location),
    warnings: generarAdvertencias(viability, competidores),
    opportunities: generarOportunidades(industry, location),
    timeframe: {
      setup_months: randomBetween(2, 4),
      break_even_months: randomBetween(8, 18)
    }
  };
}
