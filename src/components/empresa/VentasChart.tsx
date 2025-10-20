import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Sucursal {
  id: string;
  nombre: string;
  ventas: number;
  margen: number;
  empleados: number;
}

interface VentasChartProps {
  sucursales: Sucursal[];
}

export function VentasChart({ sucursales }: VentasChartProps) {
  const data = sucursales.map(s => ({
    name: s.nombre.replace("Sucursal ", ""),
    ventas: s.ventas,
  }));

  const colors = ["#2563EB", "#10B981", "#F59E0B", "#8B5CF6"];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#6B7280", fontSize: 13 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#6B7280", fontSize: 13 }}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip 
          formatter={(value: number) => [`$${value.toLocaleString()}`, "Ventas"]}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
          cursor={{ fill: "rgba(37, 99, 235, 0.05)" }}
        />
        <Bar dataKey="ventas" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
