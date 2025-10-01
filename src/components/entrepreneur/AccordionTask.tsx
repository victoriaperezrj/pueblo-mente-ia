import { Checkbox } from "@/components/ui/checkbox";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Resource {
  type: "link" | "docs";
  label: string;
  url?: string;
  items?: string[];
}

interface AccordionTaskProps {
  value: string;
  title: string;
  completed: boolean;
  onToggle: () => void;
  cost?: number;
  time?: string;
  description: string;
  resources?: Resource[];
  requirements?: string[];
  supplierInfo?: {
    contact: string;
    price: string;
    payment: string;
  };
  loanInfo?: {
    amount: string;
    term: string;
    requirements: string[];
  };
}

export function AccordionTask({
  value,
  title,
  completed,
  onToggle,
  cost,
  time,
  description,
  resources,
  requirements,
  supplierInfo,
  loanInfo,
}: AccordionTaskProps) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3 w-full">
          <Checkbox
            checked={completed}
            onCheckedChange={() => onToggle()}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex-1 text-left">
            <span className={completed ? "line-through text-muted-foreground" : ""}>
              {title}
            </span>
          </div>
          {cost !== undefined && (
            <Badge variant="secondary">
              {cost === 0 ? "Gratis" : `$${(cost / 1000).toFixed(0)}k`}
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pt-2 pb-4 pl-9">
          <p className="text-sm text-muted-foreground">{description}</p>

          {(cost !== undefined || time) && (
            <div className="flex gap-4 text-sm">
              {cost !== undefined && (
                <div>
                  <span className="font-semibold">Costo:</span>{" "}
                  {cost === 0 ? "Gratuito" : `$${cost.toLocaleString("es-AR")} ARS`}
                </div>
              )}
              {time && (
                <div>
                  <span className="font-semibold">Tiempo estimado:</span> {time}
                </div>
              )}
            </div>
          )}

          {supplierInfo && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="text-sm">
                <span className="font-semibold">Contacto:</span> {supplierInfo.contact}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Precio:</span> {supplierInfo.price}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Forma de pago:</span> {supplierInfo.payment}
              </div>
              <Button size="sm" variant="outline" className="mt-2">
                Solicitar Cotización
              </Button>
            </div>
          )}

          {loanInfo && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="text-sm">
                <span className="font-semibold">Monto máximo:</span> {loanInfo.amount}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Plazo:</span> {loanInfo.term}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Requisitos:</span>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {loanInfo.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
              <Button size="sm" variant="outline" className="mt-2">
                Solicitar crédito online
              </Button>
            </div>
          )}

          {requirements && (
            <div>
              <h4 className="font-semibold mb-2 text-sm">Requisitos:</h4>
              <ul className="space-y-1">
                {requirements.map((req, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <Checkbox disabled />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {resources && (
            <div>
              <h4 className="font-semibold mb-2 text-sm">Recursos:</h4>
              <div className="space-y-2">
                {resources.map((resource, idx) => (
                  <div key={idx}>
                    {resource.type === "link" && resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {resource.label}
                      </a>
                    )}
                    {resource.type === "docs" && resource.items && (
                      <div>
                        <span className="text-sm font-semibold">{resource.label}:</span>
                        <ul className="list-disc list-inside ml-2 mt-1 text-sm text-muted-foreground">
                          {resource.items.map((item, itemIdx) => (
                            <li key={itemIdx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            variant={completed ? "outline" : "default"}
            size="sm"
            onClick={onToggle}
            className="mt-2"
          >
            {completed ? "Marcar como pendiente" : "Marcar como completado"}
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
