import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ideaText } = await req.json();
    
    if (!ideaText || ideaText.trim().length < 20) {
      return new Response(
        JSON.stringify({ error: 'La descripción debe tener al menos 20 palabras' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    
    if (!anthropicApiKey) {
      console.error('ANTHROPIC_API_KEY no configurada');
      return new Response(
        JSON.stringify({ error: 'API key no configurada' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `Sos un analista de negocios experto en el mercado argentino.

IDEA DE NEGOCIO DEL USUARIO:
"${ideaText}"

Tu tarea es analizar esta idea y generar un informe REALISTA Y ESPECÍFICO.

Devolvé ÚNICAMENTE un objeto JSON válido (sin markdown, sin \`\`\`json) con esta estructura:

{
  "industria": "nombre específico del sector/industria",
  "viabilidad": "alta" | "media" | "baja",
  "descripcion_corta": "resumen de 2 líneas sobre la idea",
  "analisis_mercado": {
    "tamano_mercado": "descripción del tamaño del mercado objetivo",
    "competencia": "alta" | "media" | "baja",
    "tendencias": "principales tendencias actuales del sector"
  },
  "proyeccion_financiera": {
    "ticket_promedio": {
      "min": 1000,
      "max": 5000,
      "moneda": "ARS",
      "justificacion": "por qué estos valores son realistas"
    },
    "costos_fijos_mensuales": {
      "valor": 80000,
      "desglose": "alquiler X, servicios Y, etc."
    },
    "margen_bruto": {
      "porcentaje": 45,
      "explicacion": "típico del sector porque..."
    },
    "inversion_inicial": {
      "valor": 300000,
      "concepto": "equipamiento, stock inicial, etc."
    }
  },
  "recomendaciones": [
    "Recomendación específica 1",
    "Recomendación específica 2",
    "Recomendación específica 3"
  ],
  "riesgos": [
    "Riesgo principal 1",
    "Riesgo principal 2"
  ]
}

REGLAS IMPORTANTES:
- Basá TODOS los números en datos reales del mercado argentino
- Si es repostería → márgenes de repostería
- Si es software → márgenes de tecnología
- Si es e-commerce → costos logísticos realistas
- NO inventes números genéricos
- Justificá cada suposición
- Precios en pesos argentinos (ARS)
- Sé conservador en las proyecciones

RESPONDE SOLO CON EL JSON, SIN TEXTO ADICIONAL.`;

    console.log('Llamando a Claude API...');
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2500,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error de Claude API:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Error al analizar: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    let analysisText = data.content[0].text;
    
    // Limpiar posibles marcadores de markdown
    analysisText = analysisText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    console.log('Respuesta de Claude:', analysisText.substring(0, 200));
    
    // Parsear JSON
    const analysis = JSON.parse(analysisText);
    
    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error en analyze-business-idea:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Error desconocido al analizar la idea'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
