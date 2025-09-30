import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const PlaceholderPage = ({ title, description, icon }: PlaceholderPageProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon || <Building2 className="h-6 w-6" />}
            Próximamente
          </CardTitle>
          <CardDescription>
            Esta sección está en desarrollo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Estamos trabajando en traerte las mejores herramientas para gestionar tu negocio.
            ¡Volvé pronto!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
