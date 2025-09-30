import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Database, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const DataBackup = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportTable = async (tableName: string, displayName: string) => {
    try {
      setLoading(tableName);
      const { data, error } = await (supabase as any).from(tableName).select('*');
      
      if (error) throw error;
      
      downloadJSON(data, tableName);
      toast.success(`${displayName} exportado correctamente`, {
        description: `${data?.length || 0} registros descargados`
      });
    } catch (error: any) {
      toast.error(`Error al exportar ${displayName}`, {
        description: error.message
      });
    } finally {
      setLoading(null);
    }
  };

  const exportAll = async () => {
    try {
      setLoading('all');
      
      const tables = [
        { name: 'businesses', display: 'Negocios' },
        { name: 'products', display: 'Productos' },
        { name: 'customers', display: 'Clientes' },
        { name: 'sales', display: 'Ventas' },
        { name: 'expenses', display: 'Gastos' },
        { name: 'appointments', display: 'Citas' },
        { name: 'inventory_movements', display: 'Movimientos de Inventario' },
        { name: 'marketplace_listings', display: 'Publicaciones del Mercado' },
        { name: 'marketplace_requests', display: 'Solicitudes del Mercado' },
      ];

      const allData: any = {
        export_date: new Date().toISOString(),
        tables: {}
      };

      for (const table of tables) {
        const { data, error } = await (supabase as any).from(table.name).select('*');
        if (!error && data) {
          allData.tables[table.name] = data;
        }
      }

      downloadJSON(allData, 'respaldo_completo');
      toast.success('Respaldo completo exportado', {
        description: 'Todos los datos han sido descargados'
      });
    } catch (error: any) {
      toast.error('Error al crear respaldo completo', {
        description: error.message
      });
    } finally {
      setLoading(null);
    }
  };

  const tables = [
    { name: 'businesses', display: 'Negocios', icon: Database },
    { name: 'products', display: 'Productos', icon: Database },
    { name: 'customers', display: 'Clientes', icon: Database },
    { name: 'sales', display: 'Ventas', icon: Database },
    { name: 'expenses', display: 'Gastos', icon: Database },
    { name: 'appointments', display: 'Citas', icon: Database },
    { name: 'inventory_movements', display: 'Movimientos de Inventario', icon: Database },
    { name: 'marketplace_listings', display: 'Publicaciones del Mercado', icon: Database },
    { name: 'marketplace_requests', display: 'Solicitudes del Mercado', icon: Database },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Respaldo de Datos</h1>
        <p className="text-muted-foreground">
          Exporta tus datos a archivos JSON para mantener respaldos seguros
        </p>
      </div>

      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportar Todo
          </CardTitle>
          <CardDescription>
            Descarga un respaldo completo de todas tus tablas en un solo archivo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={exportAll}
            disabled={loading !== null}
            size="lg"
            className="w-full"
          >
            {loading === 'all' ? 'Exportando...' : 'Descargar Respaldo Completo'}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tables.map((table) => {
          const Icon = table.icon;
          return (
            <Card key={table.name}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="h-4 w-4" />
                  {table.display}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => exportTable(table.name, table.display)}
                  disabled={loading !== null}
                  variant="outline"
                  className="w-full"
                >
                  {loading === table.name ? (
                    'Exportando...'
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Recomendaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• Realiza respaldos periódicamente (semanalmente o mensualmente)</p>
          <p>• Guarda los archivos en múltiples ubicaciones (nube, disco externo, etc.)</p>
          <p>• Los archivos JSON se pueden importar fácilmente en otras bases de datos</p>
          <p>• Verifica que los archivos descargados contengan tus datos correctamente</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataBackup;