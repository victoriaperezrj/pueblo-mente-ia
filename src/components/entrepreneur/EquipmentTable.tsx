import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface EquipmentItem {
  id: string;
  name: string;
  provider: string;
  cost: number;
  priority: "Alta" | "Media" | "Baja";
}

interface EquipmentTableProps {
  onToggle: (taskId: string) => void;
  progress: { [key: string]: boolean };
}

const equipment: EquipmentItem[] = [
  {
    id: "horno_industrial",
    name: "Horno industrial",
    provider: "Casa del Panadero",
    cost: 3200000,
    priority: "Alta",
  },
  {
    id: "amasadora",
    name: "Amasadora 25kg",
    provider: "Industrias del Sur",
    cost: 1500000,
    priority: "Alta",
  },
  {
    id: "heladera",
    name: "Heladera exhibidora",
    provider: "FríoMax",
    cost: 800000,
    priority: "Media",
  },
  {
    id: "balanza",
    name: "Balanza digital",
    provider: "Local",
    cost: 50000,
    priority: "Alta",
  },
];

export function EquipmentTable({ onToggle, progress }: EquipmentTableProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "destructive";
      case "Media":
        return "secondary";
      case "Baja":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Estado</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead className="text-right">Costo</TableHead>
              <TableHead>Prioridad</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipment.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={progress[item.id] || false}
                    onCheckedChange={() => onToggle(item.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.provider}</TableCell>
                <TableCell className="text-right">
                  ${(item.cost / 1000).toFixed(0)}k
                </TableCell>
                <TableCell>
                  <Badge variant={getPriorityColor(item.priority)}>
                    {item.priority}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="p-4 bg-muted text-sm text-muted-foreground">
        <p className="font-semibold mb-2">Nota sobre equipamiento:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Cada fila es expandible para ver especificaciones técnicas</li>
          <li>Alternativas de proveedores disponibles al hacer clic</li>
          <li>Reviews de otros usuarios de Emprendu</li>
        </ul>
      </div>
    </Card>
  );
}
