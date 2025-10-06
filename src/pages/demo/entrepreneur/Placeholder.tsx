import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Construction } from "lucide-react";

const PlaceholderPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-purple-50/30 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-purple-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-purple-100 rounded-full">
              <Construction className="h-12 w-12 text-purple-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Página en Construcción</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            Esta sección estará disponible pronto. Por ahora, explora las otras funcionalidades disponibles.
          </p>
          <Button
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-50"
            onClick={() => navigate('/demo/emprendedor/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
