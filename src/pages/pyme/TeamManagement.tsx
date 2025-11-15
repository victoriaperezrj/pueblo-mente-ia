import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  TrendingUp,
  Award,
  Calendar,
  DollarSign,
  BarChart3,
  Target,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Home,
  ArrowLeft,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  performance: number;
  salary: number;
  startDate: string;
  status: 'active' | 'vacation' | 'sick';
  tasksCompleted: number;
  totalTasks: number;
}

export default function TeamManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'performance' | 'payroll'>('overview');

  // Mock data - En producción esto vendría de la base de datos
  const employees: Employee[] = [
    {
      id: '1',
      name: 'María González',
      role: 'Gerente de Ventas',
      department: 'Ventas',
      performance: 95,
      salary: 85000,
      startDate: '2020-03-15',
      status: 'active',
      tasksCompleted: 28,
      totalTasks: 30,
    },
    {
      id: '2',
      name: 'Juan Pérez',
      role: 'Desarrollador Senior',
      department: 'Tecnología',
      performance: 88,
      salary: 75000,
      startDate: '2019-06-20',
      status: 'active',
      tasksCompleted: 45,
      totalTasks: 50,
    },
    {
      id: '3',
      name: 'Ana Rodríguez',
      role: 'Marketing Manager',
      department: 'Marketing',
      performance: 92,
      salary: 70000,
      startDate: '2021-01-10',
      status: 'vacation',
      tasksCompleted: 22,
      totalTasks: 25,
    },
    {
      id: '4',
      name: 'Carlos López',
      role: 'Contador',
      department: 'Finanzas',
      performance: 85,
      salary: 65000,
      startDate: '2018-09-05',
      status: 'active',
      tasksCompleted: 18,
      totalTasks: 20,
    },
  ];

  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'active').length,
    averagePerformance: Math.round(employees.reduce((acc, e) => acc + e.performance, 0) / employees.length),
    monthlyPayroll: employees.reduce((acc, e) => acc + e.salary, 0) / 12,
    tasksCompletionRate: Math.round(
      (employees.reduce((acc, e) => acc + e.tasksCompleted, 0) /
       employees.reduce((acc, e) => acc + e.totalTasks, 0)) * 100
    ),
  };

  const departments = ['Ventas', 'Tecnología', 'Marketing', 'Finanzas', 'Operaciones'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'vacation': return 'text-blue-600 bg-blue-100';
      case 'sick': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'vacation': return Calendar;
      case 'sick': return AlertCircle;
      default: return XCircle;
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600';
    if (performance >= 75) return 'text-blue-600';
    if (performance >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/pyme/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Equipo</h1>
              <p className="text-sm text-gray-600">Administra tu personal y recursos humanos</p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Agregar Empleado
          </Button>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalEmployees}</p>
              <p className="text-sm text-gray-600">Total Empleados</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.activeEmployees}</p>
              <p className="text-sm text-gray-600">Activos</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.averagePerformance}%</p>
              <p className="text-sm text-gray-600">Performance Promedio</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">${Math.round(stats.monthlyPayroll).toLocaleString()}</p>
              <p className="text-sm text-gray-600">Nómina Mensual</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.tasksCompletionRate}%</p>
              <p className="text-sm text-gray-600">Tareas Completadas</p>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            {[
              { key: 'overview', label: 'Visión General', icon: BarChart3 },
              { key: 'employees', label: 'Empleados', icon: Users },
              { key: 'performance', label: 'Performance', icon: TrendingUp },
              { key: 'payroll', label: 'Nómina', icon: DollarSign },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors relative ${
                    activeTab === tab.key
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Employees List */}
        {activeTab === 'employees' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Lista de Empleados</h2>
                <div className="flex gap-4">
                  <Input placeholder="Buscar empleado..." className="max-w-sm" />
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept.toLowerCase()}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Empleado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Departamento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Tareas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Salario Anual
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((employee) => {
                      const StatusIcon = getStatusIcon(employee.status);
                      return (
                        <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="font-semibold text-gray-900">{employee.name}</div>
                              <div className="text-sm text-gray-600">{employee.role}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-900">{employee.department}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                                <div
                                  className={`h-full ${
                                    employee.performance >= 90 ? 'bg-green-500' :
                                    employee.performance >= 75 ? 'bg-blue-500' :
                                    employee.performance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${employee.performance}%` }}
                                />
                              </div>
                              <span className={`font-semibold ${getPerformanceColor(employee.performance)}`}>
                                {employee.performance}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-900">{employee.tasksCompleted}/{employee.totalTasks}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(employee.status)}`}>
                              <StatusIcon className="w-3 h-3" />
                              {employee.status === 'active' ? 'Activo' : employee.status === 'vacation' ? 'Vacaciones' : 'Enfermo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-semibold text-gray-900">${employee.salary.toLocaleString()}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Performance Analysis */}
        {activeTab === 'performance' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Performance por Departamento</h3>
                <div className="space-y-4">
                  {departments.map((dept) => {
                    const deptEmployees = employees.filter(e => e.department === dept);
                    const avgPerformance = deptEmployees.length > 0
                      ? Math.round(deptEmployees.reduce((acc, e) => acc + e.performance, 0) / deptEmployees.length)
                      : 0;

                    return (
                      <div key={dept} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-900">{dept}</span>
                          <span className={`font-semibold ${getPerformanceColor(avgPerformance)}`}>
                            {avgPerformance}%
                          </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              avgPerformance >= 90 ? 'bg-green-500' :
                              avgPerformance >= 75 ? 'bg-blue-500' :
                              avgPerformance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${avgPerformance}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performers</h3>
                <div className="space-y-4">
                  {[...employees]
                    .sort((a, b) => b.performance - a.performance)
                    .slice(0, 5)
                    .map((employee, index) => (
                      <div key={employee.id} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-amber-600' :
                          'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-600">{employee.role}</div>
                        </div>
                        <div className={`font-bold text-lg ${getPerformanceColor(employee.performance)}`}>
                          {employee.performance}%
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Overview */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Distribución por Departamento</h3>
              <div className="space-y-3">
                {departments.map((dept) => {
                  const count = employees.filter(e => e.department === dept).length;
                  const percentage = (count / employees.length) * 100;

                  return (
                    <div key={dept} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-900">{dept}</span>
                        <span className="text-gray-600">{count} empleados ({Math.round(percentage)}%)</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Análisis IA de Equipo</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Recomendación: Capacitación</h4>
                      <p className="text-sm text-gray-700">
                        El departamento de Finanzas muestra un performance del 85%. Considera ofrecer capacitación
                        en nuevas herramientas de análisis financiero para mejorar la productividad.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Punto Fuerte</h4>
                      <p className="text-sm text-gray-700">
                        El departamento de Ventas tiene un performance excepcional del 95%.
                        Este equipo podría liderar programas de mentoría para otros departamentos.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Consideración de Crecimiento</h4>
                      <p className="text-sm text-gray-700">
                        Con una tasa de finalización de tareas del {stats.tasksCompletionRate}%,
                        tu equipo está operando cerca de su capacidad máxima. Considera contratar más personal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Payroll */}
        {activeTab === 'payroll' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Análisis de Nómina</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <div className="text-sm text-gray-600 mb-1">Costo Total Anual</div>
                  <div className="text-3xl font-bold text-gray-900">
                    ${(stats.monthlyPayroll * 12).toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200">
                  <div className="text-sm text-gray-600 mb-1">Promedio por Empleado</div>
                  <div className="text-3xl font-bold text-gray-900">
                    ${Math.round(stats.monthlyPayroll / stats.totalEmployees).toLocaleString()}/mes
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
                  <div className="text-sm text-gray-600 mb-1">Departamento más costoso</div>
                  <div className="text-2xl font-bold text-gray-900">Ventas</div>
                  <div className="text-sm text-gray-600">$85,000/año</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Desglose por Departamento</h4>
                {departments.map((dept) => {
                  const deptEmployees = employees.filter(e => e.department === dept);
                  const totalCost = deptEmployees.reduce((acc, e) => acc + e.salary, 0);
                  const monthlyAvg = deptEmployees.length > 0 ? totalCost / 12 / deptEmployees.length : 0;

                  if (deptEmployees.length === 0) return null;

                  return (
                    <div key={dept} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-semibold text-gray-900">{dept}</div>
                          <div className="text-sm text-gray-600">{deptEmployees.length} empleado(s)</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">${totalCost.toLocaleString()}/año</div>
                          <div className="text-sm text-gray-600">${Math.round(monthlyAvg).toLocaleString()}/mes por empleado</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
