import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Phone,
  Mail,
  MoreVertical,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  FileDown,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { clientsService, Client } from '@/services/erpService';
import { reportsService } from '@/services/reportsService';
import { useCustomToast } from '@/hooks/use-custom-toast';

export default function AccountsReceivable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    tax_id: '',
    credit_limit: 0
  });
  const { showToast, ToastComponent } = useCustomToast();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await clientsService.getAll();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async () => {
    try {
      await clientsService.create(newClient);
      showToast('Cliente agregado exitosamente', 'success');
      setIsAddDialogOpen(false);
      setNewClient({ name: '', email: '', phone: '', tax_id: '', credit_limit: 0 });
      loadClients();
    } catch (error) {
      showToast('Error al agregar cliente', 'error');
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.tax_id?.includes(searchTerm)
  );

  const totalReceivables = clients.reduce((sum, c) => sum + (c.current_balance > 0 ? c.current_balance : 0), 0);
  const clientsWithDebt = clients.filter(c => c.current_balance > 0).length;
  const overdueClients = clients.filter(c => c.current_balance > c.credit_limit).length;

  return (
    <div className="min-h-screen bg-bg-secondary p-6">
      {ToastComponent}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Cuentas Corrientes - Clientes
            </h1>
            <p className="text-text-secondary">
              Gestiona los saldos y movimientos de tus clientes
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FileDown className="w-4 h-4" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => reportsService.exportClientsReport(filteredClients, 'excel')}
                className="gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Exportar a Excel
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => reportsService.exportClientsReport(filteredClients, 'pdf')}
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                Exportar a PDF
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => reportsService.exportClientsReport(filteredClients, 'csv')}
                className="gap-2"
              >
                <FileDown className="w-4 h-4" />
                Exportar a CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Total a Cobrar</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${totalReceivables.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Clientes Totales</p>
                  <p className="text-2xl font-bold">{clients.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Con Saldo</p>
                  <p className="text-2xl font-bold">{clientsWithDebt}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Exceden Límite</p>
                  <p className="text-2xl font-bold text-red-600">{overdueClients}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <Input
              placeholder="Buscar por nombre, email o CUIT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
                <DialogDescription>
                  Completa los datos del cliente para agregarlo al sistema
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Nombre / Razón Social *</Label>
                  <Input
                    id="name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    placeholder="Empresa S.R.L."
                  />
                </div>
                <div>
                  <Label htmlFor="tax_id">CUIT</Label>
                  <Input
                    id="tax_id"
                    value={newClient.tax_id}
                    onChange={(e) => setNewClient({ ...newClient, tax_id: e.target.value })}
                    placeholder="20-12345678-9"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="contacto@empresa.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    placeholder="+54 11 1234-5678"
                  />
                </div>
                <div>
                  <Label htmlFor="credit_limit">Límite de Crédito</Label>
                  <Input
                    id="credit_limit"
                    type="number"
                    value={newClient.credit_limit}
                    onChange={(e) => setNewClient({ ...newClient, credit_limit: Number(e.target.value) })}
                    placeholder="50000"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddClient} disabled={!newClient.name}>
                  Agregar Cliente
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Clients List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>
              {filteredClients.length} clientes encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-text-secondary">Cargando clientes...</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                <p className="text-text-secondary mb-4">
                  {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar primer cliente
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredClients.map((client, index) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg hover:bg-bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">{client.name}</p>
                        <div className="flex items-center gap-3 text-sm text-text-secondary">
                          {client.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {client.email}
                            </span>
                          )}
                          {client.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {client.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          client.current_balance > 0 ? 'text-green-600' :
                          client.current_balance < 0 ? 'text-red-600' : 'text-text-secondary'
                        }`}>
                          ${Math.abs(client.current_balance).toLocaleString()}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          {client.current_balance > 0 ? 'Nos debe' :
                           client.current_balance < 0 ? 'A favor' : 'Sin saldo'}
                        </p>
                      </div>

                      {client.current_balance > client.credit_limit && (
                        <Badge variant="destructive" className="text-xs">
                          Excede límite
                        </Badge>
                      )}

                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
