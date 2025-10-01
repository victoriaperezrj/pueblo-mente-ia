export const calculateWithInflation = (baseValue: number, month: number, inflationRate: number): number => {
  return baseValue * Math.pow(1 + inflationRate / 100, month);
};

export const calculateRealValue = (nominalValue: number, month: number, inflationRate: number): number => {
  return nominalValue / Math.pow(1 + inflationRate / 100, month);
};

export const calculateLoanPayment = (principal: number, annualRate: number, months: number): number => {
  if (annualRate === 0) {
    return principal / months;
  }
  const monthlyRate = annualRate / 12 / 100;
  return (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) / 
         (Math.pow(1 + monthlyRate, months) - 1);
};

export const calculateBreakEven = (
  monthlyRevenue: number,
  fixedCosts: number,
  variableCostPercentage: number,
  taxes: number,
  loanPayment: number,
  inflationRate: number
): number => {
  let accumulated = 0;
  let month = 0;
  
  while (month < 60 && accumulated < 0) {
    month++;
    const revenue = calculateWithInflation(monthlyRevenue, month, inflationRate);
    const variableCosts = revenue * (variableCostPercentage / 100);
    const totalCosts = fixedCosts + variableCosts + taxes + loanPayment;
    const profit = revenue - totalCosts;
    accumulated += profit;
  }
  
  return month >= 60 ? -1 : month;
};

export interface FinancingOption {
  id: string;
  name: string;
  maxAmount: number;
  annualRate: number;
  months: number;
  description: string;
}

export const financingOptions: FinancingOption[] = [
  {
    id: 'none',
    name: 'Capital Propio',
    maxAmount: 0,
    annualRate: 0,
    months: 0,
    description: 'Sin financiación externa'
  },
  {
    id: 'san_juan',
    name: 'Banco San Juan - Crédito PYME 0%',
    maxAmount: 10000000,
    annualRate: 0,
    months: 24,
    description: 'Programa subsidiado provincial'
  },
  {
    id: 'nacion',
    name: 'Banco Nación - Línea Producción',
    maxAmount: 15000000,
    annualRate: 40,
    months: 36,
    description: 'Línea tradicional de producción'
  },
  {
    id: 'mercadopago',
    name: 'MercadoPago Capital',
    maxAmount: 5000000,
    annualRate: 60,
    months: 12,
    description: 'Aprobación inmediata'
  },
  {
    id: 'sl_emprende',
    name: 'Fondo San Luis Emprende',
    maxAmount: 3000000,
    annualRate: 25,
    months: 18,
    description: 'Solo para emprendedores de San Luis'
  }
];

export const calculateMonthlyRevenue = (
  pricePerProduct: number,
  clientsPerDay: number,
  productsPerClient: number,
  workingDays: number = 26
): number => {
  return pricePerProduct * clientsPerDay * productsPerClient * workingDays;
};

export const calculateVariableCosts = (revenue: number, percentage: number): number => {
  return revenue * (percentage / 100);
};
