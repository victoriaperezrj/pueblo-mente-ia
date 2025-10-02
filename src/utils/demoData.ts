// Datos de demostración para el modo demo

export const demoIdeaResult = {
  viability: 'viable' as const,
  investment_range: { min: 8000000, max: 15000000 },
  monthly_revenue: 2500000,
  monthly_expenses: 1800000,
  breakeven_months: 18,
  competitors_count: 2,
  market_size: 12000,
  suggested_niche: 'Pan artesanal + productos sin TACC',
  opportunities: [
    'Alta demanda de productos sin gluten en la zona',
    'Pocos competidores con productos artesanales',
    'Posibilidad de delivery propio'
  ],
  risks: [
    'Competencia con panaderías tradicionales',
    'Necesidad de capital inicial alto',
    'Dependencia de proveedores locales'
  ],
  recommendations: [
    'Empezar con productos premium y nicho específico',
    'Invertir en marketing digital desde el inicio',
    'Considerar modelo de suscripción mensual'
  ]
};

export const demoSales = [
  { date: '2025-01-01', amount: 48000, items: 12 },
  { date: '2025-01-02', amount: 75000, items: 18 },
  { date: '2025-01-03', amount: 62000, items: 15 },
  { date: '2025-01-04', amount: 55000, items: 14 },
  { date: '2025-01-05', amount: 89000, items: 22 },
  { date: '2025-01-06', amount: 95000, items: 24 },
  { date: '2025-01-07', amount: 105000, items: 28 }
];

export const demoProducts = [
  { id: 1, name: 'Pan integral', stock: 25, price: 850, cost: 450 },
  { id: 2, name: 'Pan francés', stock: 40, price: 650, cost: 350 },
  { id: 3, name: 'Medialunas', stock: 60, price: 400, cost: 200 },
  { id: 4, name: 'Pan sin TACC', stock: 15, price: 1200, cost: 700 },
  { id: 5, name: 'Facturas surtidas', stock: 80, price: 350, cost: 180 }
];

export const demoCustomers = [
  { id: 1, name: 'María González', phone: '2664123456', totalPurchases: 125000, lastVisit: '2025-01-07' },
  { id: 2, name: 'Juan Pérez', phone: '2664234567', totalPurchases: 89000, lastVisit: '2025-01-06' },
  { id: 3, name: 'Ana Rodríguez', phone: '2664345678', totalPurchases: 156000, lastVisit: '2025-01-07' },
  { id: 4, name: 'Carlos López', phone: '2664456789', totalPurchases: 72000, lastVisit: '2025-01-05' }
];

export const demoExpenses = [
  { id: 1, category: 'Alquiler', amount: 250000, date: '2025-01-01', description: 'Alquiler local' },
  { id: 2, category: 'Servicios', amount: 45000, date: '2025-01-03', description: 'Luz, gas, agua' },
  { id: 3, category: 'Materia prima', amount: 180000, date: '2025-01-05', description: 'Harina, levadura, etc' },
  { id: 4, category: 'Sueldos', amount: 450000, date: '2025-01-01', description: 'Empleados' }
];

export const demoFinancialScenario = {
  name: 'Escenario Base',
  monthlyRevenue: 2500000,
  fixedCosts: 745000,
  variableCosts: 1050000,
  taxRate: 0.105, // Monotributo
  profitMargin: 28.2,
  breakEvenUnits: 450
};
