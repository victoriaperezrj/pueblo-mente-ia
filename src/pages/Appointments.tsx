import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Plus, Clock, User, Phone, Mail, Trash2, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Appointment {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  service: string;
  notes: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pendiente", color: "warning" },
  { value: "confirmed", label: "Confirmado", color: "success" },
  { value: "completed", label: "Completado", color: "primary" },
  { value: "cancelled", label: "Cancelado", color: "destructive" },
];

const Appointments = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState<string | null>(null);

  // Form state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [service, setService] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: businesses } = await supabase
        .from("businesses")
        .select("id")
        .limit(1)
        .single();

      if (businesses) {
        setCurrentBusiness(businesses.id);
        loadAppointments(businesses.id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  const loadAppointments = async (businessId: string) => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("business_id", businessId)
        .order("appointment_date", { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBusiness) return;

    try {
      const { data: appointmentData, error } = await supabase
        .from("appointments")
        .insert({
          business_id: currentBusiness,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
          appointment_date: appointmentDate,
          start_time: startTime,
          end_time: endTime,
          service,
          notes,
          status: "pending"
        })
        .select()
        .single();

      if (error) throw error;

      // 🚀 EVENT-DRIVEN: Register appointment.scheduled event
      try {
        await supabase.from("outbox_events").insert({
          event_type: "appointment.scheduled",
          aggregate_id: appointmentData.id,
          aggregate_type: "appointment",
          business_id: currentBusiness,
          payload: {
            appointment_id: appointmentData.id,
            customer_name: customerName,
            service,
            appointment_date: appointmentDate,
            start_time: startTime,
            timestamp: new Date().toISOString(),
          },
        });
      } catch (eventError) {
        console.warn("Event registration failed:", eventError);
      }

      toast({
        title: "✓ Turno agendado",
        description: "El turno se creó correctamente",
      });

      setDialogOpen(false);
      resetForm();
      loadAppointments(currentBusiness);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: newStatus })
        .eq("id", appointmentId);

      if (error) throw error;

      toast({
        title: "✓ Estado actualizado",
        description: "El turno se actualizó correctamente",
      });

      if (currentBusiness) loadAppointments(currentBusiness);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Cancelar este turno?")) return;

    try {
      const { error } = await supabase.from("appointments").delete().eq("id", id);
      if (error) throw error;

      toast({ title: "✓ Turno cancelado" });
      if (currentBusiness) loadAppointments(currentBusiness);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setAppointmentDate("");
    setStartTime("");
    setEndTime("");
    setService("");
    setNotes("");
  };

  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.appointment_date);
    const today = new Date();
    return aptDate.toDateString() === today.toDateString();
  });

  const upcomingAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.appointment_date);
    const today = new Date();
    return aptDate > today && apt.status !== "cancelled";
  });

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  if (!currentBusiness) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Primero creá un negocio para gestionar turnos</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <div className="bg-gradient-primary rounded-xl p-2.5">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            Turnos 📅
          </h1>
          <p className="text-muted-foreground mt-2">Gestión de citas y reservas</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" size="lg" className="shadow-lg">
              <Plus className="mr-2 h-5 w-5" />
              Nuevo Turno
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agendar Turno</DialogTitle>
              <DialogDescription>Registrá una nueva cita o reserva</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Cliente *</Label>
                <Input
                  placeholder="Nombre del cliente"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input
                    type="tel"
                    placeholder="11 1234-5678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="cliente@mail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Servicio *</Label>
                <Input
                  placeholder="Ej: Corte de pelo, Consulta, etc."
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Fecha *</Label>
                <Input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Hora Inicio *</Label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hora Fin *</Label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notas</Label>
                <Textarea
                  placeholder="Información adicional..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">Agendar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
          <div className="h-1 bg-gradient-primary" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="bg-gradient-primary rounded-lg p-2">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {todayAppointments.length}
            </div>
            <p className="text-sm text-muted-foreground">turnos programados</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-success/30 bg-gradient-to-br from-success/5 to-success/10 overflow-hidden hover:border-success/50 transition-all duration-300 hover:shadow-xl">
          <div className="h-1 bg-gradient-success" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="bg-gradient-success rounded-lg p-2">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              Próximos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-success bg-clip-text text-transparent">
              {upcomingAppointments.length}
            </div>
            <p className="text-sm text-muted-foreground">siguientes días</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-warning/30 bg-gradient-to-br from-warning/5 to-warning/10 overflow-hidden hover:border-warning/50 transition-all duration-300 hover:shadow-xl">
          <div className="h-1 bg-gradient-warm" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="bg-gradient-warm rounded-lg p-2">
                <Clock className="h-5 w-5 text-white" />
              </div>
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-warm bg-clip-text text-transparent">
              {appointments.length}
            </div>
            <p className="text-sm text-muted-foreground">turnos registrados</p>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <Card className="border-2">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="bg-gradient-primary rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">¡Empezá a agendar!</h3>
              <p className="text-muted-foreground mb-6">
                No hay turnos programados aún. Creá tu primer turno para gestionar tus citas.
              </p>
              <Button variant="gradient" size="lg" onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-5 w-5" />
                Crear Primer Turno
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => {
            const statusOption = STATUS_OPTIONS.find(s => s.value === appointment.status);
            return (
              <Card key={appointment.id} className="border-2 hover:border-primary/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden group">
                <div className={`h-1 bg-gradient-${statusOption?.color || 'primary'}`} />
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Select value={appointment.status} onValueChange={(value) => handleStatusChange(appointment.id, value)}>
                      <SelectTrigger className="w-auto">
                        <SelectValue>
                          <Badge variant="secondary">
                            {statusOption?.label}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <Badge variant="secondary">{status.label}</Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(appointment.id)}
                      className="text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="bg-gradient-primary rounded-lg p-1.5">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    {appointment.customer_name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-base">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(appointment.appointment_date), "dd MMM yyyy", { locale: es })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm bg-primary/5 p-2 rounded-lg">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium">{appointment.start_time} - {appointment.end_time}</span>
                  </div>
                  <div className="text-sm bg-success/5 p-2 rounded-lg">
                    <span className="font-medium text-success">Servicio:</span> {appointment.service}
                  </div>
                  {appointment.customer_phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.customer_phone}</span>
                    </div>
                  )}
                  {appointment.notes && (
                    <p className="text-sm text-muted-foreground italic bg-muted/30 p-2 rounded-lg">
                      {appointment.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Appointments;
