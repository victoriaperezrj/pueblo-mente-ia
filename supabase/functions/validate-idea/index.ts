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
    const { businessIdea, targetMarket, problem, solution, budget } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const prompt = `Actúa como un experto en análisis de negocios y validación de emprendimientos en Argentina, específicamente San Luis.

CONTEXTO DE NEGOCIO PRINCIPAL (CRÍTICO - USAR EXCLUSIVAMENTE ESTE CONTEXTO):
${businessIdea}

IMPORTANTE: TODOS los cálculos, análisis, costos, ingresos y proyecciones DEBEN basarse EXCLUSIVAMENTE en el contexto de negocio descrito arriba. 
NO inventes datos de otros rubros ni uses suposiciones de negocios diferentes.

MERCADO OBJETIVO:
${targetMarket}

PROBLEMA QUE RESUELVE:
${problem}

SOLUCIÓN PROPUESTA:
${solution}

PRESUPUESTO ESTIMADO: ${budget ? `$${budget}` : 'No especificado'}

INSTRUCCIONES:
Analiza esta idea de negocio y proporciona un análisis FODA completo con una puntuación de viabilidad (0-100). 
CRÍTICO: Todo tu análisis debe estar alineado con el CONTEXTO DE NEGOCIO PRINCIPAL. Si es un "local de uñas", analiza costos de manicura, productos de belleza, etc. Si es "venta de bebidas", analiza costos de licores, logística, etc.
Responde en formato JSON con esta estructura EXACTA:

{
  "score": [número entre 0-100],
  "strengths": [array de 4-5 fortalezas específicas],
  "weaknesses": [array de 4-5 debilidades específicas],
  "opportunities": [array de 4-5 oportunidades específicas],
  "threats": [array de 4-5 amenazas específicas],
  "marketSize": "[descripción del tamaño de mercado en San Luis con números estimados]",
  "competition": "[análisis de competencia en San Luis]",
  "recommendation": "[recomendación clara: VIABLE, VIABLE CON AJUSTES, o NO VIABLE, con justificación]",
  "nextSteps": [array de 5 pasos concretos y accionables]
}

Sé específico con el contexto de San Luis, Argentina. Usa datos realistas y proyecciones basadas en el mercado local.`;

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
            content: "Eres un experto analista de negocios especializado en el mercado argentino. Respondes siempre en formato JSON válido."
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
    console.error("Error in validate-idea:", error);
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
