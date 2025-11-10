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
    const body = await req.json();
    const { businessIdea, targetMarket, problem, solution, budget, idea, answers, mode } = body;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Modo Shark Tank
    if (mode === 'shark-tank' && idea && answers) {
      const sharkTankPrompt = `Actúa como un panel experto de inversionistas (estilo Shark Tank) analizando una idea de negocio.

IDEA DEL EMPRENDEDOR:
"""
${idea}
"""

RESPUESTAS A LAS 5 PREGUNTAS CRÍTICAS:

1. Cliente ideal y problema específico:
${answers[0]}

2. Disposición a pagar y evidencia:
${answers[1]}

3. Competidores y diferenciación:
${answers[2]}

4. Inversión necesaria y desglose:
${answers[3]}

5. Plan de validación con $1000 en 2 semanas:
${answers[4]}

INSTRUCCIONES:
Analiza esta idea con el rigor de un inversionista profesional. Evalúa:
- Problema real: ¿Es un dolor genuino?
- Mercado: ¿Tamaño, crecimiento, accesibilidad?
- Competencia: ¿Ventaja defendible?
- Monetización: ¿Modelo claro y probado?

Responde en formato JSON con esta estructura EXACTA:

{
  "viabilityScore": [número entre 0-100],
  "categories": {
    "problema": [número entre 0-100],
    "mercado": [número entre 0-100],
    "competencia": [número entre 0-100],
    "monetizacion": [número entre 0-100]
  },
  "recommendations": [array de 3-4 insights críticos sobre por qué es o no viable],
  "nextSteps": [array de 3-5 acciones concretas y específicas para validar la idea, cada una con tiempo y costo estimado]
}

Sé directo, honesto y específico. Si algo no está claro en las respuestas, mencionalo.`;

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
              content: "Eres un panel experto de inversionistas estilo Shark Tank. Respondes siempre en formato JSON válido con análisis honestos y directos."
            },
            {
              role: "user",
              content: sharkTankPrompt
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
    }

    // Modo original (legacy)
    const prompt = `Actúa como un experto en análisis de negocios y validación de emprendimientos en Argentina, específicamente San Luis.

⚠️ CONTEXTO DE NEGOCIO PRINCIPAL (CRÍTICO - ANCLA TODA TU RESPUESTA EN ESTO):
"""
${businessIdea}
"""

🚨 REGLA ABSOLUTA - ANTI-ALUCINACIÓN:
- TODOS los cálculos financieros (costos, ingresos, márgenes, punto de equilibrio) DEBEN reflejar EXCLUSIVAMENTE el tipo de negocio descrito arriba.
- Si el contexto menciona "local de uñas", NO uses costos de panadería, restaurante o cualquier otro rubro.
- Si el contexto menciona "venta de bebidas alcohólicas", usa SOLO costos y márgenes de ese sector específico.
- NO inventes datos de rubros diferentes al descrito.
- Todos tus números deben ser justificables para ESE negocio específico.
- Si hay ambigüedad en la descripción, haz suposiciones CONSERVADORAS pero siempre dentro del mismo sector.

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
