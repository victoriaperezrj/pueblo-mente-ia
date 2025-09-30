import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      initialInvestment, 
      productPrice, 
      productCost, 
      unitsPerMonth, 
      fixedCosts, 
      variableCosts,
      results 
    } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const prompt = `Actúa como un asesor financiero experto analizando una simulación de negocio.

DATOS DEL NEGOCIO:
- Inversión inicial: $${initialInvestment}
- Precio de venta: $${productPrice}
- Costo unitario: $${productCost}
- Unidades vendidas/mes: ${unitsPerMonth}
- Costos fijos mensuales: $${fixedCosts}
- Costos variables mensuales: $${variableCosts}

RESULTADOS DE LA SIMULACIÓN:
- Ingreso mensual: $${results.monthlyRevenue}
- Ingreso anual: $${results.yearlyRevenue}
- Costo mensual: $${results.monthlyCost}
- Costo anual: $${results.yearlyCost}
- Ganancia mensual: $${results.monthlyProfit}
- Ganancia anual: $${results.yearlyProfit}
- Margen de ganancia: ${results.profitMargin}%
- Punto de equilibrio: ${results.breakEvenUnits} unidades
- ROI: ${results.roi}%
- Periodo de recuperación: ${results.paybackPeriod} meses

INSTRUCCIONES:
Genera un análisis financiero completo y recomendaciones en formato JSON con la siguiente estructura EXACTA:

{
  "analysis": "[análisis detallado de 3-4 párrafos sobre la viabilidad financiera, márgenes, punto de equilibrio y proyección]",
  "recommendations": [
    "[recomendación específica 1]",
    "[recomendación específica 2]",
    "[recomendación específica 3]",
    "[recomendación específica 4]",
    "[recomendación específica 5]"
  ],
  "risks": [
    "[riesgo potencial 1]",
    "[riesgo potencial 2]",
    "[riesgo potencial 3]"
  ],
  "opportunities": [
    "[oportunidad de mejora 1]",
    "[oportunidad de mejora 2]",
    "[oportunidad de mejora 3]"
  ],
  "verdict": "[VIABLE/VIABLE CON AJUSTES/NO VIABLE] - [explicación breve]"
}

Sé específico, usa los números proporcionados y da recomendaciones accionables para Argentina.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "Eres un asesor financiero experto especializado en análisis de viabilidad de negocios en Argentina. Respondes siempre en formato JSON válido."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de solicitudes excedido. Intentá de nuevo en unos momentos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos agotados. Por favor, recargá tu cuenta." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    let result;
    try {
      result = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Invalid AI response format");
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in simulate-financial:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Error desconocido"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
