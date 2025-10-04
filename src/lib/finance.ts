/**
 * Pure financial calculation functions
 * All functions are deterministic - no hidden defaults
 * If inputs are missing, return null and indicate what's needed
 */

export interface FinancialInputs {
  revenue?: number;
  fixedCosts?: number;
  variableCosts?: number;
  price?: number;
  costPerUnit?: number;
  quantity?: number;
  arpu?: number;
  churn?: number;
  cac?: number;
  capex?: number;
}

export interface CalculationResult<T> {
  value: T | null;
  formula: string;
  inputs: Record<string, number>;
  missingInputs: string[];
}

/**
 * Calculate total monthly income
 * Formula: Σ (price_i * quantity_i)
 */
export function calculateMonthlyIncome(
  items: Array<{ price: number; quantity: number }>
): CalculationResult<number> {
  if (!items || items.length === 0) {
    return {
      value: null,
      formula: 'Ingreso Total = Σ (precio × cantidad)',
      inputs: {},
      missingInputs: ['items con precio y cantidad']
    };
  }

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return {
    value: total,
    formula: 'Ingreso Total = Σ (precio × cantidad)',
    inputs: { items: items.length, total },
    missingInputs: []
  };
}

/**
 * Calculate total variable costs
 * Formula: Σ (costo_variable_unitario_i * cantidad_i)
 */
export function calculateVariableCosts(
  items: Array<{ costPerUnit: number; quantity: number }>
): CalculationResult<number> {
  if (!items || items.length === 0) {
    return {
      value: null,
      formula: 'Costos Variables = Σ (costo_unitario × cantidad)',
      inputs: {},
      missingInputs: ['items con costo unitario y cantidad']
    };
  }

  const total = items.reduce((sum, item) => sum + (item.costPerUnit * item.quantity), 0);
  
  return {
    value: total,
    formula: 'Costos Variables = Σ (costo_unitario × cantidad)',
    inputs: { items: items.length, total },
    missingInputs: []
  };
}

/**
 * Calculate unit contribution margin
 * Formula: precio - costo_variable_unitario
 */
export function calculateUnitMargin(
  price?: number,
  costPerUnit?: number
): CalculationResult<number> {
  const missing: string[] = [];
  if (price === undefined) missing.push('precio de venta');
  if (costPerUnit === undefined) missing.push('costo variable unitario');

  if (missing.length > 0) {
    return {
      value: null,
      formula: 'Margen de Contribución = precio - costo_variable_unitario',
      inputs: {},
      missingInputs: missing
    };
  }

  return {
    value: price! - costPerUnit!,
    formula: 'Margen de Contribución = precio - costo_variable_unitario',
    inputs: { precio: price!, costo_unitario: costPerUnit! },
    missingInputs: []
  };
}

/**
 * Calculate break-even point in units
 * Formula: costos_fijos / margen_contribucion_unitario
 */
export function calculateBreakEvenUnits(
  fixedCosts?: number,
  unitMargin?: number
): CalculationResult<number> {
  const missing: string[] = [];
  if (fixedCosts === undefined) missing.push('costos fijos');
  if (unitMargin === undefined) missing.push('margen de contribución unitario');

  if (missing.length > 0) {
    return {
      value: null,
      formula: 'Punto de Equilibrio (unid.) = costos_fijos / margen_contribución_unitario',
      inputs: {},
      missingInputs: missing
    };
  }

  // If margin is <= 0, business is not viable
  if (unitMargin! <= 0) {
    return {
      value: null,
      formula: 'Punto de Equilibrio (unid.) = costos_fijos / margen_contribución_unitario',
      inputs: { costos_fijos: fixedCosts!, margen_unitario: unitMargin! },
      missingInputs: ['⚠️ ALERTA: Margen unitario ≤ 0 → Negocio inviable con estos números']
    };
  }

  return {
    value: fixedCosts! / unitMargin!,
    formula: 'Punto de Equilibrio (unid.) = costos_fijos / margen_contribución_unitario',
    inputs: { costos_fijos: fixedCosts!, margen_unitario: unitMargin! },
    missingInputs: []
  };
}

/**
 * Calculate gross margin percentage
 * Formula: (ingreso - costo_variable) / ingreso × 100
 */
export function calculateGrossMargin(
  revenue?: number,
  variableCosts?: number
): CalculationResult<number> {
  const missing: string[] = [];
  if (revenue === undefined) missing.push('ingresos totales');
  if (variableCosts === undefined) missing.push('costos variables totales');

  if (missing.length > 0) {
    return {
      value: null,
      formula: 'Margen Bruto % = (ingreso - costo_variable) / ingreso × 100',
      inputs: {},
      missingInputs: missing
    };
  }

  if (revenue! === 0) {
    return {
      value: null,
      formula: 'Margen Bruto % = (ingreso - costo_variable) / ingreso × 100',
      inputs: { ingresos: revenue!, costos_variables: variableCosts! },
      missingInputs: ['⚠️ Ingresos = 0, no se puede calcular margen']
    };
  }

  const margin = ((revenue! - variableCosts!) / revenue!) * 100;

  return {
    value: margin,
    formula: 'Margen Bruto % = (ingreso - costo_variable) / ingreso × 100',
    inputs: { ingresos: revenue!, costos_variables: variableCosts! },
    missingInputs: []
  };
}

/**
 * Calculate EBITDA (simplified for demo)
 * Formula: ingresos - costos_variables - costos_fijos - marketing
 */
export function calculateEBITDA(inputs: {
  revenue?: number;
  variableCosts?: number;
  fixedCosts?: number;
  marketing?: number;
}): CalculationResult<number> {
  const missing: string[] = [];
  if (inputs.revenue === undefined) missing.push('ingresos');
  if (inputs.variableCosts === undefined) missing.push('costos variables');
  if (inputs.fixedCosts === undefined) missing.push('costos fijos');

  if (missing.length > 0) {
    return {
      value: null,
      formula: 'EBITDA = ingresos - costos_variables - costos_fijos - marketing',
      inputs: {},
      missingInputs: missing
    };
  }

  const marketing = inputs.marketing || 0;
  const ebitda = inputs.revenue! - inputs.variableCosts! - inputs.fixedCosts! - marketing;

  return {
    value: ebitda,
    formula: 'EBITDA = ingresos - costos_variables - costos_fijos - marketing',
    inputs: {
      ingresos: inputs.revenue!,
      costos_variables: inputs.variableCosts!,
      costos_fijos: inputs.fixedCosts!,
      marketing
    },
    missingInputs: []
  };
}

/**
 * Calculate monthly cashflow
 * Formula: EBITDA - CapEx_mensualizado
 */
export function calculateMonthlyCashflow(
  ebitda?: number,
  monthlyCapex?: number
): CalculationResult<number> {
  const missing: string[] = [];
  if (ebitda === undefined) missing.push('EBITDA');

  if (missing.length > 0) {
    return {
      value: null,
      formula: 'Cashflow Mensual = EBITDA - CapEx_mensualizado',
      inputs: {},
      missingInputs: missing
    };
  }

  const capex = monthlyCapex || 0;
  const cashflow = ebitda! - capex;

  return {
    value: cashflow,
    formula: 'Cashflow Mensual = EBITDA - CapEx_mensualizado',
    inputs: { ebitda: ebitda!, capex_mensual: capex },
    missingInputs: []
  };
}

/**
 * Calculate Customer Lifetime Value
 * Formula: ARPU / churn_mensual
 */
export function calculateLTV(
  arpu?: number,
  monthlyChurn?: number
): CalculationResult<number> {
  const missing: string[] = [];
  if (arpu === undefined) missing.push('ARPU (ingreso promedio por usuario)');
  if (monthlyChurn === undefined) missing.push('churn mensual (%)');

  if (missing.length > 0) {
    return {
      value: null,
      formula: 'LTV = ARPU / churn_mensual',
      inputs: {},
      missingInputs: missing
    };
  }

  if (monthlyChurn! === 0) {
    return {
      value: null,
      formula: 'LTV = ARPU / churn_mensual',
      inputs: { arpu: arpu!, churn: monthlyChurn! },
      missingInputs: ['⚠️ Churn = 0, no se puede calcular LTV']
    };
  }

  return {
    value: arpu! / (monthlyChurn! / 100),
    formula: 'LTV = ARPU / churn_mensual',
    inputs: { arpu: arpu!, churn: monthlyChurn! },
    missingInputs: []
  };
}

/**
 * Calculate CAC Payback Period
 * Formula: CAC / (ARPU - costo_variable_por_usuario)
 */
export function calculateCACPayback(
  cac?: number,
  arpu?: number,
  variableCostPerUser?: number
): CalculationResult<number> {
  const missing: string[] = [];
  if (cac === undefined) missing.push('CAC (costo de adquisición)');
  if (arpu === undefined) missing.push('ARPU (ingreso promedio por usuario)');
  if (variableCostPerUser === undefined) missing.push('costo variable por usuario');

  if (missing.length > 0) {
    return {
      value: null,
      formula: 'CAC Payback = CAC / (ARPU - costo_variable_por_usuario)',
      inputs: {},
      missingInputs: missing
    };
  }

  const netRevenue = arpu! - variableCostPerUser!;

  if (netRevenue <= 0) {
    return {
      value: null,
      formula: 'CAC Payback = CAC / (ARPU - costo_variable_por_usuario)',
      inputs: { cac: cac!, arpu: arpu!, costo_variable: variableCostPerUser! },
      missingInputs: ['⚠️ ARPU ≤ Costo Variable → No se recupera CAC']
    };
  }

  return {
    value: cac! / netRevenue,
    formula: 'CAC Payback = CAC / (ARPU - costo_variable_por_usuario)',
    inputs: { cac: cac!, arpu: arpu!, costo_variable: variableCostPerUser! },
    missingInputs: []
  };
}

/**
 * Format currency in ARS with thousands separator
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format percentage with 1 decimal
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}
