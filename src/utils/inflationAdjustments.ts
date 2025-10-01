export interface MonthlyProjection {
  month: number;
  nominalRevenue: number;
  realRevenue: number;
  costs: number;
  taxes: number;
  loanPayment: number;
  nominalProfit: number;
  realProfit: number;
  accumulated: number;
}

export const generateProjection = (
  baseRevenue: number,
  fixedCosts: number,
  variableCostPercentage: number,
  baseTaxes: number,
  loanPayment: number,
  inflationRate: number,
  months: number = 36,
  canTransferInflation: boolean = true
): MonthlyProjection[] => {
  const projections: MonthlyProjection[] = [];
  let accumulated = 0;
  
  for (let month = 1; month <= months; month++) {
    // Si puede trasladar inflación, los ingresos nominales suben
    const nominalRevenue = canTransferInflation 
      ? baseRevenue * Math.pow(1 + inflationRate / 100, month)
      : baseRevenue;
    
    // Ingresos reales (deflactados)
    const realRevenue = nominalRevenue / Math.pow(1 + inflationRate / 100, month);
    
    // Costos variables suben con inflación
    const variableCosts = nominalRevenue * (variableCostPercentage / 100);
    
    // Costos fijos nominales suben con inflación
    const adjustedFixedCosts = fixedCosts * Math.pow(1 + inflationRate / 100, month);
    
    // Impuestos calculados sobre revenue nominal
    const taxes = baseTaxes;
    
    // Total costos
    const totalCosts = adjustedFixedCosts + variableCosts;
    
    // Ganancia nominal
    const nominalProfit = nominalRevenue - totalCosts - taxes - loanPayment;
    
    // Ganancia real (deflactada)
    const realProfit = nominalProfit / Math.pow(1 + inflationRate / 100, month);
    
    accumulated += realProfit;
    
    projections.push({
      month,
      nominalRevenue,
      realRevenue,
      costs: totalCosts,
      taxes,
      loanPayment,
      nominalProfit,
      realProfit,
      accumulated
    });
  }
  
  return projections;
};

export const calculateScenarios = (
  baseRevenue: number,
  fixedCosts: number,
  variableCostPercentage: number,
  taxes: number,
  loanAmount: number,
  loanRate: number,
  loanMonths: number
) => {
  const baseLoanPayment = loanAmount > 0 
    ? (loanAmount * ((loanRate / 12 / 100) * Math.pow(1 + loanRate / 12 / 100, loanMonths))) / 
      (Math.pow(1 + loanRate / 12 / 100, loanMonths) - 1)
    : 0;
  
  // Escenario Pesimista
  const pessimisticRevenue = baseRevenue * 0.7; // -30% clientes
  const pessimisticInflation = 10;
  const pessimisticLoanPayment = loanAmount > 0 
    ? (loanAmount * ((60 / 12 / 100) * Math.pow(1 + 60 / 12 / 100, loanMonths))) / 
      (Math.pow(1 + 60 / 12 / 100, loanMonths) - 1)
    : 0;
  const pessimistic = generateProjection(
    pessimisticRevenue,
    fixedCosts,
    variableCostPercentage,
    taxes,
    pessimisticLoanPayment,
    pessimisticInflation,
    12,
    false // No puede trasladar inflación
  );
  
  // Escenario Realista
  const realistic = generateProjection(
    baseRevenue,
    fixedCosts,
    variableCostPercentage,
    taxes,
    baseLoanPayment,
    5, // 5% inflación mensual
    12,
    true
  );
  
  // Escenario Optimista
  const optimisticRevenue = baseRevenue * 1.3; // +30% clientes
  const optimisticInflation = 3;
  const optimistic = generateProjection(
    optimisticRevenue,
    fixedCosts,
    variableCostPercentage,
    taxes,
    0, // Sin préstamo (financiación 0%)
    optimisticInflation,
    12,
    true
  );
  
  return {
    pessimistic,
    realistic,
    optimistic
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};
