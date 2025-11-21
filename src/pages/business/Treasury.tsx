import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  Plus,
  Search,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Filter,
  MoreVertical
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { treasuryService, TreasuryAccount, TreasuryMovement } from '@/services/erpService';
import { useCustomToast } from '@/hooks/use-custom-toast';

export default function Treasury() {
  const [accounts, setAccounts] = useState<TreasuryAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<TreasuryAccount | null>(null);
  const [movements, setMovements] = useState<TreasuryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const [isAddMovementDialogOpen, setIsAddMovementDialogOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    account_type: 'cash',
    bank_name: '',
    account_number: '',
    cbu: '',
    currency: 'ARS',
    current_balance: 0
  });
  const [newMovement, setNewMovement] = useState({
    movement_type: 'income',
    amount: 0,
    movement_date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    payee: ''
  });
  const { showToast, ToastComponent } = useCustomToast();

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      loadMovements(selectedAccount.id);
    }
  }, [selectedAccount]);

  const loadAccounts = async () => {
    try {
      const data = await treasuryService.getAllAccounts();
      setAccounts(data);
      if (data.length > 0 && !selectedAccount) {
        setSelectedAccount(data[0]);
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMovements = async (accountId: string) => {
    try {
      const data = await treasuryService.getMovements(accountId);
      setMovements(data);
    } catch (error) {
      console.error('Error loading movements:', error);
    }
  };

  const handleAddAccount = async () => {
    try {
      await treasuryService.createAccount(newAccount);
      showToast('Cuenta agregada exitosamente', 'success');
      setIsAddAccountDialogOpen(false);
      setNewAccount({
        name: '',
        account_type: 'cash',
        bank_name: '',
        account_number: '',
        cbu: '',
        currency: 'ARS',
        current_balance: 0
      });
      loadAccounts();
    } catch (error) {
      showToast('Error al agregar cuenta', 'error');
    }
  };

  const handleAddMovement = async () => {
    if (!selectedAccount) return;
    try {
      await treasuryService.addMovement({
        ...newMovement,
        account_id: selectedAccount.id
      });
      showToast('Movimiento registrado exitosamente', 'success');
      setIsAddMovementDialogOpen(false);
      setNewMovement({
        movement_type: 'income',
        amount: 0,
        movement_date: new Date().toISOString().split('T')[0],
        category: '',
        description: '',
        payee: ''
      });
      loadAccounts();
      if (selectedAccount) {
        loadMovements(selectedAccount.id);
      }
    } catch (error) {
      showToast('Error al registrar movimiento', 'error');
    }
  };

  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.bank_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBalance = accounts.reduce((sum, a) => sum + (a.is_active ? a.current_balance : 0), 0);
  const bankBalance = accounts
    .filter(a => a.account_type === 'bank' && a.is_active)
    .reduce((sum, a) => sum + a.current_balance, 0);
  const cashBalance = accounts
    .filter(a => a.account_type === 'cash' && a.is_active)
    .reduce((sum, a) => sum + a.current_balance, 0);

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'bank':
        return <Building2 className="w-5 h-5" />;
      case 'cash':
        return <Wallet className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  const getAccountTypeName = (type: string) => {
    switch (type) {
      case 'bank':
        return 'Banco';
      case 'cash':
        return 'Efectivo';
      case 'digital_wallet':
        return 'Billetera Digital';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary p-6">
      {ToastComponent}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Tesorería
          </h1>
          <p className="text-text-secondary">
            Gestiona tus cuentas bancarias, cajas y movimientos de efectivo
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Saldo Total</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${totalBalance.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">En Bancos</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${bankBalance.toLocaleString()}
                  </p>
                </div>
                <Building2 className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">En Efectivo</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ${cashBalance.toLocaleString()}
                  </p>
                </div>
                <Wallet className="w-8 h-8 text-purple-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Accounts List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Cuentas</CardTitle>
                  <Dialog open={isAddAccountDialogOpen} onOpenChange={setIsAddAccountDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                        <Plus className="w-4 h-4 mr-1" />
                        Nueva
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Agregar Nueva Cuenta</DialogTitle>
                        <DialogDescription>
                          Crea una nueva cuenta bancaria, caja o billetera digital
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="name">Nombre de la Cuenta *</Label>
                          <Input
                            id="name"
                            value={newAccount.name}
                            onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                            placeholder="Caja Principal"
                          />
                        </div>
                        <div>
                          <Label htmlFor="account_type">Tipo de Cuenta</Label>
                          <Select
                            value={newAccount.account_type}
                            onValueChange={(value) => setNewAccount({ ...newAccount, account_type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">Efectivo</SelectItem>
                              <SelectItem value="bank">Banco</SelectItem>
                              <SelectItem value="digital_wallet">Billetera Digital</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {newAccount.account_type === 'bank' && (
                          <>
                            <div>
                              <Label htmlFor="bank_name">Nombre del Banco</Label>
                              <Input
                                id="bank_name"
                                value={newAccount.bank_name}
                                onChange={(e) => setNewAccount({ ...newAccount, bank_name: e.target.value })}
                                placeholder="Banco Nación"
                              />
                            </div>
                            <div>
                              <Label htmlFor="account_number">Número de Cuenta</Label>
                              <Input
                                id="account_number"
                                value={newAccount.account_number}
                                onChange={(e) => setNewAccount({ ...newAccount, account_number: e.target.value })}
                                placeholder="123456789"
                              />
                            </div>
                            <div>
                              <Label htmlFor="cbu">CBU</Label>
                              <Input
                                id="cbu"
                                value={newAccount.cbu}
                                onChange={(e) => setNewAccount({ ...newAccount, cbu: e.target.value })}
                                placeholder="0000000000000000000000"
                              />
                            </div>
                          </>
                        )}
                        <div>
                          <Label htmlFor="current_balance">Saldo Inicial</Label>
                          <Input
                            id="current_balance"
                            type="number"
                            value={newAccount.current_balance}
                            onChange={(e) => setNewAccount({ ...newAccount, current_balance: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddAccountDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddAccount} disabled={!newAccount.name}>
                          Agregar Cuenta
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-secondary">Cargando cuentas...</p>
                  </div>
                ) : filteredAccounts.length === 0 ? (
                  <div className="text-center py-8">
                    <Wallet className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                    <p className="text-text-secondary mb-4">No hay cuentas registradas</p>
                    <Button onClick={() => setIsAddAccountDialogOpen(true)} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar primera cuenta
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredAccounts.map((account) => (
                      <motion.div
                        key={account.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedAccount?.id === account.id
                            ? 'bg-blue-50 border border-blue-200'
                            : 'bg-bg-tertiary hover:bg-bg-secondary'
                        }`}
                        onClick={() => setSelectedAccount(account)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                            {getAccountTypeIcon(account.account_type)}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-text-primary text-sm">{account.name}</p>
                            <p className="text-xs text-text-tertiary">{getAccountTypeName(account.account_type)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">${account.current_balance.toLocaleString()}</p>
                            <p className="text-xs text-text-tertiary">{account.currency}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Movements List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Movimientos</CardTitle>
                    <CardDescription>
                      {selectedAccount ? `${selectedAccount.name}` : 'Selecciona una cuenta'}
                    </CardDescription>
                  </div>
                  {selectedAccount && (
                    <Dialog open={isAddMovementDialogOpen} onOpenChange={setIsAddMovementDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-green-600 to-blue-600">
                          <Plus className="w-4 h-4 mr-2" />
                          Nuevo Movimiento
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Registrar Movimiento</DialogTitle>
                          <DialogDescription>
                            {selectedAccount.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label htmlFor="movement_type">Tipo de Movimiento</Label>
                            <Select
                              value={newMovement.movement_type}
                              onValueChange={(value) => setNewMovement({ ...newMovement, movement_type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="income">Ingreso</SelectItem>
                                <SelectItem value="expense">Egreso</SelectItem>
                                <SelectItem value="transfer_in">Transferencia Entrada</SelectItem>
                                <SelectItem value="transfer_out">Transferencia Salida</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="amount">Monto</Label>
                            <Input
                              id="amount"
                              type="number"
                              value={newMovement.amount}
                              onChange={(e) => setNewMovement({ ...newMovement, amount: Number(e.target.value) })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="movement_date">Fecha</Label>
                            <Input
                              id="movement_date"
                              type="date"
                              value={newMovement.movement_date}
                              onChange={(e) => setNewMovement({ ...newMovement, movement_date: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="category">Categoría</Label>
                            <Input
                              id="category"
                              value={newMovement.category}
                              onChange={(e) => setNewMovement({ ...newMovement, category: e.target.value })}
                              placeholder="Ventas, Compras, Sueldos..."
                            />
                          </div>
                          <div>
                            <Label htmlFor="payee">Beneficiario / Pagador</Label>
                            <Input
                              id="payee"
                              value={newMovement.payee}
                              onChange={(e) => setNewMovement({ ...newMovement, payee: e.target.value })}
                              placeholder="Nombre del cliente o proveedor"
                            />
                          </div>
                          <div>
                            <Label htmlFor="description">Descripción</Label>
                            <Input
                              id="description"
                              value={newMovement.description}
                              onChange={(e) => setNewMovement({ ...newMovement, description: e.target.value })}
                              placeholder="Detalle del movimiento"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsAddMovementDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleAddMovement} disabled={newMovement.amount === 0}>
                            Registrar
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!selectedAccount ? (
                  <div className="text-center py-12">
                    <Wallet className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                    <p className="text-text-secondary">
                      Selecciona una cuenta para ver sus movimientos
                    </p>
                  </div>
                ) : movements.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                    <p className="text-text-secondary mb-4">
                      No hay movimientos registrados
                    </p>
                    <Button onClick={() => setIsAddMovementDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Registrar primer movimiento
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {movements.map((movement, index) => (
                      <motion.div
                        key={movement.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg hover:bg-bg-secondary transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            movement.movement_type === 'income' || movement.movement_type === 'transfer_in'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {movement.movement_type === 'income' || movement.movement_type === 'transfer_in' ? (
                              <ArrowDownRight className="w-5 h-5" />
                            ) : (
                              <ArrowUpRight className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-text-primary">
                              {movement.description || movement.category || 'Movimiento'}
                            </p>
                            <div className="flex items-center gap-3 text-sm text-text-secondary">
                              <span>{new Date(movement.movement_date).toLocaleDateString()}</span>
                              {movement.payee && <span>• {movement.payee}</span>}
                              {movement.category && <span>• {movement.category}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className={`text-lg font-bold ${
                              movement.movement_type === 'income' || movement.movement_type === 'transfer_in'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}>
                              {movement.movement_type === 'income' || movement.movement_type === 'transfer_in' ? '+' : '-'}
                              ${Math.abs(movement.amount).toLocaleString()}
                            </p>
                            <p className="text-xs text-text-tertiary">
                              Saldo: ${movement.balance_after.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
