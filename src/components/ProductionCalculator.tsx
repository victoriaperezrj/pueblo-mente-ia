import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertCircle } from 'lucide-react';

export function ProductionCalculator() {
  const [rawMaterialKg, setRawMaterialKg] = useState(1);
  const [costPerKg, setCostPerKg] = useState(1000);
  const [unitsPerKg, setUnitsPerKg] = useState(10);
  const [productionTimeMinutes, setProductionTimeMinutes] = useState(60);
  const [workHoursPerDay, setWorkHoursPerDay] = useState(8);
  const [otherCostsPerUnit, setOtherCostsPerUnit] = useState(50);
  const [salePrice, setSalePrice] = useState(1000);
  
  // Cálculos
  const unitCost = (costPerKg / unitsPerKg) + otherCostsPerUnit;
  const unitsPerHour = (60 / productionTimeMinutes) * unitsPerKg;
  const maxDailyProduction = unitsPerHour * workHoursPerDay;
  const maxDailyRevenue = maxDailyProduction * salePrice;
  const profitPerUnit = salePrice - unitCost;
  const maxDailyProfit = maxDailyProduction * profitPerUnit;
  
  return (
    <Card className="p-6 border-2">
      <h3 className="text-xl font-bold mb-6">Calculadora de Producción</h3>
      
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Materia Prima (kg por unidad)</Label>
            <Input 
              type="number" 
              step="0.01"
              value={rawMaterialKg}
              onChange={(e) => setRawMaterialKg(Number(e.target.value))}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Ej: 0.1kg de harina por pan
            </p>
          </div>
          
          <div>
            <Label>Costo por kg ($)</Label>
            <Input 
              type="number" 
              value={costPerKg}
              onChange={(e) => setCostPerKg(Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Unidades que sacás por kg</Label>
            <Input 
              type="number" 
              value={unitsPerKg}
              onChange={(e) => setUnitsPerKg(Number(e.target.value))}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Tiempo de producción (minutos por lote)</Label>
            <Input 
              type="number" 
              value={productionTimeMinutes}
              onChange={(e) => setProductionTimeMinutes(Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Horas que podés trabajar por día</Label>
            <Input 
              type="number" 
              value={workHoursPerDay}
              onChange={(e) => setWorkHoursPerDay(Number(e.target.value))}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Otros costos por unidad ($ - envase, gas, etc)</Label>
            <Input 
              type="number" 
              value={otherCostsPerUnit}
              onChange={(e) => setOtherCostsPerUnit(Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>
        
        <div>
          <Label>Precio de venta por unidad ($)</Label>
          <Input 
            type="number" 
            value={salePrice}
            onChange={(e) => setSalePrice(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        
        <Separator />
        
        <div className="bg-primary/5 p-4 rounded-lg space-y-4">
          <h4 className="font-semibold text-lg">Resultados:</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Costo por unidad</p>
              <p className="text-2xl font-bold text-primary">
                ${unitCost.toFixed(0)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Ganancia por unidad</p>
              <p className={`text-2xl font-bold ${profitPerUnit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${profitPerUnit.toFixed(0)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Producción máxima/día</p>
              <p className="text-2xl font-bold text-blue-600">
                {maxDailyProduction.toFixed(0)} unidades
              </p>
            </div>
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Límite físico:</strong> Podés producir máximo {maxDailyProduction.toFixed(0)} unidades por día trabajando {workHoursPerDay}hs.
              <br/>
              <strong>Ingresos máximos:</strong> ${maxDailyRevenue.toLocaleString()}/día
              <br/>
              <strong>Ganancia máxima:</strong> ${maxDailyProfit.toLocaleString()}/día (${(maxDailyProfit * 30).toLocaleString()}/mes)
            </AlertDescription>
          </Alert>
          
          {profitPerUnit <= 0 && (
            <Alert className="border-red-500 bg-red-500/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-700 dark:text-red-400">
                <strong>⚠️ Problema:</strong> Estás vendiendo a pérdida. El costo de producción (${unitCost.toFixed(0)}) es mayor que el precio de venta (${salePrice}).
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </Card>
  );
}
