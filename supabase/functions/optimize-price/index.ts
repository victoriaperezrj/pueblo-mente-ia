import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { product, analysis } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY no configurada');
    }

    // Construir prompt para la IA
    const systemPrompt = `Eres un experto en pricing y optimización de precios para negocios argentinos. 
Tu objetivo es analizar productos y recomendar precios óptimos que maximicen ganancias sin perder clientes.

Debes considerar:
- Costos y márgenes actuales
- Competencia y posicionamiento
- Elasticidad de demanda
- Condiciones del mercado
- Poder adquisitivo del segmento objetivo
- Factores estacionales

Responde SIEMPRE en formato JSON con esta estructura exacta:
{
  "recommended_price": número,
  "current_margin": número (porcentaje),
  "recommended_margin": número (porcentaje),
  "reasoning": "texto explicando el razonamiento",
  "competitive_analysis": "análisis de competencia",
  "demand_elasticity": "análisis de elasticidad",
  "action_items": ["item1", "item2", "item3"]
}`;

    const userPrompt = `Analiza este producto y recomienda el precio óptimo:

PRODUCTO:
- Nombre: ${product.name}
- Precio Actual: $${product.current_price}
- Costo: $${product.cost_price}
- Categoría: ${product.category}
- Margen Actual: ${((1 - product.cost_price / product.current_price) * 100).toFixed(1)}%

DATOS DEL MERCADO:
${analysis.market_conditions ? `- Condiciones: ${analysis.market_conditions}` : ''}
${analysis.competitor_prices ? `- Competencia: ${analysis.competitor_prices}` : ''}
${analysis.target_segment ? `- Segmento: ${analysis.target_segment}` : ''}
${analysis.seasonal_factors ? `- Factores Estacionales: ${analysis.seasonal_factors}` : ''}

Recomienda el precio óptimo considerando todos estos factores. El precio debe ser realista para el mercado argentino.`;

    console.log('Calling Lovable AI...');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        throw new Error('Límite de uso excedido. Intenta nuevamente en unos minutos.');
      }
      if (aiResponse.status === 402) {
        throw new Error('Créditos insuficientes. Contacta soporte.');
      }
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      throw new Error('Error al llamar a la IA');
    }

    const aiData = await aiResponse.json();
    console.log('AI Response:', aiData);

    const content = aiData.choices[0].message.content;
    
    // Extraer JSON del contenido
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No se pudo extraer JSON de la respuesta');
    }

    const recommendation = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify(recommendation),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Error al optimizar precio' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
