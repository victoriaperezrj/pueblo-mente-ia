import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import NegocioInterface from "@/components/business-bot/NegocioInterface";
import EmpresaInterface from "@/components/business-bot/EmpresaInterface";

// Define la estructura de un mensaje
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const BusinessAIBot: React.FC = () => {
  // 1. Definición de Estados Faltantes para las Props
  const [view, setView] = useState<"selection" | "negocio" | "empresa">("selection");
  const [messages, setMessages] = useState<Message[]>([]); // Estado de los mensajes
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado de carga del bot

  // Función para manejar el envío de mensajes
  const handleSendMessage = async (userMessage: string): Promise<string> => {
    if (isLoading) return "El bot ya está procesando una solicitud.";

    // Añadir el mensaje del usuario inmediatamente
    const newUserMessage: Message = { role: "user", content: userMessage, timestamp: new Date() };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true); // Activar carga

    let botResponseText = "Lo siento, hubo un error al obtener la respuesta.";

    try {
      // Ejemplo de llamada a una función de Supabase (ajusta esto a tu lógica real)
      const { data, error } = await supabase.functions.invoke("ai-bot-handler", {
        body: { message: userMessage, type: view }, // Puedes usar el 'view' para saber si es negocio o empresa
      });

      if (error) throw error;

      botResponseText = data.response; // Asumiendo que la respuesta del bot está en `data.response`
    } catch (error) {
      console.error("Error al llamar a la función de IA:", error);
    } finally {
      setIsLoading(false); // Desactivar carga
    }

    // Añadir la respuesta del bot
    const newBotMessage: Message = { role: "assistant", content: botResponseText, timestamp: new Date() };
    setMessages((prevMessages) => [...prevMessages, newBotMessage]);

    return botResponseText;
  };

  const handleBack = () => {
    setView("selection");
    setMessages([]); // Limpiar mensajes al volver a la selección
  };

  if (view === "negocio") {
    // 2. Propiedades Completas Pasadas a NegocioInterface
    return (
      <NegocioInterface
        messages={messages} // <-- AHORA INCLUIDO
        isLoading={isLoading} // <-- AHORA INCLUIDO
        onBack={handleBack}
        onSendMessage={handleSendMessage}
      />
    );
  }

  if (view === "empresa") {
    // 3. Propiedades Completas Pasadas a EmpresaInterface
    return (
      <EmpresaInterface
        messages={messages} // <-- AHORA INCLUIDO
        isLoading={isLoading} // <-- AHORA INCLUIDO
        onBack={handleBack}
        onSendMessage={handleSendMessage}
      />
    );
  }

  // Interfaz de selección inicial (ajusta esto a tu JSX real)
  return (
    <div className="selection-container">
      <h1>Selecciona tu tipo de Bot</h1>
      <button onClick={() => setView("negocio")}>Bot para Negocio</button>
      <button onClick={() => setView("empresa")}>Bot para Empresa</button>
    </div>
  );
};

export default BusinessAIBot;
