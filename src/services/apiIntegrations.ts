/**
 * API Integrations Service
 *
 * Handles integrations with external APIs:
 * - AFIP (Argentine tax authority)
 * - BCRA (Central Bank of Argentina)
 * - Google Ads API
 * - Meta Ads API
 */

import { supabase } from '@/integrations/supabase/client';

// =====================================================
// TYPES
// =====================================================

export interface AFIPInvoiceRequest {
  tipo_comprobante: number; // 1=Factura A, 6=Factura B, 11=Factura C
  punto_venta: number;
  concepto: number; // 1=Productos, 2=Servicios, 3=Productos y Servicios
  fecha_servicio_desde?: string;
  fecha_servicio_hasta?: string;
  fecha_vencimiento_pago?: string;
  cuit_receptor: string;
  tipo_documento_receptor: number; // 80=CUIT, 96=DNI, 99=Sin identificar
  neto_gravado: number;
  neto_no_gravado: number;
  neto_exento: number;
  iva: Array<{
    id: number; // 3=0%, 4=10.5%, 5=21%, 6=27%
    base_imponible: number;
    importe: number;
  }>;
  tributos?: Array<{
    id: number;
    descripcion: string;
    base_imponible: number;
    alicuota: number;
    importe: number;
  }>;
  total: number;
}

export interface AFIPInvoiceResponse {
  success: boolean;
  cae?: string;
  cae_vencimiento?: string;
  numero_comprobante?: number;
  punto_venta?: number;
  tipo_comprobante?: number;
  fecha_emision?: string;
  error?: string;
  observaciones?: string[];
}

export interface AFIPTaxpayerInfo {
  cuit: string;
  razon_social: string;
  tipo_persona: 'FISICA' | 'JURIDICA';
  condicion_iva: string;
  domicilio_fiscal: {
    direccion: string;
    localidad: string;
    provincia: string;
    codigo_postal: string;
  };
  actividad_principal?: {
    codigo: string;
    descripcion: string;
  };
  monotributo?: {
    categoria: string;
    actividades: string[];
  };
}

export interface BCRAExchangeRate {
  fecha: string;
  tipo: 'OFICIAL' | 'BLUE' | 'MEP' | 'CCL' | 'MAYORISTA';
  compra: number;
  venta: number;
  variacion?: number;
  variacion_porcentaje?: number;
}

export interface GoogleAdsCampaign {
  id: string;
  name: string;
  status: 'ENABLED' | 'PAUSED' | 'REMOVED';
  budget: number;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  conversion_value: number;
  ctr: number;
  cpc: number;
  cpl: number;
  roas: number;
  start_date: string;
  end_date?: string;
}

export interface MetaAdsCampaign {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
  objective: string;
  budget: number;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  conversion_value: number;
  ctr: number;
  cpc: number;
  cpl: number;
  roas: number;
  date_start: string;
  date_stop?: string;
}

// =====================================================
// AFIP INTEGRATION
// =====================================================

class AFIPService {
  private apiUrl: string;

  constructor() {
    // In production, this would be your backend API endpoint
    this.apiUrl = import.meta.env.VITE_AFIP_API_URL || '/api/afip';
  }

  /**
   * Validate CUIT checksum
   */
  validateCUIT(cuit: string): boolean {
    const cleanCuit = cuit.replace(/\D/g, '');
    if (cleanCuit.length !== 11) return false;

    const digits = cleanCuit.split('').map(Number);
    const multipliers = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * multipliers[i];
    }

    const remainder = sum % 11;
    const verifier = remainder === 0 ? 0 : remainder === 1 ? 9 : 11 - remainder;

    return verifier === digits[10];
  }

  /**
   * Get taxpayer information from AFIP
   * Requires backend with valid AFIP credentials
   */
  async getTaxpayerInfo(cuit: string): Promise<AFIPTaxpayerInfo> {
    if (!this.validateCUIT(cuit)) {
      throw new Error('Invalid CUIT format');
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No authenticated session');

      const response = await fetch(`${this.apiUrl}/taxpayer/${cuit}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`AFIP API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching taxpayer info:', error);
      // Return mock data for development
      return this.getMockTaxpayerInfo(cuit);
    }
  }

  /**
   * Request CAE (Código de Autorización Electrónico) for electronic invoice
   * Requires backend with valid AFIP credentials and certificates
   */
  async requestCAE(invoice: AFIPInvoiceRequest): Promise<AFIPInvoiceResponse> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No authenticated session');

      const response = await fetch(`${this.apiUrl}/invoice/cae`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoice)
      });

      if (!response.ok) {
        throw new Error(`AFIP CAE request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error requesting CAE:', error);
      // Return mock CAE for development
      return this.getMockCAE();
    }
  }

  /**
   * Get next invoice number for a point of sale
   */
  async getNextInvoiceNumber(puntoVenta: number, tipoComprobante: number): Promise<number> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No authenticated session');

      const response = await fetch(
        `${this.apiUrl}/invoice/next-number?punto_venta=${puntoVenta}&tipo_comprobante=${tipoComprobante}`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get next invoice number: ${response.statusText}`);
      }

      const data = await response.json();
      return data.next_number || 1;
    } catch (error) {
      console.error('Error getting next invoice number:', error);
      return 1; // Return 1 for development
    }
  }

  // Mock data for development
  private getMockTaxpayerInfo(cuit: string): AFIPTaxpayerInfo {
    return {
      cuit,
      razon_social: 'CONTRIBUYENTE EJEMPLO S.R.L.',
      tipo_persona: 'JURIDICA',
      condicion_iva: 'RESPONSABLE_INSCRIPTO',
      domicilio_fiscal: {
        direccion: 'Av. Corrientes 1234',
        localidad: 'CABA',
        provincia: 'Ciudad Autónoma de Buenos Aires',
        codigo_postal: '1043'
      },
      actividad_principal: {
        codigo: '620100',
        descripcion: 'Desarrollo de software y consultoría informática'
      }
    };
  }

  private getMockCAE(): AFIPInvoiceResponse {
    const today = new Date();
    const vencimiento = new Date(today);
    vencimiento.setDate(vencimiento.getDate() + 10);

    return {
      success: true,
      cae: Math.random().toString().slice(2, 16),
      cae_vencimiento: vencimiento.toISOString().split('T')[0],
      numero_comprobante: Math.floor(Math.random() * 1000) + 1,
      punto_venta: 1,
      tipo_comprobante: 11,
      fecha_emision: today.toISOString().split('T')[0]
    };
  }
}

// =====================================================
// BCRA (CENTRAL BANK) INTEGRATION
// =====================================================

class BCRAService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = 'https://api.bcra.gob.ar';
  }

  /**
   * Get current exchange rates
   */
  async getExchangeRates(): Promise<BCRAExchangeRate[]> {
    try {
      const response = await fetch(`${this.apiUrl}/estadisticas/v1.0/principales-variables`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch BCRA data');
      }

      const data = await response.json();
      return this.parseExchangeRates(data);
    } catch (error) {
      console.error('Error fetching BCRA exchange rates:', error);
      return this.getMockExchangeRates();
    }
  }

  /**
   * Get USD official exchange rate
   */
  async getUSDRate(): Promise<BCRAExchangeRate> {
    const rates = await this.getExchangeRates();
    return rates.find(r => r.tipo === 'OFICIAL') || rates[0];
  }

  private parseExchangeRates(data: any[]): BCRAExchangeRate[] {
    // Parse BCRA API response
    const today = new Date().toISOString().split('T')[0];

    return [
      {
        fecha: today,
        tipo: 'OFICIAL',
        compra: data[0]?.valor || 350,
        venta: data[0]?.valor ? data[0].valor * 1.02 : 357,
        variacion: 2.5,
        variacion_porcentaje: 0.72
      }
    ];
  }

  private getMockExchangeRates(): BCRAExchangeRate[] {
    const today = new Date().toISOString().split('T')[0];

    return [
      {
        fecha: today,
        tipo: 'OFICIAL',
        compra: 350.50,
        venta: 357.50,
        variacion: 2.5,
        variacion_porcentaje: 0.72
      },
      {
        fecha: today,
        tipo: 'BLUE',
        compra: 720.00,
        venta: 740.00,
        variacion: -5.0,
        variacion_porcentaje: -0.67
      },
      {
        fecha: today,
        tipo: 'MEP',
        compra: 685.00,
        venta: 695.00,
        variacion: 1.5,
        variacion_porcentaje: 0.22
      }
    ];
  }
}

// =====================================================
// GOOGLE ADS INTEGRATION
// =====================================================

class GoogleAdsService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = import.meta.env.VITE_GOOGLE_ADS_API_URL || '/api/google-ads';
  }

  /**
   * Get all campaigns with metrics
   */
  async getCampaigns(dateStart?: string, dateEnd?: string): Promise<GoogleAdsCampaign[]> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No authenticated session');

      const params = new URLSearchParams();
      if (dateStart) params.append('date_start', dateStart);
      if (dateEnd) params.append('date_end', dateEnd);

      const response = await fetch(`${this.apiUrl}/campaigns?${params}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Google Ads campaigns');
      }

      const data = await response.json();
      return data.campaigns || [];
    } catch (error) {
      console.error('Error fetching Google Ads campaigns:', error);
      return this.getMockCampaigns();
    }
  }

  /**
   * Get campaign metrics summary
   */
  async getCampaignMetrics(): Promise<{
    total_spend: number;
    total_impressions: number;
    total_clicks: number;
    total_conversions: number;
    avg_ctr: number;
    avg_cpc: number;
    avg_cpl: number;
    total_roas: number;
  }> {
    const campaigns = await this.getCampaigns();

    return {
      total_spend: campaigns.reduce((sum, c) => sum + c.cost, 0),
      total_impressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
      total_clicks: campaigns.reduce((sum, c) => sum + c.clicks, 0),
      total_conversions: campaigns.reduce((sum, c) => sum + c.conversions, 0),
      avg_ctr: campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.length,
      avg_cpc: campaigns.reduce((sum, c) => sum + c.cpc, 0) / campaigns.length,
      avg_cpl: campaigns.reduce((sum, c) => sum + c.cpl, 0) / campaigns.length,
      total_roas: campaigns.reduce((sum, c) => sum + c.conversion_value, 0) /
                  campaigns.reduce((sum, c) => sum + c.cost, 0)
    };
  }

  private getMockCampaigns(): GoogleAdsCampaign[] {
    return [
      {
        id: 'gads-1',
        name: 'Campaña de Búsqueda - Productos',
        status: 'ENABLED',
        budget: 50000,
        impressions: 125000,
        clicks: 3500,
        cost: 45000,
        conversions: 180,
        conversion_value: 720000,
        ctr: 2.8,
        cpc: 12.86,
        cpl: 250.00,
        roas: 16.0,
        start_date: '2024-11-01',
      },
      {
        id: 'gads-2',
        name: 'Display - Retargeting',
        status: 'ENABLED',
        budget: 30000,
        impressions: 450000,
        clicks: 2200,
        cost: 25000,
        conversions: 95,
        conversion_value: 380000,
        ctr: 0.49,
        cpc: 11.36,
        cpl: 263.16,
        roas: 15.2,
        start_date: '2024-11-01',
      }
    ];
  }
}

// =====================================================
// META ADS INTEGRATION
// =====================================================

class MetaAdsService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = import.meta.env.VITE_META_ADS_API_URL || '/api/meta-ads';
  }

  /**
   * Get all campaigns with metrics
   */
  async getCampaigns(dateStart?: string, dateEnd?: string): Promise<MetaAdsCampaign[]> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No authenticated session');

      const params = new URLSearchParams();
      if (dateStart) params.append('date_start', dateStart);
      if (dateEnd) params.append('date_end', dateEnd);

      const response = await fetch(`${this.apiUrl}/campaigns?${params}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Meta Ads campaigns');
      }

      const data = await response.json();
      return data.campaigns || [];
    } catch (error) {
      console.error('Error fetching Meta Ads campaigns:', error);
      return this.getMockCampaigns();
    }
  }

  /**
   * Get campaign metrics summary
   */
  async getCampaignMetrics(): Promise<{
    total_spend: number;
    total_impressions: number;
    total_clicks: number;
    total_conversions: number;
    avg_ctr: number;
    avg_cpc: number;
    avg_cpl: number;
    total_roas: number;
  }> {
    const campaigns = await this.getCampaigns();

    return {
      total_spend: campaigns.reduce((sum, c) => sum + c.spend, 0),
      total_impressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
      total_clicks: campaigns.reduce((sum, c) => sum + c.clicks, 0),
      total_conversions: campaigns.reduce((sum, c) => sum + c.conversions, 0),
      avg_ctr: campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.length,
      avg_cpc: campaigns.reduce((sum, c) => sum + c.cpc, 0) / campaigns.length,
      avg_cpl: campaigns.reduce((sum, c) => sum + c.cpl, 0) / campaigns.length,
      total_roas: campaigns.reduce((sum, c) => sum + c.conversion_value, 0) /
                  campaigns.reduce((sum, c) => sum + c.spend, 0)
    };
  }

  private getMockCampaigns(): MetaAdsCampaign[] {
    return [
      {
        id: 'meta-1',
        name: 'Conversiones - Página de Producto',
        status: 'ACTIVE',
        objective: 'CONVERSIONS',
        budget: 40000,
        impressions: 380000,
        clicks: 4200,
        spend: 38000,
        conversions: 195,
        conversion_value: 780000,
        ctr: 1.11,
        cpc: 9.05,
        cpl: 194.87,
        roas: 20.5,
        date_start: '2024-11-01',
      },
      {
        id: 'meta-2',
        name: 'Tráfico - Landing Page',
        status: 'ACTIVE',
        objective: 'TRAFFIC',
        budget: 25000,
        impressions: 520000,
        clicks: 5800,
        spend: 22000,
        conversions: 145,
        conversion_value: 435000,
        ctr: 1.12,
        cpc: 3.79,
        cpl: 151.72,
        roas: 19.8,
        date_start: '2024-11-01',
      }
    ];
  }
}

// =====================================================
// EXPORT INSTANCES
// =====================================================

export const afipService = new AFIPService();
export const bcraService = new BCRAService();
export const googleAdsService = new GoogleAdsService();
export const metaAdsService = new MetaAdsService();
