import { supabase } from "@/integrations/supabase/client";

interface OnboardingData {
  stage: "entrepreneur" | "business" | "pyme_enterprise";
  problem_description?: string;
  target_customer?: string;
  available_time?: string;
  initial_budget?: string;
  business_type?: string;
  time_in_business?: string;
  monthly_customers?: string;
  main_problem?: string;
  company_description?: string;
  employee_count?: string;
  monthly_revenue?: string;
  main_challenge?: string;
}

const TOOL_SETS = {
  entrepreneur: [
    { key: "idea-validator", name: "Validador de Ideas" },
    { key: "market-analysis", name: "Análisis de Mercado" },
    { key: "budget-calculator", name: "Calculadora de Presupuesto" },
    { key: "business-plan", name: "Plan de Negocio" },
  ],
  business: [
    { key: "price-optimizer", name: "Optimizador de Precios" },
    { key: "customer-acquisition", name: "Captador de Clientes" },
    { key: "automation", name: "Automatizador" },
    { key: "profitability-analyzer", name: "Analizador de Rentabilidad" },
  ],
  pyme_enterprise: [
    { key: "realtime-dashboard", name: "Dashboard en Tiempo Real" },
    { key: "team-structurer", name: "Estructurador de Equipos" },
    { key: "kpi-system", name: "Sistema de KPIs" },
    { key: "strategic-planner", name: "Planificador Estratégico" },
  ],
};

export function useOnboarding() {
  async function saveOnboardingData(data: OnboardingData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No user found");

    const { error } = await supabase
      .from("onboarding_data")
      .insert({
        user_id: user.id,
        ...data,
      });

    if (error) throw error;
  }

  async function completeOnboarding(stage: "entrepreneur" | "business" | "pyme_enterprise") {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No user found");

    // Update profile to mark onboarding as complete
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ 
        user_type: stage,
        onboarding_completed: true 
      })
      .eq("id", user.id);

    if (profileError) throw profileError;

    // Assign tools based on stage
    const tools = TOOL_SETS[stage];
    const toolsToInsert = tools.map((tool) => ({
      user_id: user.id,
      tool_key: tool.key,
      tool_name: tool.name,
      enabled: true,
    }));

    const { error: toolsError } = await supabase
      .from("user_tools")
      .insert(toolsToInsert);

    if (toolsError) throw toolsError;
  }

  return { saveOnboardingData, completeOnboarding };
}
