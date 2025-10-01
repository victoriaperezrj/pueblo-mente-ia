import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const messageSchema = z.object({
  message: z.string()
    .trim()
    .min(10, { message: "El mensaje debe tener al menos 10 caracteres" })
    .max(500, { message: "El mensaje debe tener máximo 500 caracteres" })
});

interface ConnectionRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetBusinessId: string;
  targetBusinessName: string;
  currentBusinessId: string;
  onSuccess?: () => void;
}

export const ConnectionRequestDialog = ({
  open,
  onOpenChange,
  targetBusinessId,
  targetBusinessName,
  currentBusinessId,
  onSuccess
}: ConnectionRequestDialogProps) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      // Validate input
      const validationResult = messageSchema.safeParse({ message });
      
      if (!validationResult.success) {
        toast.error(validationResult.error.errors[0].message);
        return;
      }

      setLoading(true);

      // Check if connection already exists
      const { data: existing } = await supabase
        .from("business_connections")
        .select("id, status")
        .eq("requester_business_id", currentBusinessId)
        .eq("target_business_id", targetBusinessId)
        .maybeSingle();

      if (existing) {
        if (existing.status === "pending") {
          toast.info("Ya enviaste una solicitud de conexión a este negocio");
        } else if (existing.status === "accepted") {
          toast.info("Ya estás conectado con este negocio");
        } else {
          toast.error("Tu solicitud fue rechazada anteriormente");
        }
        onOpenChange(false);
        return;
      }

      // Create connection request
      const { error } = await supabase
        .from("business_connections")
        .insert({
          requester_business_id: currentBusinessId,
          target_business_id: targetBusinessId,
          message: validationResult.data.message,
          status: "pending"
        });

      if (error) throw error;

      toast.success("¡Solicitud enviada! El negocio recibirá tu pedido de conexión.");
      setMessage("");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error sending connection request:", error);
      toast.error("No se pudo enviar la solicitud: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Solicitar Conexión</DialogTitle>
          <DialogDescription>
            Enviá una solicitud a <strong>{targetBusinessName}</strong> para conectar y compartir información de contacto.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="connection-message">Mensaje personalizado</Label>
            <Textarea
              id="connection-message"
              placeholder="Ej: Hola, me interesa tu producto y me gustaría conectar para coordinar una compra..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={500}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {message.length}/500 caracteres
            </p>
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || message.trim().length < 10}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Solicitud"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
