import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface QuickActionsProps {
  ideaId: string;
}

export default function QuickActions({ ideaId }: QuickActionsProps) {
  const { toast } = useToast();
  const [tasks, setTasks] = useState([
    { id: 'afip', label: 'Completar inscripción AFIP', completed: false },
    { id: 'loan', label: 'Solicitar crédito Banco San Juan', completed: false },
    { id: 'supplier', label: 'Contactar Molino San Luis (proveedor)', completed: false },
    { id: 'logo', label: 'Diseñar logo en Canva', completed: false },
    { id: 'instagram', label: 'Crear Instagram del negocio', completed: false }
  ]);

  const handleToggle = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    
    toast({
      title: "Progreso guardado",
      description: "Tu avance se actualizó correctamente"
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Próximos Pasos Recomendados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map(task => (
            <div 
              key={task.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => handleToggle(task.id)}
            >
              <Checkbox 
                checked={task.completed}
                onCheckedChange={() => handleToggle(task.id)}
              />
              <label 
                className={`flex-1 cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}
              >
                {task.label}
              </label>
              {!task.completed && (
                <Button size="sm" variant="ghost">
                  Ver detalles →
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-primary/5 rounded-lg">
          <p className="text-sm">
            <span className="font-semibold">{tasks.filter(t => t.completed).length}/{tasks.length}</span> tareas completadas
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
