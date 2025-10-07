import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-demo-mode',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // SECURITY: Check authentication OR demo mode with rate limiting
    const authHeader = req.headers.get('Authorization');
    const isDemo = req.headers.get('X-Demo-Mode') === 'true';
    
    // Get IP address for rate limiting
    const ip = req.headers.get('CF-Connecting-IP') || 
               req.headers.get('X-Forwarded-For') || 
               req.headers.get('X-Real-IP') || 
               'unknown';
    
    // For demo mode, enforce strict rate limiting
    if (isDemo) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      // Check rate limit (max 5 requests per hour per IP)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      
      const { count, error: countError } = await supabase
        .from('api_rate_limits')
        .select('*', { count: 'exact', head: true })
        .eq('ip_address', ip)
        .eq('endpoint', 'analyze-business-idea')
        .gte('created_at', oneHourAgo);
      
      if (countError) {
        console.error('Rate limit check error:', countError);
      }
      
      if (count && count >= 5) {
        return new Response(
          JSON.stringify({ 
            error: 'Has alcanzado el límite de 5 análisis por hora en modo demo. Creá una cuenta gratis para acceso ilimitado.' 
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Log this request for rate limiting
      await supabase.from('api_rate_limits').insert({
        ip_address: ip,
        endpoint: 'analyze-business-idea'
      });
    } else if (!authHeader) {
      // Not demo mode and not authenticated - reject
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Parse and validate input
    const { ideaText } = await req.json();
    
    if (!ideaText || typeof ideaText !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid input: ideaText is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // SECURITY: Input validation to prevent abuse and cost explosion
    const trimmedText = ideaText.trim();
    
    if (trimmedText.length < 20) {
      return new Response(
        JSON.stringify({ error: 'La descripción debe tener al menos 20 caracteres' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (trimmedText.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'La descripción no puede tener más de 2000 caracteres' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // SECURITY: Sanitize input to prevent prompt injection
    const sanitizedText = trimmedText
      .replace(/```/g, '')
      .replace(/<!--/g, '')
      .replace(/-->/g, '')
      .replace(/<script>/gi, '')
      .replace(/<\/script>/gi, '');

    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    
    if (!anthropicApiKey) {
      console.error('ANTHROPIC_API_KEY no configurada');
      return new Response(
        JSON.stringify({ error: 'Servicio temporalmente no disponible' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `Sos un analista de negocios experto en el mercado argentino.

IDEA DE NEGOCIO DEL USUARIO:
"${sanitizedText}"

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
