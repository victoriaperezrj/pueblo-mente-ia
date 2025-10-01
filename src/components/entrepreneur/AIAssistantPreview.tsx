import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AIAssistantPreview() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");

  const suggestions = [
    "¿Cómo bajo costos?",
    "¿Qué precio poner?",
    "¿Cuándo contratar empleado?",
    "¿Cómo consigo clientes?"
  ];

  const handleSuggestion = (suggestion: string) => {
    setQuery(suggestion);
  };

  const handleSubmit = () => {
    if (!query.trim()) return;
    
    toast({
      title: "Pregunta enviada",
      description: "El asistente está procesando tu consulta..."
    });
    
    setQuery("");
  };

  return (
    <Card className="mb-8 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
        <CardTitle className="flex items-center">
          <MessageCircle className="mr-2 h-5 w-5 text-primary" />
          Preguntale a tu Asistente
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="¿Qué necesitás saber?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <Button onClick={handleSubmit}>
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.map((suggestion) => (
            <Badge 
              key={suggestion}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => handleSuggestion(suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </div>

        <Button variant="outline" className="w-full">
          Abrir Chat Completo
        </Button>
      </CardContent>
    </Card>
  );
}
