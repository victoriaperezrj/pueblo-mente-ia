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
    const { businessType, businessName, location } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const prompt = `Actúa como un consultor de negocios experto creando un plan de negocio completo.

NEGOCIO:
Tipo: ${businessType || 'Emprendimiento general'}
Nombre: ${businessName || 'Mi Negocio'}
Ubicación: ${location || 'San Luis, Argentina'}

INSTRUCCIONES:
Genera un Business Blueprint completo y detallado para este negocio en formato JSON con la siguiente estructura EXACTA:

{
  "businessModel": {
    "valueProposition": "[propuesta de valor única y específica]",
    "targetCustomers": [array de 4 segmentos de clientes específicos],
    "channels": [array de 4 canales de distribución/venta],
    "revenueStreams": [array de 4 fuentes de ingreso]
  },
  "operations": {
    "keyActivities": [array de 5 actividades clave diarias/semanales],
    "keyResources": [array de 5 recursos necesarios específicos],
    "keyPartners": [array de 5 socios estratégicos locales]
  },
  "financial": {
    "initialInvestment": "[rango en pesos argentinos: $XXX.XXX - $XXX.XXX]",
    "monthlyCosts": "[desglose de costos mensuales en pesos]",
    "breakEvenPoint": "[descripción del punto de equilibrio]",
    "projectedRevenue": "[proyección Año 1, 2 y 3 en formato: Año 1: $X.XM | Año 2: $X.XM | Año 3: $X.XM]"
  },
  "marketing": {
    "strategies": [array de 6 estrategias de marketing concretas],
    "budget": "[presupuesto mensual recomendado]",
    "kpis": [array de 4 KPIs medibles]
  },
  "timeline": [
    {
      "phase": "[nombre de fase]",
      "duration": "[duración en meses]",
      "milestones": [array de 4 hitos específicos]
    }
  ] (incluir 4 fases: Preparación, Lanzamiento Soft, Lanzamiento Público, Crecimiento)
}

Sé específico, usa números realistas para Argentina y San Luis, incluye proveedores/partners locales cuando sea posible.`;

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
            content: "Eres un consultor de negocios experto especializado en Argentina. Creas planes de negocio detallados y realistas. Respondes siempre en formato JSON válido."
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
    console.error("Error in generate-blueprint:", error);
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
