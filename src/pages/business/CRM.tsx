import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  TrendingUp,
  Calendar,
  DollarSign,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  MessageCircle,
  Star,
  Clock
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { motion } from 'framer-motion';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  tags: string[];
  total_purchases: number;
  last_visit: string;
  created_at: string;
}

export default function CRM() {
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useCustomToast();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    tags: [] as string[],
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, filterTag, customers]);

  const loadCustomers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (!businesses) {
        setLoading(false);
        return;
      }

      setBusinessId(businesses.id);

      const { data: customersData, error } = await supabase
        .from('customers')
        .select('*')
        .eq('business_id', businesses.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCustomers(customersData || []);
    } catch (error) {
      console.error('Error loading customers:', error);
      showToast('Error al cargar clientes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm)
      );
    }

    if (filterTag !== 'all') {
      filtered = filtered.filter(c => c.tags?.includes(filterTag));
    }

    setFilteredCustomers(filtered);
  };

  const handleSaveCustomer = async () => {
    if (!businessId || !formData.name) {
      showToast('Complete los campos requeridos', 'error');
      return;
    }

    try {
      if (editingCustomer) {
        const { error } = await supabase
          .from('customers')
          .update(formData)
          .eq('id', editingCustomer.id);

        if (error) throw error;
        showToast('Cliente actualizado', 'success');
      } else {
        const { error } = await supabase
          .from('customers')
          .insert([{ ...formData, business_id: businessId }]);

        if (error) throw error;
        showToast('Cliente agregado', 'success');
      }

      setIsAddingCustomer(false);
      setEditingCustomer(null);
      setFormData({ name: '', email: '', phone: '', address: '', tags: [] });
      loadCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      showToast('Error al guardar cliente', 'error');
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm('¿Eliminar este cliente?')) return;

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showToast('Cliente eliminado', 'success');
      loadCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      showToast('Error al eliminar cliente', 'error');
    }
  };

  const allTags = Array.from(new Set(customers.flatMap(c => c.tags || [])));

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.last_visit && new Date(c.last_visit) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
    totalRevenue: customers.reduce((acc, c) => acc + (Number(c.total_purchases) || 0), 0),
    avgPurchase: customers.length > 0 ? customers.reduce((acc, c) => acc + (Number(c.total_purchases) || 0), 0) / customers.length : 0
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary">
      {ToastComponent}
      
      <div className="container mx-auto p-6 space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-text-primary mb-2">
              CRM - Gestión de Clientes
            </h1>
            <p className="text-text-secondary">
              Administra y analiza tu base de clientes
            </p>
          </div>
          <Button onClick={() => navigate('/business/dashboard')}>
            Volver al Dashboard
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary">{stats.total}</h3>
            <p className="text-sm text-text-secondary">Total Clientes</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary">{stats.active}</h3>
            <p className="text-sm text-text-secondary">Activos (30 días)</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary">
              ${stats.totalRevenue.toLocaleString()}
            </h3>
            <p className="text-sm text-text-secondary">Ventas Totales</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary">
              ${stats.avgPurchase.toFixed(0)}
            </h3>
            <p className="text-sm text-text-secondary">Ticket Promedio</p>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <Input
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por etiqueta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las etiquetas</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
              <DialogTrigger asChild>
                <Button className="bg-business-500 hover:bg-business-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Nombre *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="juan@email.com"
                    />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+54 266 123-4567"
                    />
                  </div>
                  <div>
                    <Label>Dirección</Label>
                    <Textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Calle 123, San Luis"
                    />
                  </div>
                  <Button onClick={handleSaveCustomer} className="w-full">
                    Guardar Cliente
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        {/* Customers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 hover:shadow-hard transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-primary mb-1">
                      {customer.name}
                    </h3>
                    <div className="space-y-1 text-sm text-text-secondary">
                      {customer.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                      )}
                      {customer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                      {customer.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{customer.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Compras Totales</span>
                    <span className="font-bold text-text-primary">
                      ${Number(customer.total_purchases || 0).toLocaleString()}
                    </span>
                  </div>
                  
                  {customer.last_visit && (
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Clock className="w-4 h-4" />
                      <span>
                        Última visita: {new Date(customer.last_visit).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {customer.tags && customer.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {customer.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setEditingCustomer(customer);
                      setFormData({
                        name: customer.name,
                        email: customer.email || '',
                        phone: customer.phone || '',
                        address: customer.address || '',
                        tags: customer.tags || []
                      });
                      setIsAddingCustomer(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDeleteCustomer(customer.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <Card className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-text-tertiary" />
            <h3 className="text-xl font-bold text-text-primary mb-2">
              No hay clientes
            </h3>
            <p className="text-text-secondary mb-4">
              {searchTerm || filterTag !== 'all'
                ? 'No se encontraron clientes con estos filtros'
                : 'Comienza agregando tu primer cliente'}
            </p>
            {!searchTerm && filterTag === 'all' && (
              <Button onClick={() => setIsAddingCustomer(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primer Cliente
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
