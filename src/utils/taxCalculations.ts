export interface MonotributoCategory {
  category: string;
  annualLimit: number;
  monthlyTax: number;
}

export const monotributoCategories: MonotributoCategory[] = [
  { category: 'A', annualLimit: 6450000, monthlyTax: 10000 },
  { category: 'B', annualLimit: 9520000, monthlyTax: 15000 },
  { category: 'C', annualLimit: 13300000, monthlyTax: 20000 },
  { category: 'D', annualLimit: 16590000, monthlyTax: 30000 },
  { category: 'E', annualLimit: 19340000, monthlyTax: 40000 },
  { category: 'F', annualLimit: 24250000, monthlyTax: 55000 },
  { category: 'G', annualLimit: 29000000, monthlyTax: 70000 },
  { category: 'H', annualLimit: 44000000, monthlyTax: 85000 },
  { category: 'I', annualLimit: 49000000, monthlyTax: 100000 },
  { category: 'J', annualLimit: 54500000, monthlyTax: 120000 },
  { category: 'K', annualLimit: 68000000, monthlyTax: 150000 },
];

export const calculateMonotributoCategory = (monthlyRevenue: number): MonotributoCategory => {
  const annualRevenue = monthlyRevenue * 12;
  
  for (const category of monotributoCategories) {
    if (annualRevenue <= category.annualLimit) {
      return category;
    }
  }
  
  // Si supera todas las categorías, devolver la más alta
  return monotributoCategories[monotributoCategories.length - 1];
};

export const calculateRegimenGeneralTaxes = (
  monthlyRevenue: number,
  isFacturaB: boolean
): number => {
  // Ingresos Brutos San Luis
  const ingresosBrutos = monthlyRevenue * (isFacturaB ? 0.015 : 0.035);
  
  // IVA es neutro si comprás con factura
  // Ganancias se calcula anualmente, lo simplificamos aquí
  const estimatedGanancias = monthlyRevenue * 0.02; // Estimación simplificada
  
  return ingresosBrutos + estimatedGanancias;
};

export const calculateTaxes = (
  monthlyRevenue: number,
  regime: 'monotributo' | 'general',
  isFacturaB: boolean = false
): { amount: number; category?: string; breakdown: string } => {
  if (regime === 'monotributo') {
    const category = calculateMonotributoCategory(monthlyRevenue);
    return {
      amount: category.monthlyTax,
      category: category.category,
      breakdown: `Categoría ${category.category}: $${category.monthlyTax.toLocaleString('es-AR')} (incluye impuestos, obra social y jubilación)`
    };
  } else {
    const amount = calculateRegimenGeneralTaxes(monthlyRevenue, isFacturaB);
    return {
      amount,
      breakdown: `Ingresos Brutos (${isFacturaB ? '1.5%' : '3.5%'}): $${(monthlyRevenue * (isFacturaB ? 0.015 : 0.035)).toLocaleString('es-AR')}, Ganancias estimadas: $${(monthlyRevenue * 0.02).toLocaleString('es-AR')}`
    };
  }
};

export const willExceedMonotributo = (
  currentMonthlyRevenue: number,
  month: number,
  inflationRate: number
): boolean => {
  const projectedMonthlyRevenue = currentMonthlyRevenue * Math.pow(1 + inflationRate / 100, month);
  const projectedAnnualRevenue = projectedMonthlyRevenue * 12;
  const maxMonotributo = monotributoCategories[monotributoCategories.length - 1].annualLimit;
  
  return projectedAnnualRevenue > maxMonotributo;
};
