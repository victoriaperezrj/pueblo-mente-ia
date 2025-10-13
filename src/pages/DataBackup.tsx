import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Database, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const DataBackup = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [backupFrequency, setBackupFrequency] = useState<string>("weekly");

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

  const downloadSQL = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateSQLInserts = (data: any[], tableName: string): string => {
    if (!data || data.length === 0) return `-- No data in ${tableName}\n\n`;
    
    const columns = Object.keys(data[0]);
    let sql = `-- Insert data for ${tableName}\n`;
    
    data.forEach((row) => {
      const values = columns.map(col => {
        const val = row[col];
        if (val === null) return 'NULL';
        if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
        if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
        return val;
      }).join(', ');
      
      sql += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values});\n`;
    });
    
    return sql + '\n';
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

  const exportAllSQL = async () => {
    try {
      setLoading('all-sql');
      
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

      let allSQL = `-- Respaldo completo generado el ${new Date().toISOString()}\n`;
      allSQL += `-- IMPORTANTE: Primero ejecuta las migraciones de supabase/migrations/\n`;
      allSQL += `-- Luego ejecuta este archivo para importar los datos\n\n`;

      for (const table of tables) {
        const { data, error } = await (supabase as any).from(table.name).select('*');
        if (!error && data && data.length > 0) {
          allSQL += generateSQLInserts(data, table.name);
        }
      }

      downloadSQL(allSQL, 'respaldo_completo');
      toast.success('SQL de respaldo generado', {
        description: 'Listo para copiar en tu nuevo Supabase'
      });
    } catch (error: any) {
      toast.error('Error al generar SQL', {
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
            Descarga un respaldo completo de todas tus tablas
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button
            onClick={exportAll}
            disabled={loading !== null}
            size="lg"
            className="flex-1"
          >
            {loading === 'all' ? 'Exportando...' : 'JSON'}
          </Button>
          <Button
            onClick={exportAllSQL}
            disabled={loading !== null}
            size="lg"
            variant="secondary"
            className="flex-1"
          >
            {loading === 'all-sql' ? 'Generando...' : 'SQL (para migrar)'}
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

      <Card className="bg-muted/50 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Frecuencia de Respaldos
          </CardTitle>
          <CardDescription>
            Configura con qué frecuencia quieres realizar respaldos automáticos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={backupFrequency} onValueChange={setBackupFrequency}>
            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="daily" id="daily" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="daily" className="cursor-pointer font-medium">
                  Diario
                </Label>
                <p className="text-xs text-muted-foreground">Todos los días a las 2:00 AM</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="weekly" id="weekly" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="weekly" className="cursor-pointer font-medium">
                  Semanal
                </Label>
                <p className="text-xs text-muted-foreground">Cada lunes a las 2:00 AM</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="biweekly" id="biweekly" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="biweekly" className="cursor-pointer font-medium">
                  Quincenal
                </Label>
                <p className="text-xs text-muted-foreground">Días 1 y 15 de cada mes</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="monthly" id="monthly" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="monthly" className="cursor-pointer font-medium">
                  Mensual
                </Label>
                <p className="text-xs text-muted-foreground">Primer día de cada mes</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="custom" id="custom" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="custom" className="cursor-pointer font-medium">
                  Personalizado
                </Label>
                <p className="text-xs text-muted-foreground">Selecciona fecha y hora específicos</p>
              </div>
            </div>
          </RadioGroup>

          <Button className="w-full" variant="outline">
            Guardar Configuración
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Recomendaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• <strong>JSON:</strong> Para respaldos locales y portabilidad</p>
          <p>• <strong>SQL:</strong> Para migrar a tu propio Supabase - copia y pega en SQL Editor</p>
          <p>• <strong>Importante:</strong> Si vas a migrar, primero ejecuta las migraciones de supabase/migrations/ y luego el SQL generado</p>
          <p>• Realiza respaldos periódicamente (semanalmente o mensualmente)</p>
          <p>• Guarda los archivos en múltiples ubicaciones (nube, disco externo, etc.)</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataBackup;